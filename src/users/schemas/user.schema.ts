import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose, { HydratedDocument } from "mongoose";
import { MediaType } from "src/_cores/global/class";
import type { IRole } from "src/global";


export type UserDocument = HydratedDocument<User>


@Schema({ timestamps: true })
export class User {
    @Prop({required: true})
    password: string

    @Prop({required: true})
    name: string

    @Prop({required: true})
    email: string


    @Prop({default: 'user'})
    role: IRole;

    @Prop()
    bio?: string

    @Prop({default: false})
    avatar?: MediaType

    @Prop()
    coverPhoto?: MediaType

    @Prop()
    birthdate?: string

    @Prop()
    phoneNumber?: string

    
    @Prop({ type: [mongoose.Schema.Types.ObjectId], ref: 'User', default: [] })
    friends: UserDocument[]

    @Prop({default: true})
    isActive: boolean
}

export const UserSchema = SchemaFactory.createForClass(User);
