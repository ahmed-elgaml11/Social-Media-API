import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose, { HydratedDocument } from "mongoose";
import type { IPrivacy } from "src/global";
import type { UserDocument } from "src/users/schemas/user.schema";





export type PostDocument = HydratedDocument<Post>
export class MediaType {
    public_id: string
    version: number
    display_name: string
    format: string
    resource_type: string
}


@Schema({ timestamps: true })
export class Post {

    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User' })
    author: UserDocument

    @Prop({required: true})
    content: string

    @Prop({default: '#fff'})
    backgroundColor: string

    @Prop({default: []})
    mediaFiles: MediaType[]

    @Prop({enum: ['public', 'private', 'friends'], default: 'public'})
    privacy: IPrivacy

    createdAt: Date

}


export const PostSchema = SchemaFactory.createForClass(Post);
