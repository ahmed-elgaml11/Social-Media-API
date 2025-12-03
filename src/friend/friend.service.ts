import { BadRequestException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateFriendDto } from './dto/create-friend.dto';
import { UpdateFriendDto } from './dto/update-friend.dto';
import { IUserPaylod } from 'src/global';
import { InjectModel } from '@nestjs/mongoose';
import { FriendRequest } from './schemas/friend-request.schema';
import { Model } from 'mongoose';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class FriendService {
  constructor(@InjectModel(FriendRequest.name) private friendRequestModel: Model<FriendRequest>,
  private readonly userService: UsersService
  ) {}
  async create(currentUser: IUserPaylod, receiverId: string) {
    const reciever = await this.userService.findOne(receiverId)

    if(currentUser.id === receiverId){
      throw new BadRequestException('not allowed to send friend request to yourself')
    }

    const existingFriendRequest = await this.friendRequestModel.findOne({
      sender: currentUser.id,
      reciever: receiverId,
      status: { $in: ['pending', 'accept'] }
    })
    if(existingFriendRequest){
      throw new BadRequestException('the friend request is sent before')
    }

    const friendRequest = new this.friendRequestModel({
      sender: currentUser.id,
      reciever: receiverId,
      status: 'pending'
    })
  
    return friendRequest.save()

  }

  
  async remove(currentUser: IUserPaylod, receiverId: string) {
    const receiver = await this.userService.findOne(receiverId)

    const friendRequest = await this.friendRequestModel.findOne({
      sender: currentUser.id,
      receiver: receiverId,
      status: 'pending'
    })

    if(!friendRequest){
      throw new NotFoundException(' the frind requst is not exist')
    }

    await this.friendRequestModel.deleteOne({ _id: friendRequest._id })


  }






  async acceptFriendRequest(user: IUserPaylod, friendRequestId: string){
    const friendRequest = await this.friendRequestModel.findById(friendRequestId)
    if(!friendRequest){
      throw new NotFoundException('friend request not found')
    }
    if(friendRequest.status != 'pending'){
      throw new BadRequestException('request already handled')
    }
    if(user.id != friendRequest.receiver._id.toString()){
      throw new ForbiddenException()
    }
    friendRequest.status = 'accept'
    await friendRequest.save()

    await this.userService.addFriend(friendRequest.sender._id.toString(), friendRequest.receiver._id.toString())

    await this.userService.addFriend(friendRequest.receiver._id.toString(), friendRequest.sender._id.toString())
  }

  async rejectFriendRequest(user: IUserPaylod, friendRequestId: string){
    const friendRequest = await this.friendRequestModel.findById(friendRequestId)
    if(!friendRequest){
      throw new NotFoundException('friend request not found')
    }
    if(friendRequest.status != 'pending'){
      throw new BadRequestException('request already handled')
    }
    if(user.id != friendRequest.receiver._id.toString()){
      throw new ForbiddenException()
    }
    friendRequest.status = 'reject'
    await friendRequest.save()
  }


  async getCurrentPendingRequest(user: IUserPaylod){
    return  this.friendRequestModel.find({
      receiver: user.id,
      status: 'pending'
    }).populate('sender', 'name email avatar')
  }


  async getCurrentFriends(user: IUserPaylod){
    // const incommingFriends = await this.friendRequestModel.find({
    //   receiver: user.id,
    //   status: 'accept'
    // }).populate('sender', 'name email avatar')
    // const outgoingFriends = await this.friendRequestModel.find({
    //   sender: user.id,
    //   status: 'accept'
    // }).populate('receiver', 'name email avatar')

    return this.userService.getFriends(user.id)

  }


}
