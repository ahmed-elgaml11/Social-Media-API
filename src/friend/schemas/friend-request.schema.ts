import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose, { HydratedDocument } from "mongoose";
import { FRIEND_REQUEST_STATUS } from "src/_cores/global/constants";
import type { IFriendRequestType } from "src/global";
import type { UserDocument } from "src/users/schemas/user.schema";



export type FriendRequestDocument = HydratedDocument<FriendRequest>

@Schema({ timestamps: true })
export class FriendRequest {

    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User' })
    sender: UserDocument

    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User' })
    receiver: UserDocument

    @Prop({ enum: FRIEND_REQUEST_STATUS, default: 'pending' })
    status: IFriendRequestType
}


export const FriendRequestSchema = SchemaFactory.createForClass(FriendRequest);
