import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req } from '@nestjs/common';
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


@UseGuards(AuthGuard, RoleGuard)
@transformToDtoResponse(ResponseUserDto)
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) { }


  @Roles('admin', 'user')
  @Get('profile')
  getMe(@CurrentUser() currentUser: IUserPaylod) {
    return this.usersService.getMe(currentUser);
  }


  @Roles('admin')
  @Get()
  findAll() {
    return this.usersService.findAll();
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
