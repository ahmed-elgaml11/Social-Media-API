import { Module } from '@nestjs/common';
import { ReactionService } from './reaction.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Reaction, ReactionSchema } from './schemas/reaction.schema';

@Module({
  imports: [MongooseModule.forFeature([{ name: Reaction.name, schema: ReactionSchema }])],
  controllers: [],
  providers: [ReactionService],
  exports: [ReactionService]
})
export class ReactionModule {}
