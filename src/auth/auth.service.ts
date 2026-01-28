import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { SignUpDto } from './dto/sign-up.dto';
import { InjectModel } from '@nestjs/mongoose';
import { User } from 'src/users/schemas/user.schema';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { SignInDto } from './dto/sign-in.dto';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    private jwtService: JwtService,
    private userService: UsersService
  ) { }
  async signUp(signUpDto: SignUpDto) {

    const email = await this.userModel.findOne({ email: signUpDto.email });
    if (email) {
      throw new BadRequestException('Email Already Exists')
    }
    const hashPassword = await bcrypt.hash(signUpDto.password, 10);
    const user = new this.userModel({ ...signUpDto, password: hashPassword });
    const savedUser = await user.save()

    const payload = { 
      name: savedUser.name, 
      id: savedUser._id, 
      email: savedUser.email, 
      role: savedUser.role, 
      isActive: savedUser.isActive 
    };

    const access_token = await this.jwtService.signAsync(payload)

    const responseUser = this.userService.getCurrentUser(savedUser._id.toString());
    return { access_token, user: responseUser };

  }



  async signIn(signInDto: SignInDto) {
    const { email, password } = signInDto

    const user = await this.userModel.findOne({ email })
    if (!user) {
      throw new NotFoundException('Invalid Email Or Password')
    }
    if(!user.isActive){
      throw new BadRequestException('you no longer active')
    }

    if (!bcrypt.compare(user.password, password)) {
      throw new NotFoundException('Invalid Email Or Password')
    }
    const payload = { 
      name: user.name, 
      id: user._id, 
      email: user.email, 
      role: user.role, 
      isActive: user.isActive 
    };

    const access_token = await this.jwtService.signAsync(payload)
    return { access_token, user };

  }

}
