import { forwardRef, Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { DbModule } from "src/db/db.module";
import { UserSchema } from "src/schemas/user/user.schema";
import { UserController } from "./user.controller";
import { UserService } from "./user.service";
import { AuthModule } from "src/auth/auth.module";


@Module({
    imports: [MongooseModule.forFeature([{ name: 'User', schema: UserSchema }]), DbModule, forwardRef(() => AuthModule)],
    controllers: [UserController],
    providers: [UserService],
    exports: [MongooseModule, UserService],
})

export class UserModule { }