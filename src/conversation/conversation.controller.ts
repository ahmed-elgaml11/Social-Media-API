import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Query, ParseIntPipe, DefaultValuePipe } from '@nestjs/common';
import { ConversationService } from './conversation.service';
import { UpdateConversationDto } from './dto/update-conversation.dto';
import { CreatePrivateConversationDto } from './dto/create-private-conservation.dto';
import { CurrentUser } from 'src/_cores/decorators/currentUser.auth.decorator';
import type { IUserPaylod } from 'src/global';
import { AuthGuard } from 'src/_cores/guards/auth.guard';
import { CreateGroupConversationDto } from './dto/create-group-conversation.dto';

@Controller('conversations')
@UseGuards(AuthGuard)
export class ConversationController {
  constructor(private readonly conversationService: ConversationService) {}
  @Post('group')
  createGroup(@Body() createGroupConversationDto: CreateGroupConversationDto, @CurrentUser() currentUser: IUserPaylod) {
    return this.conversationService.createGroup(createGroupConversationDto, currentUser);
  }


  @Post('private')
  createPrivate(@Body() createPrivateConversationDto: CreatePrivateConversationDto, @CurrentUser() currentUser: IUserPaylod ) {
    return this.conversationService.createPrivate(createPrivateConversationDto, currentUser);
  }

  @Get()
  findAll(@CurrentUser() currentUser: IUserPaylod, @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number = 10, @Query('cursor') cursor: string) {
    return this.conversationService.findAll(currentUser, limit, cursor);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.conversationService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateConversationDto: UpdateConversationDto) {
    return this.conversationService.update(+id, updateConversationDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.conversationService.remove(+id);
  }
}
