import { Body, Controller, HttpStatus, Post, Res } from "@nestjs/common";
import { UserService } from "src/user/user.service";
import { EmailService } from "../services/email.service";

@Controller('email')
export class EmailController {

    constructor(
        private emailService: EmailService,
        private userService: UserService
    ) { }


}