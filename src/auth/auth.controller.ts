import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { AuthService } from './auth.service';
import {  SignUpDto } from './dto/create-auth.dto';
import { transformToDtoResponse } from 'src/_cores/interceptors/transform-dto.interceptors';
import { ResponseAuthto } from './dto/response-auth.dto';



@transformToDtoResponse(ResponseAuthto)
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('sign-up')
  async create(@Body() signupDto: SignUpDto) {
    return this.authService.create(signupDto);

    // return {
    //   message: 'User created successfully',
    //   data: {
    //     name: user.name,
    //     email: user.email
    //   }
    // }
  }


  @Get()
  findAll() {
    return this.authService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.authService.findOne(+id);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.authService.remove(+id);
  }
}

