import { SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { ConnectedSocket, MessageBody } from '@nestjs/websockets';
import { ResponseFriendRequestDto } from './dto/response-friend-request.dto';

@WebSocketGateway({
  cors: {
    origin: '*',
  }
})
export class FriendGateway {
  @WebSocketServer()
  server: Server;

    @SubscribeMessage('join_room')
    async handleJoinRoom(@ConnectedSocket() client: Socket, @MessageBody() userId: string) {
      await client.join(userId);
    }
  

  handleSendFriendRequest(receiverId: string, data: ResponseFriendRequestDto) {
    this.server.to(receiverId).emit('send_friend_request', data);
  }

  handleAcceptFriendRequest(data: any) {
    this.server.to(data.senderId).emit('accept_friend_request', data);
  }

  handleRejectFriendRequest(friendRequestId: string, senderId: string) {
    this.server.to(senderId).emit('reject_friend_request', friendRequestId);
  }

  handleCancelFriendRequest(receiverId: string, senderId: string, friendRequestId: string) {
    this.server.to(receiverId).emit('cancel_friend_request', {senderId, friendRequestId});
  }
}     
