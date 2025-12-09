import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose, { HydratedDocument } from "mongoose";
import { MediaType } from "src/_cores/global/class";
import type { ConversationDocument } from "src/conversation/schemas/conversation.schema";
import type { UserDocument } from "src/users/schemas/user.schema";


export type MessageDocument = HydratedDocument<Message>

@Schema({ timestamps: true })
export class Message {
    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Conversation' })
    conversation: ConversationDocument

    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User' })
    sender: UserDocument

    @Prop()
    text?: string

    @Prop()
    mediaFiles?: MediaType[]

    @Prop({ type: Boolean, default: false })
    isDeleted?: boolean

    @Prop({ type: [mongoose.Schema.Types.ObjectId], ref: 'User' })
    seenBy?: UserDocument[]


    createdAt: Date
    updatedAt: Date
}


export const MessageSchema = SchemaFactory.createForClass(Message);
