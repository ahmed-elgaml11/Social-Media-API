import { Prop, SchemaFactory } from "@nestjs/mongoose";

export class User {
    @Prop()
    username: string

    @Prop()
    name: string

    @Prop()
    password: string
}

export const UserSchema = SchemaFactory.createForClass(User);
