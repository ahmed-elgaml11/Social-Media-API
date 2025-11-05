import { Global, Module } from '@nestjs/common';
import { ResourceService } from './resource.service';
import { UsersModule } from 'src/users/users.module';
import { PostModule } from 'src/post/post.module';


@Global()
@Module({
  imports: [UsersModule, PostModule],
  providers: [ResourceService],
  exports: [ResourceService]
})
export class ResourceModule {}
