import { Module } from '@nestjs/common';
import { CommentService } from './comment.service';
import { CommentController } from './comment.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { PostModule } from 'src/post/post.module';
import { UsersModule } from 'src/users/users.module';

@Module({
  imports: [MongooseModule.forFeature([{ name: 'Comment', schema: 'CommentSchema' }]), PostModule, UsersModule],
  controllers: [CommentController],
  providers: [CommentService],
})
export class CommentModule {}
