import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignUpDto } from './dto/sign-up.dto';
import { transformToDtoResponse } from 'src/_cores/interceptors/transform-dto.interceptors';
import { ResponseUserDto } from 'src/users/dto/response-user.dto';
import { SignInDto } from './dto/sign-in.dto';



@transformToDtoResponse(ResponseUserDto)
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) { }

  @Post('sign-up')
  async signUp(@Body() signupDto: SignUpDto) {
    return this.authService.signUp(signupDto);
  }



  @Post('sign-in')
  async signIn(@Body() signInDto: SignInDto) {
    return this.authService.signIn(signInDto);
  }
}

