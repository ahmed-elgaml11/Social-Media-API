import { Module } from '@nestjs/common';
import { MessageService } from './message.service';
import { MessageController } from './message.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Message, MessageSchema } from 'src/message/schemas/message.schema';
import { UsersModule } from 'src/users/users.module';
import { ConversationModule } from 'src/conversation/conversation.module';
import { MessageGateway } from './message.gateway';

@Module({
  imports: [MongooseModule.forFeature([{ name: Message.name, schema: MessageSchema }]), UsersModule, ConversationModule],
  controllers: [MessageController],
  providers: [MessageService, MessageGateway],
})
export class MessageModule { }
