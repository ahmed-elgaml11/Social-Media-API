import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose, { HydratedDocument } from "mongoose";
import type { UserDocument } from "src/users/schemas/user.schema";

export type PostDocument = HydratedDocument<Post>

@Schema({ timestamps: true })
export class Post {

    @Prop({required: true})
    title: string

    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User' })
    user: UserDocument


}


export const PostSchema = SchemaFactory.createForClass(Post);
