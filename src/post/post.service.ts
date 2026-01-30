import { Injectable, NotFoundException } from '@nestjs/common';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Post } from './schemas/post.schema';
import { Model } from 'mongoose';
import { IUserPaylod } from 'src/global';
import { UploadMediaDto } from '../_cores/global/dtos'
import { DeleteMediaDto } from './dto/delete-media.dto';
import { AddReactionDto } from './dto/add-reaction.dto';
import { ReactionService } from 'src/reaction/reaction.service';
import { RemoveReactionDto } from './dto/remove-reaction.dto';
import { plainToInstance } from 'class-transformer';
import { ResponsePostDto } from './dto/response-post.dto';
import { PostGateway } from './post.gateway';
import { NotificationService } from 'src/notification/notification.service';
import { UsersService } from 'src/users/users.service';
import { ResponsePostReactionDto } from './dto/response-post-reaction.dto';
import { ConversationModule } from 'src/conversation/conversation.module';

@Injectable()
export class PostService {
  constructor(
    @InjectModel(Post.name) private postModel: Model<Post>,
    private readonly userService: UsersService,
    private readonly reactionService: ReactionService,
    private readonly postGateway: PostGateway,
    private readonly notificationService: NotificationService
  ) { }

  async create(createPostDto: CreatePostDto, user: IUserPaylod) {
    const post = new this.postModel({
      ...createPostDto,
      author: user.id
    })
    const savedPost = await post.save();
    const populatedPost = await savedPost.populate('author', '_id name email');
    const responsePost = plainToInstance(ResponsePostDto, populatedPost, { excludeExtraneousValues: true });
    this.postGateway.handlePostCreate(responsePost);
    return responsePost;
  }

  async uploadMedia(id: string, uploadMediaDtos: UploadMediaDto[]) {
    const post = await this.postModel.findById(id)
    if (!post) {
      throw new NotFoundException('post not found')
    }
    uploadMediaDtos.forEach(media => {
      post.mediaFiles.push(media)
    });
    const savedPost = await post.save()
    this.postGateway.handleUploadMedia(post._id.toString(), savedPost.mediaFiles);
    return savedPost;
  }

  async replaceMedia(id: string, uploadMediaDtos: UploadMediaDto[]) {
    const post = await this.postModel.findById(id)
    if (!post) {
      throw new NotFoundException('post not found')
    }
    post.mediaFiles = uploadMediaDtos

    const savedPost = await post.save()

    this.postGateway.handleReplacedMedia(post._id.toString(), uploadMediaDtos);
    return savedPost;
  }

  async removeMedia(id: string, deleteMediaDto: DeleteMediaDto) {
    const post = await this.postModel.findById(id)
    if (!post) {
      throw new NotFoundException('post not found')
    }
    post.mediaFiles = post.mediaFiles.filter((media) => media.public_id !== deleteMediaDto.mediaId)
    await post.save()

    this.postGateway.handleRemoveMedia(post._id.toString(), deleteMediaDto);
  }




  async findAll(user: IUserPaylod, limit: number, cursor?: string) {

    const currentUser = await this.userService.findOne(user.id);
    const friendsIds = currentUser?.friends.map((friend) => friend._id.toString());


    const query: Record<string, object> = {
      $or: [
        { privacy: 'public' },
        { privacy: 'friends', author: { $in: friendsIds } },
        { privacy: 'private', author: user.id }
      ]
    }
    if (cursor) {
      query.createdAt = { $lt: new Date(cursor) }
    }

    const posts = await this.postModel
      .find(query)
      .populate('author')
      .sort({ createdAt: -1 })
      .limit(limit + 1)
      .lean()


    const postsWithMyReactions = await Promise.all(posts.map(async (post) => {
      const existingReaction = await this.reactionService.findExistingReaction(user.id, post._id.toString());
      return {
        ...post,
        myReaction: existingReaction ? existingReaction.type : null
      }
    }))

    const hasNextPage = postsWithMyReactions.length > limit

    const items = hasNextPage ? postsWithMyReactions.slice(0, limit) : postsWithMyReactions

    return {
      items,
      hasNextPage,
      cursor: hasNextPage ? items[items.length - 1].createdAt : null
    };
  }

  async findOne(id: string) {
    const post = await this.postModel.findById(id);
    if (!post) {
      throw new NotFoundException('post not found')
    }
    return post;
  }

  async findOneWithMyReaction(id: string, user: IUserPaylod) {
    const post = await this.postModel.findById(id).lean();
    if (!post) {
      throw new NotFoundException('post not found')
    }

    const existingReaction = await this.reactionService.findExistingReaction(user.id, post._id.toString());
    return {
      ...post,
      myReaction: existingReaction ? existingReaction.type : null
    }
  }


  async update(id: string, updatePostDto: UpdatePostDto) {
    const post = await this.postModel.findByIdAndUpdate(id, updatePostDto, { new: true });
    if (!post) {
      throw new NotFoundException('post not found')
    }

    this.postGateway.handlePostUpdate({ postId: post._id.toString(), backgroundColor: post.backgroundColor, content: post.content, privacy: post.privacy });

    return post
  }

  async remove(id: string) {
    const post = await this.postModel.findByIdAndDelete(id);
    if (!post) {
      throw new NotFoundException('post not found')
    }
    this.postGateway.handlePostRemove(post._id.toString());
  }



  async addReaction(addReactionDto: AddReactionDto, currentUser: IUserPaylod) {
    const { postId, reactionType } = addReactionDto;
    const post = await this.findOne(postId);
    const existingReaction = await this.reactionService.findExistingReaction(currentUser.id, postId);
    if (existingReaction && existingReaction.type === reactionType) return;

    const updateOps: Record<string, number> = {
      [`reactionsCount.${reactionType}`]: 1
    }

    if (existingReaction) {
      // Update reaction type
      console.log('zzzz')
      await this.reactionService.update(existingReaction._id.toString(), reactionType);
      updateOps[`reactionsCount.${existingReaction.type}`] = -1

    } else {
      console.log('xxxx')

      await this.reactionService.create(addReactionDto, currentUser);
    }

    const updatedPost = await this.postModel.findByIdAndUpdate(postId, {
      $inc: updateOps
    }, { new: true })

    const populatedPost = await this.postModel.findById(postId).populate('author')

    if (!updatedPost) {
      throw new NotFoundException('post not found')
    }

    const reactions = await this.findReactions(updatedPost._id.toString())

    const responsePost = plainToInstance(ResponsePostDto, populatedPost, {
      excludeExtraneousValues: true,
    });
    const responseReactions = plainToInstance(ResponsePostReactionDto, reactions, { excludeExtraneousValues: true })
    
    this.postGateway.handleAddReaction(
      { 
        ... responsePost,
        myReaction: reactionType 

      },
      responseReactions
    );


    // send notification
    const notificationContent = `${currentUser.name} ${reactionType} to your post`
    await this.notificationService.create(currentUser.id, post.author._id.toString(), 'reaction', notificationContent, postId);
  }


  async removeReaction(removeReactionDto: RemoveReactionDto, currentUser: IUserPaylod) {
    const { postId } = removeReactionDto;
    const post = await this.findOne(postId);
    const existingReaction = await this.reactionService.findExistingReaction(postId, currentUser.id);
    if (!existingReaction) return;

    const reactionType = existingReaction.type;
    await this.reactionService.remove(existingReaction._id.toString());

    const savedPost = await this.postModel.findByIdAndUpdate(postId, {
      $inc: { [`reactionsCount.${reactionType}`]: -1 }
    }, { new: true })

    const populatedPost = await this.postModel.findById(postId).populate('author')

    const responsePost = plainToInstance(ResponsePostDto, populatedPost, {
      excludeExtraneousValues: true,
    });
    this.postGateway.handleRemoveReaction(responsePost);

    return savedPost;
  }


  async findReactions(postId: string) {
    const post = await this.findOne(postId);
    return this.reactionService.findPostReactions(postId);
  }
}
