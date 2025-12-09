import { Injectable } from '@nestjs/common';
import { SendMessageDto } from './dto/send-message.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Message } from './schemas/message.schema';
import { UpdateMessageDto } from './dto/update-message.dto';
import { IUserPaylod } from 'src/global';
import { ConversationService } from 'src/conversation/conversation.service';

@Injectable()
export class MessageService {
  constructor(@InjectModel(Message.name) private messageModel: Model<Message>,
    private conversationService: ConversationService) { }

  async sendMessage(conversationId: string, sendMessageDto: SendMessageDto, currentUser: IUserPaylod) {
    const { text, mediaFiles } = sendMessageDto;
    const conversation = this.conversationService.findOne(conversationId);

    const message = await this.messageModel.create({
      conversation: conversationId,
      sender: currentUser.id,
      text,
      mediaFiles,
      seenBy: [currentUser.id]
    });

    await this.conversationService.updateLastMessage(conversationId, message._id.toString());
    return message;

    // TODO: real time
  }

  async getAllMessages(conversationId: string) {
    const conversation = await this.conversationService.findOne(conversationId);

    const messages = await this.messageModel
    .find({ conversation: conversationId })
    .populate('sender', 'name avatar')
    .populate('seenBy', 'name avatar')
    .sort({ createdAt: 1 })
    .lean();

    return messages;
  }

  findOne(id: string) {
    return this.messageModel.findById(id);
  }

  update(id: string, updateMessageDto: UpdateMessageDto) {
    return this.messageModel.findByIdAndUpdate(id, updateMessageDto);
  }

  remove(id: number) {
    return this.messageModel.findByIdAndDelete(id);
  }
}
