import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
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
  getMessages(@Param('conversationId', ParseObjectIdPipe) conversationId: string) {
    return this.messageService.getAllMessages(conversationId);
  }

  @Get(':id')
  findOne(@Param('id', ParseObjectIdPipe) id: string) {
    return this.messageService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id', ParseObjectIdPipe) id: string, @Body() updateMessageDto: UpdateMessageDto) {
    return this.messageService.update(id, updateMessageDto);
  }

  @Delete(':id')
  remove(@Param('id', ParseObjectIdPipe) id: string) {
    return this.messageService.remove(id);
  }
}
