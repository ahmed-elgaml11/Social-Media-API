import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose, { HydratedDocument } from "mongoose";
import { NOTIFICATION_TYPES } from "src/_cores/global/constants";
import type { INotificationType } from "src/global";
import type { UserDocument } from "src/users/schemas/user.schema";



export type NotificationDocument = HydratedDocument<Notification>

@Schema({ timestamps: true })
export class Notification {

    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User' })
    sender: UserDocument

    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User' })
    receiver: UserDocument

    @Prop({ enum: NOTIFICATION_TYPES }) 
    type : INotificationType

    @Prop()
    content : string

    @Prop({default : false})
    isRead : boolean    

    @Prop({ type: mongoose.Schema.Types.ObjectId})
    linkToId : mongoose.Schema.Types.ObjectId

    createdAt : Date
    updatedAt : Date
}


export const NotificationSchema = SchemaFactory.createForClass(Notification);
