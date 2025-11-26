import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument } from "mongoose";
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
    avatar?: boolean

    @Prop()
    coverPhoto?: string

    @Prop()
    birthday?: string

    @Prop()
    phoneNumber?: string
}

export const UserSchema = SchemaFactory.createForClass(User);
