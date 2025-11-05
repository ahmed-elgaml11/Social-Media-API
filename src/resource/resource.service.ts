import { BadRequestException, Global, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Post } from 'src/post/schemas/post.schema';
import { User } from 'src/users/schemas/user.schema';

@Injectable()
export class ResourceService {
    constructor(
        @InjectModel(Post.name) private postModel: Model<Post>,
        @InjectModel(User.name) private userModel: Model<User>,
    ) { }

    async getResource(resourceType: string, resourceId: string) {
        switch (resourceType) {
            case 'users': {
                const user = await this.userModel.findById(resourceId)
                if (!user) throw new BadRequestException('user not found')
                return user._id.toString()
            }
            case 'posts': {
                const post = await this.postModel.findById(resourceId)
                if (!post) throw new BadRequestException('post not found')
                return post.user?._id.toString()
            }
            default:
                throw new NotFoundException('resource not found')
        }

    }
}
