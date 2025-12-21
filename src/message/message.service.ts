import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { SendMessageDto } from './dto/send-message.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Message } from './schemas/message.schema';
import { UpdateMessageDto } from './dto/update-message.dto';
import { IUserPaylod } from 'src/global';
import { ConversationService } from 'src/conversation/conversation.service';
import { UsersService } from 'src/users/users.service';
import { plainToInstance } from 'class-transformer';
import { ResponseMessagesDto } from './dto/response-messages.dto';
import { MessageGateway } from './message.gateway';

@Injectable()
export class MessageService {
  constructor(@InjectModel(Message.name) private messageModel: Model<Message>,
    private conversationService: ConversationService,
    private usersService: UsersService,
    private messageGateway: MessageGateway
  ) { }

  async sendMessage(conversationId: string, sendMessageDto: SendMessageDto, currentUser: IUserPaylod) {
    const { text, mediaFiles } = sendMessageDto;
    const conversation = await this.conversationService.findOne(conversationId);

    const message = await this.messageModel.create({
      conversation: conversationId,
      sender: currentUser.id,
      text,
      mediaFiles,
      seenBy: [currentUser.id]
    });
    
    const newMessage = await this.messageModel.findById(message.id)
      .populate('sender', 'name avatar')
      .populate('seenBy', 'name avatar')

    await this.conversationService.updateLastMessage(conversationId, message._id.toString());

    const responseMessage = plainToInstance(ResponseMessagesDto, newMessage, {
      excludeExtraneousValues: true
    })

    this.messageGateway.handleNewMessage(conversationId, responseMessage)
  }

  async getAllMessages(conversationId: string, cursor: string, limit: number) {
    const conversation = await this.conversationService.findOne(conversationId);

    const query: Record<string, any> = {
      conversation: conversationId
    }

    if (cursor) {
      query.createdAt = { $gt: new Date(cursor) }
    }

    const messages = await this.messageModel
      .find(query)
      .populate('sender', 'name avatar')
      .populate('seenBy', 'name avatar')
      .sort({ createdAt: 1 })
      .limit(limit + 1)
      .lean();

    const hasNextPage = messages.length > limit;
    const items = hasNextPage ? messages.slice(0, limit) : messages;
    const nextCursor = messages[messages.length - 1]?.createdAt;

    return { items, nextCursor, hasNextPage };
  }

  async findOne(id: string) {
    const message = await this.messageModel.findOne({ _id: id, isDeleted: false });
    if (!message) {
      throw new NotFoundException('Message not found');
    }
    return message;
  }

  async update(id: string, updateMessageDto: UpdateMessageDto, currentUser: IUserPaylod) {
    const message = await this.findOne(id);
    if (message.sender._id.toString() !== currentUser.id) {
      throw new ForbiddenException('You are not allowed to update this message');
    }
    const updatedMessage = await this.messageModel.findByIdAndUpdate(message.id, updateMessageDto);

    const newMessage = await this.messageModel.findById(updatedMessage?.id)
      .populate('sender', 'name avatar')
      .populate('seenBy', 'name avatar')

    const responseMessage = plainToInstance(ResponseMessagesDto, newMessage, {
      excludeExtraneousValues: true
    })

    this.messageGateway.handleUpdateMessage(message.conversation._id.toString(), responseMessage)



  }

  async remove(id: string, currentUser: IUserPaylod) {
    const message = await this.findOne(id);
    if (message.sender._id.toString() !== currentUser.id) {
      throw new ForbiddenException('You are not allowed to delete this message');
    }
    message.isDeleted = true;
    const deletedMessage = await message.save();
    this.messageGateway.handleDeleteMessage(message.conversation._id.toString(), message._id.toString())
  }



  async markSeenMessage(id: string, currentUser: IUserPaylod) {
    const message = await this.findOne(id);


    const alreadySeen = message?.seenBy?.some((user) => user._id.toString() === currentUser.id);
    if (!alreadySeen) {
      const user = await this.usersService.findOne(currentUser.id);
      message?.seenBy?.push(user.id);

      await message.save();
    }
  }
}
