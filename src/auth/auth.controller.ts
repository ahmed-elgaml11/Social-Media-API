import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignUpDto } from './dto/sign-up.dto';
import { transformToDtoResponse } from 'src/_cores/interceptors/transform-dto.interceptors';
import { ResponseAuthDto } from './dto/response-auth.dto';
import { AuthGuard } from 'src/_cores/guards/auth.guard';



@UseGuards(AuthGuard)
@transformToDtoResponse(ResponseAuthDto)
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) { }

  @Post('sign-up')
  async signUp(@Body() signupDto: SignUpDto) {
    return this.authService.signUp(signupDto);

    // return {
    //   message: 'User created successfully',
    //   data: {
    //     name: user.name,
    //     email: user.email
    //   }
    // }
  }



  @Post('sign-up')
  async signIn(@Body() signupDto: SignUpDto) {
    return this.authService.signIn(signupDto);
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

