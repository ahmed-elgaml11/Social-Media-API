import { Module } from '@nestjs/common';
import { FriendService } from './friend.service';
import { FriendController } from './friend.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { FriendRequest, FriendRequestSchema } from './schemas/friend-request.schema';
import { UsersModule } from 'src/users/users.module';

@Module({
  imports: [MongooseModule.forFeature([{ name: FriendRequest.name, schema: FriendRequestSchema }]), UsersModule],
  controllers: [FriendController],
  providers: [FriendService],
})
export class FriendModule {}
