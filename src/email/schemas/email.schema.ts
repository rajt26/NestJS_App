import mongoose from "mongoose";
import { Prop, raw, Schema, SchemaFactory } from "@nestjs/mongoose";
import { User } from "src/user/schema/user.schema";
import { Campaign } from "./campaign.schema";

export type EmailDocument = Email & Document;

@Schema({
    timestamps: true
})

export class Email {

    @Prop({ required: true, unique: true })
    trackingId: string

    @Prop({ required: true })
    receiver: string

    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User' })
    sender: User

    @Prop()
    subject: string

    @Prop(Array)
    files: Array<any>

    @Prop({ default: false })
    unSubscribe: boolean

    @Prop(raw({
        isOpen: {
            type: Boolean,
            default: false,
        },
        timeOfOpen: {
            type: Date,
        },
        history: {
            type: Array,
        }
    }))
    trackingDetails: Record<string, any>

    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Campaign' })
    campaign: Campaign
}
export const EmailSchema = SchemaFactory.createForClass(Email);