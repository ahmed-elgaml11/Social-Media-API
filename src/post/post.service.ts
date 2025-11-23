import { Injectable, NotFoundException } from '@nestjs/common';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Post } from './schemas/post.schema';
import { Model } from 'mongoose';
import { User } from 'src/users/schemas/user.schema';
import { IUserPaylod } from 'src/global';
import { UploadMediaDto } from './dto/upload-media.dto';
import { DeleteMediaDto } from './dto/delete-media.dto';
import { AddReactionDto } from './dto/add-reaction.dto';
import { ReactionService } from 'src/reaction/reaction.service';

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

    const hasNextPage = posts.length > limit

    const items = hasNextPage ? posts.slice(0, limit) : posts

    return {
        items,
        hasNextPage,
        cursor: hasNextPage ? items[items.length -1].createdAt : null
      }
  }

  findOne(id: string) {
    return this.postModel.findById(id);
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

  }
}
