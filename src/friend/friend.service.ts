import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateFriendDto } from './dto/create-friend.dto';
import { UpdateFriendDto } from './dto/update-friend.dto';
import { IUserPaylod } from 'src/global';
import { InjectModel } from '@nestjs/mongoose';
import { FriendRequest } from './schemas/friend-request.schema';
import { Model } from 'mongoose';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class FriendService {
  constructor(@InjectModel(FriendRequest.name) private friendRequest: Model<FriendRequest>,
  private readonly userService: UsersService
  ) {}
  async create(currentUser: IUserPaylod, receiverId: string) {
    const reciever = await this.userService.findOne(receiverId)

    if(currentUser.id === receiverId){
      throw new BadRequestException('not allowed to send friend request to your self')
    }

    const existingFriendRequest = await this.friendRequest.findOne({
      sender: currentUser.id,
      reciever: receiverId
    })
    if(existingFriendRequest){
      throw new BadRequestException('the friend request is sent before')
    }

    const friendRequest = new this.friendRequest({
      sender: currentUser.id,
      reciever: receiverId,
      status: 'pending'
    })
  
    return friendRequest.save()

  }

  findAll() {
    return `This action returns all friend`;
  }

  findOne(id: number) {
    return `This action returns a #${id} friend`;
  }

  update(id: number, updateFriendDto: UpdateFriendDto) {
    return `This action updates a #${id} friend`;
  }

  remove(id: number) {
    return `This action removes a #${id} friend`;
  }
}
