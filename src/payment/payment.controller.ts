import { Body, HttpStatus, Req, Res } from "@nestjs/common";
import { createCipheriv, randomBytes, scrypt } from 'crypto';
import { promisify } from "util";

export class PaymentController {
    constructor() { }

    async checkOut(@Req() req, @Res() res, @Body() bodyParams) {
        const { amount, currency } = bodyParams;
        const trialPeriod = Number((new Date().getTime() + 14 * 24 * 60 * 60 * 1000) / 1000);
        const options = {
            plan_id: "plan_KzdwAmgE3WBHzv",
            customer_notify: 1,
            total_count: 12,
            // start_at: trialPeriod, // * 14 days trial period
        };
        try {
            const orders = await instance.subscriptions.create(options);
            return res.status(200).json({
                success: true,
                result: orders,
            });
        } catch (error) {
            return res.status(HttpStatus.BAD_REQUEST).json({
                success: false,
                message: error.message
            })
        }
    }

    async paymentVerification(@Res() res, @Body() bodyParams) {
        const { razorpay_subscription_id, razorpay_payment_id, razorpay_signature } = bodyParams;
        const body = `${razorpay_subscription_id}|${razorpay_payment_id}`;
        const iv = randomBytes(16)
        const key = (await promisify(scrypt)('secret', 'salt', 32)) as Buffer;
        const cipher = createCipheriv('sha256', key, iv);
        const expectedSignature = Buffer.concat([
            cipher.update(body.toString()),
            cipher.final(),
        ]);
        const isValidSignature = razorpay_signature === expectedSignature;
        if (!isValidSignature) {
            return res.status(HttpStatus.BAD_REQUEST);
        }
    }
}