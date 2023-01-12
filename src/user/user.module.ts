import { forwardRef, Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { EmailModule } from "src/email/email.module";
import { CampaignService } from "src/email/services/campaign.service";
import { UserSchema } from "src/user/schema/user.schema";
import { AdminController } from "./admin/controller/admin.controller";
import { PasswordHashService } from "./password-hash.service";
import { UnSubScribeUser, UnSubScribeUserSchema } from "./schema/unSubscibeUsers.schema";
import { UserController } from "./user.controller";
import { UserService } from "./user.service";


@Module({
    imports: [forwardRef(() => EmailModule), MongooseModule.forFeature([{ name: 'User', schema: UserSchema }, { name: 'UnSubScribeUser', schema: UnSubScribeUserSchema }])],
    controllers: [UserController, AdminController],
    providers: [UserService, PasswordHashService],
    exports: [UserService, PasswordHashService],
})

export class UserModule { }