import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';


@Module({
  imports: [MongooseModule.forRoot('mongodb+srv://backend2:asdfg12345^@cluster0.hz57cli.mongodb.net/social?retryWrites=true&w=majority&appName=Cluster0')],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
