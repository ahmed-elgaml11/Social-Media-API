import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './schemas/user.schema';
import { Model } from 'mongoose';
import { IUserPaylod } from 'src/global';
import { UploadMediaDto } from 'src/_cores/global/dtos';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<User>,
  ) {}

  async findAll(currentUser: IUserPaylod, q: string, limit: number, cursor?: string ) {
    const query: Record<string, any> = { isActive: true }
    if (q) {
      query.$or = [
        { name: { $regex: q, $options: 'i' } },
        { email: { $regex: q, $options: 'i' } }
      ]
    }
    if (cursor) {
      query.email = { $gt: cursor  }
    } 

    const user = await this.getCurrentUser(currentUser.id)
    const friendsIds = new Set((user?.friends || []).map((friend) => friend._id.toString())) 




    const users = await this.userModel
      .find(query)
      .sort({ email: 1 })
      .limit(limit + 1)
      .lean();

    const hasNextPage = users.length > limit

    const items = (hasNextPage ? users.slice(0, limit) : users).map((user) => ({
      ...user,
      isFriend: friendsIds.has(user._id.toString())
    }))

    return {
      items,
      hasNextPage,
      cursor: hasNextPage ? items[items.length - 1].email : null
    };
  }




  async uploadAvatar(currentUser: IUserPaylod, uploadMediaDto: UploadMediaDto) {
    const user = await this.userModel.findById(currentUser.id)
    if (!user) {
      throw new NotFoundException('user not found')
    }
    user.avatar = uploadMediaDto
    return user.save()
  }

  async uploadCoverPhoto(currentUser: IUserPaylod, uploadMediaDto: UploadMediaDto) {
    const user = await this.userModel.findById(currentUser.id)
    if (!user) {
      throw new NotFoundException('user not found')
    }
    user.coverPhoto = uploadMediaDto
    return user.save()
  }







  async findOne(id: string) {
    const user = await this.userModel.findOne({ _id: id, isActive: true })
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    const user = await this.userModel.findByIdAndUpdate(id, updateUserDto, { new: true });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }

  async remove(id: string) {
    const user = await this.userModel.findByIdAndUpdate(id, { isActive: false }, { new: true });
    if (!user) {
      throw new NotFoundException('User not found');
    }
  }


  async addFriend(userId: string, friendId: string) {
    await this.userModel.findByIdAndUpdate(userId, {
      $addToSet: { friends: friendId }
    })
  }

  async removeFriend(userId: string, friendId: string) {
    await this.userModel.findByIdAndUpdate(userId, {
      $pull: { friends: friendId }
    }, { new: true })
  }

  async getFriends(userId: string) {
    const user = await this.userModel.findById(userId).populate('friends')
    if (!user) throw new NotFoundException('user not found')

    return user?.friends
  }

  async getCurrentUser(id: string) {
    const user = await this.userModel.findOne({ _id: id, isActive: true })
    if (!user) throw new NotFoundException('user not found')
    return user
  }

  async isFriend(userId: string, friendId: string) {
    const user = await this.userModel.findById(userId).select('friends')
    if (!user) throw new NotFoundException('user not found')
    return user.friends.some((friend) => friend._id.toString() === friendId)
  }

}
