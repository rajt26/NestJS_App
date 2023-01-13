import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose"
import mongoose from "mongoose"
import { User } from "src/user/schema/user.schema"

export type PaymentDocument = Payment & Document;

@Schema({
    timestamps: true
})
export class Payment {

    @Prop()
    orderId: string

    @Prop()
    paymentId: string

    @Prop()
    paymentSignature: string

    @Prop()
    amount: number

    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User' })
    paymentBy: User
}

export const PaymentSchema = SchemaFactory.createForClass(Payment);