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

  findAll() {
    return this.userModel.find({isActive: true});
  }


  getMe(currentUser: IUserPaylod) {
    return this.userModel.findOne({_id: currentUser.id, isActive: true})
  }


  async uploadAvatar(currentUser: IUserPaylod, uploadMediaDto: UploadMediaDto){
    const user = await this.userModel.findById(currentUser.id)
    if(!user){
      throw new NotFoundException('user not found')
    }
    user.avatar = uploadMediaDto
    return user.save()
  }

  async uploadCoverPhoto(currentUser: IUserPaylod, uploadMediaDto: UploadMediaDto){
    const user = await this.userModel.findById(currentUser.id)
    if(!user){
      throw new NotFoundException('user not found')
    }
    user.coverPhoto = uploadMediaDto
    return user.save()
  }







  async findOne(id: string) {
    const user = await this.userModel.findOne({_id: id, isActive: true})
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
    const user = await this.userModel.findByIdAndUpdate(id, { isActive: false }, { new: true } );
    if (!user) {
      throw new NotFoundException('User not found');
    }
  }
}
