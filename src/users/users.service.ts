import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './schemas/user.schema';
import { Model } from 'mongoose';
import { IUserPaylod } from 'src/global';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<User>,
  ) {}

  findAll() {
    return this.userModel.find({isActive: true});
  }


  getMe(currentUser: IUserPaylod) {
    return this.userModel.findById(currentUser.id, {isActive: true});
  }


  async findOne(id: string) {
    const user = await this.userModel.findById(id, {isActive: true});
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
