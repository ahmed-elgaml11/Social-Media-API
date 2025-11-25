import { Injectable, NotFoundException } from '@nestjs/common';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Post } from './schemas/post.schema';
import { Model } from 'mongoose';
import { User } from 'src/users/schemas/user.schema';
import { IReactionType, IUserPaylod } from 'src/global';
import { UploadMediaDto } from './dto/upload-media.dto';
import { DeleteMediaDto } from './dto/delete-media.dto';
import { AddReactionDto } from './dto/add-reaction.dto';
import { ReactionService } from 'src/reaction/reaction.service';
import { RemoveReactionDto } from './dto/remove-reaction.dto';

@Injectable()
export class PostService {
  constructor(
    @InjectModel(Post.name) private postModel: Model<Post>,
    @InjectModel(User.name) private userModel: Model<User>,
    private readonly reactionService: ReactionService,
  ) { }

  async create(createPostDto: CreatePostDto, user: IUserPaylod) {
    const post = new this.postModel({
      ...createPostDto,
      author: user
    })
    return post.save();
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
  }

  async removeMedia(id: string, deleteMediaDto: DeleteMediaDto) {
    const post = await this.postModel.findById(id)
    if (!post) {
      throw new NotFoundException('post not found')
    }
    post.mediaFiles = post.mediaFiles.filter((media) => media.public_id !== deleteMediaDto.mediaId)
    await post.save()
  }




  async findAll(user: IUserPaylod, limit: number, cursor?: string) {

    const query: Record<string, object> = {}
    if (cursor) {
      query.createdAt = { $lt: new Date(cursor) }
    }

    const posts = await this.postModel
      .find(query)
      .populate('author')
      .lean()
      .sort({ createdAt: -1 })
      .limit(limit + 1);

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
    return post
  }

  async remove(id: string) {
    const post = await this.postModel.findByIdAndDelete(id);
    if (!post) {
      throw new NotFoundException('post not found')
    }
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

    const updatePost = await this.postModel.findByIdAndUpdate(postId, {
      $inc: updateOps
    }, { new: true })


    return updatePost;

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
  }










}
