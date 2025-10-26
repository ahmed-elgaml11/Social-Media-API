import { Prop, SchemaFactory } from "@nestjs/mongoose";

export class User {
    @Prop()
    password: string

    @Prop()
    name: string

    @Prop()
    email: string
}

export const UserSchema = SchemaFactory.createForClass(User);
