import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Query, ParseIntPipe, DefaultValuePipe } from '@nestjs/common';
import { ConversationService } from './conversation.service';
import { UpdateConversationDto } from './dto/update-conversation.dto';
import { CreatePrivateConversationDto } from './dto/create-private-conservation.dto';
import { CurrentUser } from 'src/_cores/decorators/currentUser.auth.decorator';
import type { IUserPaylod } from 'src/global';
import { AuthGuard } from 'src/_cores/guards/auth.guard';
import { CreateGroupConversationDto } from './dto/create-group-conversation.dto';
import { ParseObjectIdPipe } from 'src/_cores/pipes/parse-objectid.pipe';
import { AddParticipantsDto } from './dto/add-participants.dto';

@Controller('conversations')
@UseGuards(AuthGuard)
export class ConversationController {
  constructor(private readonly conversationService: ConversationService) { }
  @Post('group')
  createGroup(@Body() createGroupConversationDto: CreateGroupConversationDto, @CurrentUser() currentUser: IUserPaylod) {
    return this.conversationService.createGroup(createGroupConversationDto, currentUser);
  }


  @Post('private')
  createPrivate(@Body() createPrivateConversationDto: CreatePrivateConversationDto, @CurrentUser() currentUser: IUserPaylod) {
    return this.conversationService.createPrivate(createPrivateConversationDto, currentUser);
  }

  @Get()
  findAll(@CurrentUser() currentUser: IUserPaylod, @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number = 10, @Query('cursor') cursor: string) {
    return this.conversationService.findAll(currentUser, limit, cursor);
  }

  @Get(':id')
  findOne(@Param('id', ParseObjectIdPipe) id: string) {
    return this.conversationService.findOne(id);  
  }

  @Patch(':id')
  update(@Param('id', ParseObjectIdPipe) id: string, @Body() updateConversationDto: UpdateConversationDto, @CurrentUser() currentUser: IUserPaylod) {
    return this.conversationService.update(id, updateConversationDto, currentUser);
  }

  @Patch(':id/add-members')
  addParticipants(@Param('id', ParseObjectIdPipe) id: string, @Body() addParticipantsDto: AddParticipantsDto, @CurrentUser() currentUser: IUserPaylod) {
    return this.conversationService.addParticipants(id, currentUser, addParticipantsDto);
  }
  @Patch(':id/remove-members')
  removeParticipants(@Param('id', ParseObjectIdPipe) id: string, @Body() removeParticipantsDto: AddParticipantsDto, @CurrentUser() currentUser: IUserPaylod) {
    return this.conversationService.removeParticipants(id, currentUser, removeParticipantsDto);
  }

  @Delete(':id')
  remove(@Param('id', ParseObjectIdPipe) id: string, @CurrentUser() currentUser: IUserPaylod) {
    return this.conversationService.remove(id, currentUser);
  }
}
