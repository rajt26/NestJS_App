import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose'
import { Role } from 'src/auth/enums/role.enum';
import { Document } from 'mongoose'

export type UserDocument = User & Document;
@Schema({
    timestamps: true
})

export class User {
    @Prop({ required: true })
    name: string

    @Prop({ required: true })
    email: string

    @Prop({ required: true })
    password: string

    @Prop({
        default: [Role.SUBSCRIBER],
        require: true
    })
    roles: Role[]
}
export const UserSchema = SchemaFactory.createForClass(User);
