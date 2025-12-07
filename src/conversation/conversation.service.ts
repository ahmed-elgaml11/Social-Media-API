import { Injectable, NotFoundException } from '@nestjs/common';
import { UpdateConversationDto } from './dto/update-conversation.dto';
import { CreatePrivateConversationDto } from './dto/create-private-conservation.dto';
import { IUserPaylod } from 'src/global';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Conversation } from './schemas/conversation.schema';
import { CreateGroupConversationDto } from './dto/create-group-conversation.dto';

@Injectable()
export class ConversationService {
  constructor(@InjectModel(Conversation.name) private conversationModel: Model<Conversation>) { }


  async createPrivate(createPrivateConversationDto: CreatePrivateConversationDto, currentUser: IUserPaylod) {
    const { participantId } = createPrivateConversationDto;
    const existingConversation = await this.conversationModel.findOne({
      participants: { $all: [currentUser.id, participantId] },
      isGroup: false,
    });
    if (existingConversation) {
      return existingConversation;
    }
    const conversation = new this.conversationModel({
      participants: [currentUser.id, participantId],
      isGroup: false,
    });
    return conversation.save();
  }

  async createGroup(createGroupConversationDto: CreateGroupConversationDto, currentUser: IUserPaylod) {
    const { participantIds, groupName, groupAvatar } = createGroupConversationDto;
    const conversation = new this.conversationModel({
      participants: [currentUser.id, ...participantIds],
      isGroup: true,
      groupName,
      groupAvatar,
      groupOwner: currentUser.id,
    });
    return conversation.save();
  }

  async findAll(currentUser: IUserPaylod, limit: number = 10, cursor: string) {

    const query: Record<string, any> = {
      participants: { $in: [currentUser.id] },
    }
    if (cursor) {
      query.createdAt = { $lt: new Date(cursor) };
    }
    const conversations = await this.conversationModel
      .find(query)
      .populate('lastMessage', 'content')
      .populate('groupOwner', 'email name')
      .sort({ createdAt: -1 })
      .limit(limit + 1)
      .lean()

    const hasNextPage = conversations.length > limit;
    const items = hasNextPage ? conversations.slice(0, limit) : conversations;
    const nextCursor = hasNextPage ? items[limit - 1]?.createdAt : null;
    return { items, hasNextPage, nextCursor };
  }

  findOne(id: string) {
    const conversation = this.conversationModel.findById(id).populate('participants', 'email name avatar');
    if (!conversation) {
      throw new NotFoundException('Conversation not found');
    }
    return conversation;
  }

  update(id: string, updateConversationDto: UpdateConversationDto) {
    return `This action updates a #${id} conversation`;
  }

  remove(id: number) {
    return `This action removes a #${id} conversation`;
  }
}
