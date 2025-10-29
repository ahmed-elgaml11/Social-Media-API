import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";


@Schema({ timestamps: true })
export class User {
    @Prop({required: true})
    password: string

    @Prop({required: true})
    name: string

    @Prop({required: true})
    email: string


    @Prop({default: 'user'})
    role: 'user' | 'admin';
}

export const UserSchema = SchemaFactory.createForClass(User);
