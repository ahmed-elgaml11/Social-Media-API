import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateReactionDto } from './dto/create-reaction.dto';
import { UpdateReactionDto } from './dto/update-reaction.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Reaction } from './schemas/reaction.schema';
import { Model } from 'mongoose';
import { IReactionType, IUserPaylod } from 'src/global';

@Injectable()
export class ReactionService {
  constructor(@InjectModel(Reaction.name) private reactionModel: Model<Reaction>,
  ) {}
  create(createReactionDto: CreateReactionDto, currentUser: IUserPaylod) {
    const reaction = new this.reactionModel({
      post: createReactionDto.postId,
      type: createReactionDto.reactionType,
      user: currentUser.id
    });
    return reaction.save();
  }

  findAll() {
    return `This action returns all reaction`;
  }

  findOne(id: number) {
    return `This action returns a #${id} reaction`;
  }

  update(id: string, type: IReactionType ) {
    const reaction = this.reactionModel.findByIdAndUpdate(id, { type }, { new: true });
    if (!reaction) {
      throw new NotFoundException('Reaction not found');
    }
    return reaction;
  }

  remove(id: number) {
    return `This action removes a #${id} reaction`;
  }
  findExistingReaction(userId: string, postId: string) {
    return this.reactionModel.findOne({ user: userId, post: postId });
  }
}
