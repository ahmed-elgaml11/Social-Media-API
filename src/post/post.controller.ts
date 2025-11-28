import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Query, ParseIntPipe, DefaultValuePipe } from '@nestjs/common';
import { PostService } from './post.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { AuthGuard } from 'src/_cores/guards/auth.guard';
import { RoleGuard } from 'src/_cores/guards/role.guard';
import { Roles } from 'src/_cores/decorators/role.decorator';
import { transformToDtoResponse } from 'src/_cores/interceptors/transform-dto.interceptors';
import { ResponsePostDto } from './dto/response-post.dto';
import { CurrentUser } from 'src/_cores/decorators/currentUser.auth.decorator';
import type { IUserPaylod } from 'src/global';
import { ParseObjectIdPipe } from 'src/_cores/pipes/parse-objectid.pipe';
import { UploadMediaDto } from  '../_cores/global/dtos'
import { DeleteMediaDto } from './dto/delete-media.dto';
import { AddReactionDto } from './dto/add-reaction.dto';
import { RemoveReactionDto } from './dto/remove-reaction.dto';


@UseGuards(AuthGuard, RoleGuard)
@transformToDtoResponse(ResponsePostDto)
@Controller('posts')
export class PostController {
  constructor(private readonly postService: PostService) { }

  @Post()
  create(@Body() createPostDto: CreatePostDto, @CurrentUser() user: IUserPaylod) {
    return this.postService.create(createPostDto, user);
  }
  @Post('reaction')
  addReaction(@Body() addReactionDto: AddReactionDto, @CurrentUser() user: IUserPaylod) {
    return this.postService.addReaction(addReactionDto, user);
  }
  @Delete('reaction')
  removeReaction(@Body() removeReactionDto: RemoveReactionDto, @CurrentUser() user: IUserPaylod) {
    return this.postService.removeReaction(removeReactionDto, user);
  }

  @Get()
  findAll(@CurrentUser() user: IUserPaylod, @Query('limit' , new DefaultValuePipe(10), new ParseIntPipe()) limit: number = 10, @Query('cursor') cursor?: string) {
    return this.postService.findAll(user, limit, cursor);
  }

  @Get(':id')
  findOne(@Param('id', ParseObjectIdPipe) id: string, @CurrentUser() user: IUserPaylod) {
    return this.postService.findOneWithMyReaction(id, user);
  }

  @Patch(':id/upload')
  uploadMedia(@Body() uploadMediaDtos: UploadMediaDto[], @Param('id', ParseObjectIdPipe) id: string) {
    return this.postService.uploadMedia(id, uploadMediaDtos)
  }

  @Delete(':id/upload')
  removeMedia(@Param('id', ParseObjectIdPipe) id: string, @Body() deleteMediaDto: DeleteMediaDto) {
    return this.postService.removeMedia(id, deleteMediaDto)
  }

  @Roles('user', 'admin')
  @Patch(':id')
  update(@Param('id', ParseObjectIdPipe) id: string, @Body() updatePostDto: UpdatePostDto) {
    return this.postService.update(id, updatePostDto);
  }

  @Delete(':id')
  remove(@Param('id', ParseObjectIdPipe) id: string) {
    return this.postService.remove(id);
  }
}
