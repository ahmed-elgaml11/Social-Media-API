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
import { plainToInstance } from 'class-transformer';
import { ResponseCommentDto } from './dto/response-comment.dto';
import { CommentGateway } from './comment.gateway';

@Injectable()
export class CommentService {
  constructor(
    @InjectModel(Comment.name) private commentModel: Model<Comment>,
    private readonly postService: PostService,
    private readonly userService: UsersService,
    private readonly commentGateway: CommentGateway,
  ) { }

  async create(createCommentDto: CreateCommentDto, user: IUserPaylod) {
    const { content, postId, repliyToUserId, parentCommentId } = createCommentDto;
    const post = await this.postService.findOne(postId);
    let realParentCommentId: string | null = null;
    let realReplyToUserId: string | null = null;

    if (repliyToUserId) {
      const replyToUser = await this.userService.findOne(repliyToUserId);
      realReplyToUserId = replyToUser._id.toString();
    }
    if (parentCommentId) {
      const parentComment = await this.commentModel.findById(parentCommentId);
      if (!parentComment) {
        throw new NotFoundException('Parent comment not found');
      }

      realParentCommentId = parentComment.parent?._id ? parentComment.parent._id.toString() : parentComment._id.toString();

    }

    const comment = new this.commentModel({
      content,
      post: postId,
      replyToUser: realReplyToUserId,
      parent: realParentCommentId,
      user: user.id,
    })


    const savedComment = await comment.save();

    const populateComment = await this.findOne(savedComment._id.toString());

    const responseComment = plainToInstance(ResponseCommentDto, populateComment, { excludeExtraneousValues: true });

    this.commentGateway.handleCommentCreate(postId, responseComment);





    return savedComment;

  }

  async findCommentsByPost(postId: string) {
    const post = await this.postService.findOne(postId);
    const comments = await this.commentModel
      .find({ post: postId })
      .populate('user')
      .populate('replyToUser')
      .sort({ createdAt: 1 })
      .lean();

    let finalResult: any[] = []
    for (const comment of comments) {
      if (!comment.parent) {
        finalResult.push({ ...comment, replies: [] })
      } else {
        const rootComment = finalResult.find(c => c._id.toString() === comment.parent?._id?.toString());
        if (rootComment) {
          rootComment.replies.push(comment);
        }

      }
    }
    return finalResult;
  }


  async findOne(id: string) {
    const comment = await this.commentModel.findById(id);
    if (!comment) {
      throw new NotFoundException('Comment not found');
    }
    return comment;
  }

  async update(id: string, updateCommentDto: UpdateCommentDto) {
    const content = updateCommentDto.content;
    const comment = await this.commentModel.findByIdAndUpdate(id, { content }, { new: true });
    if (!comment) {
      throw new NotFoundException('Comment not found');
    }

    this.commentGateway.handleCommentUpdate(id, comment.content, comment.updatedAt);
    return comment;
  }

  async remove(id: string) {
    const comment = await this.commentModel.findByIdAndDelete(id);
    if (!comment) {
      throw new NotFoundException('Comment not found');
    }
    if (comment.parent === null) {
      await this.commentModel.deleteMany({ parent: comment._id });
    }


    this.commentGateway.handleCommentRemove(id, comment.parent?._id?.toString());

    return comment;
  }
}
