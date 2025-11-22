import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose, { HydratedDocument } from "mongoose";
import { REACTION_TYPES } from "src/_cores/global/constants";
import type { IPrivacy, IReactionType } from "src/global";
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
    @Prop({type: Map, of: Number, default: {}})
    reactionsCount: Map<IReactionType, number>

    @Prop({enum: REACTION_TYPES, default: 'public'})
    privacy: IPrivacy


}


export const PostSchema = SchemaFactory.createForClass(Post);
