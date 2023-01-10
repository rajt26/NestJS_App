import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose'
import { Role } from 'src/auth/enums/role.enum';
import { Document } from 'mongoose'

export type UserDocument = User & Document;
@Schema({
    timestamps: true
})

export class User {
    @Prop({ required: true })
    name: String

    @Prop({ required: true })
    email: String

    @Prop({ required: true })
    password: String

    @Prop({
        default: [Role.USER],
        require: true
    })
    roles: Role[]
}
export const UserSchema = SchemaFactory.createForClass(User);
