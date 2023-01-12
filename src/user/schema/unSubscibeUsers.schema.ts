import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose'
import mongoose, { Document } from 'mongoose'
import { User } from './user.schema';

export type UnSubScribeUserDocument = UnSubScribeUser & Document;
@Schema({
    timestamps: true
})

export class UnSubScribeUser {

    @Prop()
    unSubscriber: string

    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User' })
    unSubscribeFrom: User
}

export const UnSubScribeUserSchema = SchemaFactory.createForClass(UnSubScribeUser);
