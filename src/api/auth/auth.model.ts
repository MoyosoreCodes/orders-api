import { Document } from "mongoose";
import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import * as bcrypt from 'bcrypt';
import { HttpException, HttpStatus } from "@nestjs/common";

@Schema({ timestamps: true, collection: 'users' })
export class User {

    @Prop({ required: true })
    email: string

    @Prop({ required: true, lowercase: true, unique: true })
    username: string

    @Prop({ required: true })
    password: string

    verifyPassword: Function
}

export type UserDocument = User & Document;
export const userSchema = SchemaFactory.createForClass(User);

userSchema.methods.verifyPassword = async function (password: string) {
    const match: boolean = await bcrypt.compare(password, this.password)
    if (!match) throw new HttpException('invalid cedentials', HttpStatus.BAD_REQUEST);
    return match
}