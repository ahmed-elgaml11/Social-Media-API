import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersModule } from './users/users.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { PostModule } from './post/post.module';
import { ResourceModule } from './resource/resource.module';
import { CloudinaryModule } from './cloudinary/cloudinary.module';
import { ReactionModule } from './reaction/reaction.module';
import { CommentModule } from './comment/comment.module';


@Module({
  imports: [
    UsersModule,
    AuthModule,
    PostModule,
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    MongooseModule.forRootAsync({
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        uri: configService.get<string>('MONGO_URL'),
      }),
    }),
    ResourceModule,
    CloudinaryModule,
    ReactionModule,
    CommentModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
