import { Module } from '@nestjs/common';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { DbModule } from './db/db.module';


@Module({
  imports: [DbModule, UserModule, AuthModule],
  controllers: [],
  providers: [],
  exports: []
})
export class AppModule { }
