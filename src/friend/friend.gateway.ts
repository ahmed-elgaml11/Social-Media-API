import { SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server } from 'socket.io';

@WebSocketGateway({
  cors: {
    origin: '*',
  }
})
export class FriendGateway {
  @WebSocketServer()
  server: Server;

  @SubscribeMessage('message')
  handleFriendRequest(client: any, payload: any): string {
    return 'Hello world!';
  }

}     
