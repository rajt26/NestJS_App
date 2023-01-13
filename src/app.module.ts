import { Module } from '@nestjs/common';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { DbModule } from './db/db.module';
import { EmailModule } from './email/email.module';
import { CommonModule } from './common/common.module';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { PaymentModule } from './payment/payment.module';

@Module({
  imports: [DbModule, UserModule, AuthModule, EmailModule, CommonModule, EventEmitterModule.forRoot(), PaymentModule],
  controllers: [],
  providers: [],
  exports: []
})
export class AppModule { }
