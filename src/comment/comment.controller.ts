import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { CommentService } from './comment.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { CurrentUser } from 'src/_cores/decorators/currentUser.auth.decorator';
import * as global from 'src/global';
import { ObjectId } from 'src/_cores/decorators/object-id.decorator';
import { ParseObjectIdPipe } from 'src/_cores/pipes/parse-objectid.pipe';

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

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateCommentDto: UpdateCommentDto) {
    return this.commentService.update(+id, updateCommentDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.commentService.remove(+id);
  }


  @Get('post/:postId')
  findCommentsByPost(@Param('postId', ParseObjectIdPipe) postId: string) {
    return this.commentService.findCommentsByPost(postId);
  }
}
