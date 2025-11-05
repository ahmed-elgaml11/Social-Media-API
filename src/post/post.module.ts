import { Module } from '@nestjs/common';
import { PostService } from './post.service';
import { PostController } from './post.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { User } from 'src/users/schemas/user.schema';
import { Post, PostSchema } from './schemas/post.schema';
import { UsersModule } from 'src/users/users.module';

@Module({
  imports: [MongooseModule.forFeature([{ name: Post.name, schema: PostSchema }]), UsersModule],
  controllers: [PostController],
  providers: [PostService],
  exports: [MongooseModule]
})
export class PostModule {}
