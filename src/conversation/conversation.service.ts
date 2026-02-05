import { ForbiddenException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { UpdateConversationDto } from './dto/update-conversation.dto';
import { CreatePrivateConversationDto } from './dto/create-private-conservation.dto';
import { IUserPaylod } from 'src/global';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Conversation } from './schemas/conversation.schema';
import { CreateGroupConversationDto } from './dto/create-group-conversation.dto';
import { AddParticipantsDto } from './dto/add-participants.dto';
import { UsersService } from 'src/users/users.service';
import { UserDocument } from 'src/users/schemas/user.schema';
import { MessageDocument } from 'src/message/schemas/message.schema';
import console from 'console';
import { Types } from 'mongoose';


@Injectable()
export class ConversationService {
  constructor(@InjectModel(Conversation.name) private conversationModel: Model<Conversation>,
    private usersService: UsersService
  ) { }


  async createPrivate(createPrivateConversationDto: CreatePrivateConversationDto, currentUser: IUserPaylod) {
    const { participantId } = createPrivateConversationDto;
    const participant = await this.usersService.findOne(participantId);
    if (!participant) {
      throw new NotFoundException('Participant not found');
    }

    const existingConversation = await this.conversationModel.findOne({
      participants: { $all: [currentUser.id, participantId] },
      isGroup: false
    });
    if (existingConversation) {
      return existingConversation.populate(
        'participants',
        '_id name avatarUrl email'
      );
    }
    const conversation = new this.conversationModel({
      participants: [currentUser.id, participantId],
      isGroup: false,
    })
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
      participants: { $in: [new Types.ObjectId(currentUser.id)] },
    }
    if (cursor) {
      query.lastMessageAt = { $lt: new Date(cursor) };
    }
    const conversations = await this.conversationModel
      .find(query)
      .populate({
        path: 'lastMessage',
        select: 'content sender',
        populate: {
          path: 'sender',
          select: 'name _id'
        }
      }).populate('groupOwner', 'email name')
      .populate('participants', 'email name avatar')
      .sort({ lastMessageAt: -1 })
      .limit(limit + 1)
      .lean()


    const hasNextPage = conversations.length > limit;
    const items = hasNextPage ? conversations.slice(0, limit) : conversations;
    const nextCursor = hasNextPage ? items[limit - 1]?.lastMessageAt : null;

    const resultItems = items.map((conversation) => {
      const seenBy = conversation.lastMessage?.seenBy || [];
      const isLastMessageSeen = seenBy.some(
        (userId) => userId.toString() === currentUser.id
      ); return {
        ...conversation,
        isLastMessageSeen,
      }
    })
    return { items: resultItems, hasNextPage, nextCursor };
  }

  findOne(id: string) {
    const conversation = this.conversationModel.findById(id).populate('participants', 'email name avatar');
    if (!conversation) {
      throw new NotFoundException('Conversation not found');
    }
    return conversation;
  }

  async update(id: string, updateConversationDto: UpdateConversationDto, currentUser: IUserPaylod) {
    const conversation = await this.conversationModel.findById(id).populate('groupOwner', '_id');
    if (!conversation) {
      throw new NotFoundException('Conversation not found');
    }
    if (conversation?.isGroup && conversation?.groupOwner?._id.toString() !== currentUser.id) {
      throw new UnauthorizedException('You are not authorized to update this conversation');
    }


    conversation.groupName = updateConversationDto.groupName || conversation.groupName;
    conversation.groupAvatar = updateConversationDto.groupAvatar || conversation.groupAvatar;

    await conversation.save();

    return conversation;
  }

  async addParticipants(id: string, currentUser: IUserPaylod, addParticipantsDto: AddParticipantsDto) {
    const { participantIds } = addParticipantsDto
    const conversation = await this.conversationModel.findById(id);
    if (!conversation || !conversation.isGroup) {
      throw new NotFoundException('Conversation not found');
    }
    console.log(conversation?.groupOwner?._id.toString(), 'xxxxxxxxx')
    console.log(conversation?.groupOwner?.toString(), 'yyyyyyyy')
    if (conversation?.groupOwner?._id.toString() !== currentUser.id) {
      throw new ForbiddenException('You are not authorized to add participants');
    }
    console.log(conversation?.participants[0]?._id.toString(), 'xxxxxxxx')
    console.log(conversation?.participants[0]?.toString(), 'yyyyyyyy')

    const existingParticipantIds = conversation.participants.map((participant) => participant._id.toString());

    const participants: UserDocument[] = [];
    for (const id of participantIds) {
      if (!existingParticipantIds.includes(id)) {
        const user = await this.usersService.findOne(id);
        participants.push(user);
      }
    }

    conversation.participants = [...conversation.participants, ...participants];
    await conversation.save();
    return conversation;
  }




  async removeParticipants(id: string, currentUser: IUserPaylod, removeParticipantsDto: AddParticipantsDto) {
    const conversation = await this.conversationModel.findById(id);
    if (!conversation || !conversation.isGroup) {
      throw new NotFoundException('Conversation not found');
    }
    const { participantIds } = removeParticipantsDto
    if (conversation?.groupOwner?._id.toString() !== currentUser.id) {
      throw new ForbiddenException('You are not authorized to remove participants');
    }

    if (participantIds.includes(conversation?.groupOwner?._id.toString())) {
      throw new ForbiddenException('You are not authorized to remove group owner');
    }


    conversation.participants = conversation.participants.filter((participant) => !participantIds.includes(participant._id.toString()));
    await conversation.save();
    return conversation;
  }


  async remove(id: string, currentUser: IUserPaylod) {
    const conversation = await this.conversationModel.findById(id);
    if (!conversation) {
      throw new NotFoundException('Conversation not found');
    }

    if (conversation?.isGroup && conversation?.groupOwner?.toString() !== currentUser.id) {
      throw new ForbiddenException();
    }

    await conversation.deleteOne();
  }



  async updateLastMessage(id: string, lastMessage: MessageDocument) {
    await this.conversationModel.findByIdAndUpdate(id, { lastMessage: lastMessage._id, lastMessageAt: lastMessage.createdAt });
  }
}