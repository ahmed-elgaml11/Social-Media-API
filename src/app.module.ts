import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersModule } from './users/users.module';
import { ConfigModule } from '@nestjs/config';


@Module({
  imports: [
    ConfigModule.forRoot({
        isGlobal: true,

    }),
    UsersModule, 
    MongooseModule.forRoot('mongodb+srv://backend2:asdfg12345^@cluster0.hz57cli.mongodb.net/social?retryWrites=true&w=majority&appName=Cluster0'), UsersModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
