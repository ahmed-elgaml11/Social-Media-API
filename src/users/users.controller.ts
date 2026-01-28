import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req, UseInterceptors, Query, ParseIntPipe, DefaultValuePipe } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { AuthGuard } from 'src/_cores/guards/auth.guard';
import express from 'express';
import { CurrentUser } from 'src/_cores/decorators/currentUser.auth.decorator';
import type { IUserPaylod } from 'src/global';
import { transformToDtoResponse } from 'src/_cores/interceptors/transform-dto.interceptors';
import { ResponseUserDto } from './dto/response-user.dto';
import { Roles } from 'src/_cores/decorators/role.decorator';
import { RoleGuard } from 'src/_cores/guards/role.guard';
import { ParseObjectIdPipe } from 'src/_cores/pipes/parse-objectid.pipe';
import { UploadMediaDto } from 'src/_cores/global/dtos';


@UseGuards(AuthGuard, RoleGuard)
@transformToDtoResponse(ResponseUserDto)
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) { }

  @Get('profile')
  getMe(@CurrentUser() currentUser: IUserPaylod) {
    return this.usersService.getCurrentUser(currentUser.id);
  }



  @Post('upload-avatar')
  uploadAvatar(@Body() uploadMediaDto: UploadMediaDto,  @CurrentUser() user: IUserPaylod){
    return this.usersService.uploadAvatar(user, uploadMediaDto)
  }


  @Post('upload-cover')
  uploadCoverPhoto(@Body() uploadMediaDto: UploadMediaDto,  @CurrentUser() user: IUserPaylod){
    return this.usersService.uploadCoverPhoto(user, uploadMediaDto)
  }


  @Get()
  findAll(@CurrentUser() currentUser: IUserPaylod, @Query('q') q?: string, @Query('limit', new DefaultValuePipe(10), new ParseIntPipe()) limit: number = 10, @Query('cursor') cursor?: string) {

    return this.usersService.findAll(currentUser, q, limit, cursor);
  }

  @Get(':id')
  findOne(@Param('id', ParseObjectIdPipe) id: string) {
    return this.usersService.findOne(id);
  }

  
  @Roles('admin', 'user')
  @Patch(':id')
  update(@Param('id', ParseObjectIdPipe) id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(id, updateUserDto);
  }

  
  @Roles('admin', 'user')
  @Delete(':id')
  async remove(@Param('id', ParseObjectIdPipe) id: string) {
    await this.usersService.remove(id);
  }
}
