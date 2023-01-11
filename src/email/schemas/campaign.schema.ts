import mongoose from "mongoose";
import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { User } from "src/user/schema/user.schema";

export type CampaignDocument = Campaign & Document;

@Schema({
    timestamps: true
})

export class Campaign {

    @Prop()
    name: string

    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User' })
    createdBy: User

    @Prop()
    totalMailCount: number

    @Prop({ default: 0 })
    sentSuccessfully: number
}
export const CampaignSchema = SchemaFactory.createForClass(Campaign)