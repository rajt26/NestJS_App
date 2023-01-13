import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { PaymentSchema } from './payment.schema';

@Module({
    imports: [MongooseModule.forFeature([{ name: 'Payment', schema: PaymentSchema }])],
    controllers: [],
    providers: [],
    exports: [],
})
export class PaymentModule { }
