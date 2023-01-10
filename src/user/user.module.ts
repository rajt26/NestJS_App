import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { UserSchema } from "src/user/schema/user.schema";
import { PasswordHashService } from "./password-hash.service";
import { UserController } from "./user.controller";
import { UserService } from "./user.service";


@Module({
    imports: [MongooseModule.forFeature([{ name: 'User', schema: UserSchema }])],
    controllers: [UserController],
    providers: [UserService, PasswordHashService],
    exports: [UserService, PasswordHashService],
})

export class UserModule { }