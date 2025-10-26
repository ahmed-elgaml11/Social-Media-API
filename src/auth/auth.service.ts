import { Injectable } from '@nestjs/common';
import { SignUpDto } from './dto/create-auth.dto';
import { InjectModel } from '@nestjs/mongoose';
import { User } from 'src/users/schemas/user.schema';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(@InjectModel(User.name) private userModel: Model<User>) { }
  async create(signUpDto: SignUpDto) {
    const hashPassword = await bcrypt.hash(signUpDto.password, 10);
    const user = new this.userModel({ ...SignUpDto, password: hashPassword });
    return user.save();
  }

  findAll() {
    return `This action returns all auth`;
  }

  findOne(id: number) {
    return `This action returns a #${id} auth`;
  }

  remove(id: number) {
    return `This action removes a #${id} auth`;
  }
}
