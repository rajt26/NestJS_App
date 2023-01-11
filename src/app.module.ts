import { Module } from '@nestjs/common';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { DbModule } from './db/db.module';
import { EmailModule } from './email/email.module';
import { CommonModule } from './common/common.module';


@Module({
  imports: [DbModule, UserModule, AuthModule, EmailModule, CommonModule],
  controllers: [],
  providers: [],
  exports: []
})
export class AppModule { }
