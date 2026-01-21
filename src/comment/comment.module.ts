import { Module } from '@nestjs/common';
import { CommentService } from './comment.service';
import { CommentController } from './comment.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { PostModule } from 'src/post/post.module';
import { UsersModule } from 'src/users/users.module';
import { CommentGateway } from './comment.gateway';
import { Comment, CommentSchema } from './schemas/comment.schema';

@Module({
  imports: [MongooseModule.forFeature([{ name: Comment.name, schema: CommentSchema }]), PostModule, UsersModule],
  controllers: [CommentController],
  providers: [CommentService, CommentGateway],
  exports: [MongooseModule, CommentService]
})
export class CommentModule {}
