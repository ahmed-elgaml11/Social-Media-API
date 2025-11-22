import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose, { HydratedDocument } from "mongoose";
import type { IPrivacy, IReactionType } from "src/global";
import * as postSchema from "src/post/schemas/post.schema";
import type { UserDocument } from "src/users/schemas/user.schema";



export type ReactionDocument = HydratedDocument<Reaction>

@Schema({ timestamps: true })
export class Reaction {

    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User' })
    user: UserDocument

    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Post' })
    post: postSchema.PostDocument

    @Prop({enum: ['like', 'love', 'haha', 'wow', 'happy', 'angry'], default: 'like'})
    type: IReactionType
}


export const ReactionSchema = SchemaFactory.createForClass(Reaction);
