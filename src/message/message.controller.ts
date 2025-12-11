import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { MessageService } from './message.service';
import { SendMessageDto } from './dto/send-message.dto';
import { UpdateMessageDto } from './dto/update-message.dto';
import { CurrentUser } from 'src/_cores/decorators/currentUser.auth.decorator';
import type { IUserPaylod } from 'src/global';
import { UseGuards } from '@nestjs/common';
import { AuthGuard } from 'src/_cores/guards/auth.guard';
import { ParseObjectIdPipe } from 'src/_cores/pipes/parse-objectid.pipe';

@Controller('messages')
@UseGuards(AuthGuard)
export class MessageController {
  constructor(private readonly messageService: MessageService) {}

  @Post('/conversation/:conversationId')
  sendMessage(@Param('conversationId', ParseObjectIdPipe) conversationId: string, @Body() sendMessageDto: SendMessageDto, @CurrentUser() currentUser: IUserPaylod) {
    return this.messageService.sendMessage(conversationId, sendMessageDto, currentUser);
  }

  @Get('/conversation/:conversationId')
  getMessages(@Param('conversationId', ParseObjectIdPipe) conversationId: string, @Query('cursor') cursor: string, @Query('limit') limit: number) {
    return this.messageService.getAllMessages(conversationId, cursor, limit);
  }

  @Get(':id')
  findOne(@Param('id', ParseObjectIdPipe) id: string) {
    return this.messageService.findOne(id);
  }

  @Patch('/update/:id')
  update(@Param('id', ParseObjectIdPipe) id: string, @Body() updateMessageDto: UpdateMessageDto, @CurrentUser() currentUser: IUserPaylod) {
    return this.messageService.update(id, updateMessageDto, currentUser);
  }

  @Patch(':id/seen')
  markSeenMessage(@Param('id', ParseObjectIdPipe) id: string, @CurrentUser() currentUser: IUserPaylod) {
    return this.messageService.markSeenMessage(id, currentUser);
  }

  @Delete(':id')
  remove(@Param('id', ParseObjectIdPipe) id: string, @CurrentUser() currentUser: IUserPaylod) {
    return this.messageService.remove(id, currentUser);
  }
}
