import { Injectable, NotFoundException } from '@nestjs/common';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Post } from './schemas/post.schema';
import { Model } from 'mongoose';
import { User } from 'src/users/schemas/user.schema';
import {  IUserPaylod } from 'src/global';
import { UploadMediaDto } from  '../_cores/global/dtos'
import { DeleteMediaDto } from './dto/delete-media.dto';
import { AddReactionDto } from './dto/add-reaction.dto';
import { ReactionService } from 'src/reaction/reaction.service';
import { RemoveReactionDto } from './dto/remove-reaction.dto';
import { plainToInstance } from 'class-transformer';
import { ResponsePostDto } from './dto/response-post.dto';
import { PostGateway } from './post.gateway';

@Injectable()
export class PostService {
  constructor(
    @InjectModel(Post.name) private postModel: Model<Post>,
    @InjectModel(User.name) private userModel: Model<User>,
    private readonly reactionService: ReactionService,
    private readonly postGateway: PostGateway,
  ) { }

  async create(createPostDto: CreatePostDto, user: IUserPaylod) {
    const post = new this.postModel({
      ...createPostDto,
      author: user
    })
    const savedPost = await post.save();
    const responsePost = plainToInstance(ResponsePostDto, savedPost);
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

    await post.save()

    this.postGateway.handleUploadMedia(post._id.toString(), uploadMediaDtos);
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

    const query: Record<string, object> = {}
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

     this.postGateway.handlePostUpdate({postId: post._id.toString(), backgroundColor: post.backgroundColor, content: post.content, privacy: post.privacy});

    return post
  }

  async remove(id: string) {
    const post = await this.postModel.findByIdAndDelete(id);
    if (!post) {
      throw new NotFoundException('post not found')
    }
    this.postGateway.handlePostRemove(post._id.toString());
    return post
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
      await this.reactionService.update(existingReaction._id.toString(), reactionType);
      updateOps[`reactionsCount.${existingReaction.type}`] = -1

    } else {
      await this.reactionService.create(addReactionDto, currentUser);
    }

    const updatedPost = await this.postModel.findByIdAndUpdate(postId, {
      $inc: updateOps
    }, { new: true }) 

    const responsePost = plainToInstance(ResponsePostDto, updatedPost, {
      excludeExtraneousValues: true,
    });
    this.postGateway.handleAddReaction(responsePost);


    return updatedPost;

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

    const responsePost = plainToInstance(ResponsePostDto, savedPost, {
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
