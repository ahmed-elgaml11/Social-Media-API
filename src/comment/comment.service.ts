import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Comment } from './schemas/comment.schema';
import { Model } from 'mongoose';
import { PostService } from 'src/post/post.service';
import { IUserPaylod } from 'src/global';
import { UsersController } from 'src/users/users.controller';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class CommentService {
  constructor(
    @InjectModel(Comment.name) private commentModel: Model<Comment>,
    private readonly postService: PostService,
    private readonly userService: UsersService,
  ) { }

  async create(createCommentDto: CreateCommentDto, user: IUserPaylod) {
    const { content, postId, repliesToUserId, parentCommentId } = createCommentDto;
    const post = await this.postService.findOne(postId);
    let realParentCommentId: string | null = null;
    let realReplyToUserId: string | null = null;

    if (repliesToUserId) {
      const replyToUser = await this.userService.findOne(repliesToUserId);
      realReplyToUserId = replyToUser._id.toString();
    }
    if (parentCommentId) {
      const parentComment = await this.commentModel.findById(parentCommentId);
      if (!parentComment) {
        throw new NotFoundException('Parent comment not found');
      }

      realParentCommentId = parentComment.parent ? parentComment.parent._id.toString() : parentComment._id.toString();

    } 

    const comment = new this.commentModel({
        content,
        post: postId,
        replyToUser: realReplyToUserId,
        parent: realParentCommentId,
        user: user.id,
     })


     return comment.save();

  }

  async findCommentsByPost(postId: string) {
    const post = await this.postService.findOne(postId);
    const comments = await this.commentModel.find({ post: postId }).populate('user').populate('replyToUser').lean();

    let result : any[] = []
    for (const comment of comments) {
      if (!comment.parent) {
        result.push({...comment, replies: []})
      }else{
        
      }
    }
  }

  findAll() {
    return `This action returns all comment`;
  }

  findOne(id: number) {
    return `This action returns a #${id} comment`;
  }

  update(id: number, updateCommentDto: UpdateCommentDto) {
    return `This action updates a #${id} comment`;
  }

  remove(id: number) {
    return `This action removes a #${id} comment`;
  }
}
