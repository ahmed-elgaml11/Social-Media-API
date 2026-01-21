import { ConnectedSocket, MessageBody, OnGatewayConnection, OnGatewayDisconnect, WebSocketServer } from '@nestjs/websockets';
import { SubscribeMessage, WebSocketGateway } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { MessageService } from './message.service';
import { ResponseMessagesDto } from './dto/response-messages.dto';

@WebSocketGateway({
  cors: {
    origin: '*',
  }
})
export class MessageGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;          // = io

  handleConnection(client: Socket) {
    console.log('Client connected:', client.id);
  }

  handleDisconnect(client: Socket) {
    console.log('Client disconnected:', client.id);
  }

  @SubscribeMessage('join')
  async handleJoinRoom(@ConnectedSocket() client: Socket, @MessageBody() conversationId: string) {
    await client.join(conversationId);
  }

  async handleNewMessage(conversationId: string, data: ResponseMessagesDto){
    this.server.to(conversationId).emit('new_message', data);
  }
  async handleUpdateMessage(conversationId: string, data: ResponseMessagesDto){
    this.server.to(conversationId).emit('update_message', data);
  }
  async handleDeleteMessage(conversationId: string, messageId: string){
    this.server.to(conversationId).emit('delete_message', messageId);
  }
  async handleSeenMessage(conversationId: string, messageId: string, userData: {}){
    this.server.to(conversationId).emit('seen_message', {messageId, userData});
  }

z
}
