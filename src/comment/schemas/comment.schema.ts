import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose, { HydratedDocument } from "mongoose";
import type { IPrivacy, IReactionType } from "src/global";
import * as postSchema from "src/post/schemas/post.schema";
import { Reaction } from "src/reaction/schemas/reaction.schema";
import type { UserDocument } from "src/users/schemas/user.schema";


    
export type CommentDocument = HydratedDocument<Comment>

@Schema({ timestamps: true })
export class Comment {

    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Post' })
    post: postSchema.PostDocument

    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User' })
    user: UserDocument

    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Comment' })
    parent: CommentDocument | null

    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User' })
    replyToUser: UserDocument | null

    @Prop({ type: String, required: true })
    content: string

    @Prop({ type: Date, default: Date.now })
    createdAt: Date

    @Prop({ type: Date, default: Date.now })
    updatedAt: Date

}


export const CommentSchema = SchemaFactory.createForClass(Comment);