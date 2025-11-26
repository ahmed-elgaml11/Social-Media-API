import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { CommentService } from './comment.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { CurrentUser } from 'src/_cores/decorators/currentUser.auth.decorator';
import * as global from 'src/global';
import { ParseObjectIdPipe } from 'src/_cores/pipes/parse-objectid.pipe';
import { transformToDtoResponse } from 'src/_cores/interceptors/transform-dto.interceptors';
import { ResponseCommentDto } from './dto/response-comment.dto';
import { RoleGuard } from 'src/_cores/guards/role.guard';
import { AuthGuard } from 'src/_cores/guards/auth.guard';
import { Roles } from 'src/_cores/decorators/role.decorator';


@transformToDtoResponse(ResponseCommentDto)
@UseGuards(AuthGuard, RoleGuard)
@Controller('comment')
export class CommentController {
  constructor(private readonly commentService: CommentService) {}

  @Post()
  create(@Body() createCommentDto: CreateCommentDto, @CurrentUser() user: global.IUserPaylod) {
    return this.commentService.create(createCommentDto, user);
  }

  @Get()
  findAll() {
    return this.commentService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.commentService.findOne(+id);
  }

  @Roles('admin', 'user')
  @Patch(':id')
  update(@Param('id', ParseObjectIdPipe) id: string, @Body() updateCommentDto: UpdateCommentDto) {
    return this.commentService.update(id, updateCommentDto);
  }

  @Roles('admin', 'user')
  @Delete(':id')
  remove(@Param('id', ParseObjectIdPipe) id: string) {
    return this.commentService.remove(id);
  }


  @Get('post/:postId')
  findCommentsByPost(@Param('postId', ParseObjectIdPipe) postId: string) {
    return this.commentService.findCommentsByPost(postId);
  }
}
