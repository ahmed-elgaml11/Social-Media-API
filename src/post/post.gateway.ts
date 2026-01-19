import { SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server } from 'socket.io';
import { ResponsePostDto } from './dto/response-post.dto';
import { UploadMediaDto } from 'src/_cores/global/dtos';
import { DeleteMediaDto } from './dto/delete-media.dto';

@WebSocketGateway({
  cors: {
    origin: '*',
  }
})
export class PostGateway {
  @WebSocketServer()
  server: Server;

  @SubscribeMessage('message')
  handleMessage(client: any, payload: any): string {
    return 'Hello world!';
  }



  handlePostCreate(post: ResponsePostDto) {
    this.server.emit('post_created', post);
  }

  handleUploadMedia(postId: string, uploadMediaDtos: UploadMediaDto[]) {
    this.server.emit('post_upload_media', { postId, mediaFiles: uploadMediaDtos });
  }

  handleReplacedMedia(postId: string, uploadMediaDtos: UploadMediaDto[]){
    this.server.emit('post_replace_media', { postId, mediaFiles: uploadMediaDtos });

  }

  handleRemoveMedia(postId: string, deleteMediaDto: DeleteMediaDto) {
    this.server.emit('post_remove_media', { postId, mediaId: deleteMediaDto.mediaId });
  }


  handlePostUpdate(data: {postId: string, backgroundColor: string, content: string, privacy: string}) {
    this.server.emit('post_update', data);
  }

  handlePostRemove(postId: string) {  
    this.server.emit('post_remove', { postId });
  }

  handleAddReaction(post: ResponsePostDto) {
    this.server.emit('post_add_reaction', post);
  }

  handleRemoveReaction(post: ResponsePostDto) {
    this.server.emit('post_remove_reaction', post);
  }
}
