import { forwardRef, Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { EmailModule } from "src/email/email.module";
import { EmailSchema } from "src/email/schemas/email.schema";
import { UserSchema } from "src/user/schema/user.schema";
import { AdminController } from "./admin/admin.controller";
import { AdminService } from "./admin/admin.service";
import { PasswordHashService } from "./password-hash.service";
import { UnSubScribeUserSchema } from "./schema/unSubscibeUsers.schema";
import { UserController } from "./user.controller";
import { UserService } from "./user.service";


@Module({
    imports: [
        forwardRef(() => EmailModule),
        MongooseModule.forFeature([{ name: 'User', schema: UserSchema }, { name: 'UnSubScribeUser', schema: UnSubScribeUserSchema }, { name: 'Email', schema: EmailSchema }])
    ],
    controllers: [UserController, AdminController],
    providers: [UserService, PasswordHashService, AdminService],
    exports: [UserService, PasswordHashService, AdminService],
})

export class UserModule { }