import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { SignUpDto } from './dto/sign-up.dto';
import { InjectModel } from '@nestjs/mongoose';
import { User } from 'src/users/schemas/user.schema';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { SignInDto } from './dto/sign-in.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    private jwtService: JwtService
  ) { }
  async signUp(signUpDto: SignUpDto) {
    console.log('signUpDto', signUpDto);

    const email = await this.userModel.findOne({ email: signUpDto.email });
    if (email) {
      throw new BadRequestException('Email Already Exists')
    }
    const hashPassword = await bcrypt.hash(signUpDto.password, 10);
    const user = new this.userModel({ ...signUpDto, password: hashPassword });
    const savedUser = await user.save()

    const payload = { name: savedUser.name, id: savedUser._id, email: savedUser.email, role: savedUser.role };

    const access_token = await this.jwtService.signAsync(payload)
    return { access_token, user: savedUser };

  }



  async signIn(signInDto: SignInDto) {
    const { email, password } = signInDto

    const user = await this.userModel.findOne({ email })
    if (!user) {
      throw new NotFoundException('Invalid Email Or Password')
    }

    if (!bcrypt.compare(user.password, password)) {
      throw new NotFoundException('Invalid Email Or Password')
    }
    const payload = { name: user.name, id: user._id, email: user.email };

    const access_token = await this.jwtService.signAsync(payload)
    return { access_token, user };

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
