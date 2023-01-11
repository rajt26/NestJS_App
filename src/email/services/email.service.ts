import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { Email, EmailDocument } from "../schemas/email.schema";

export class EmailService {

    constructor(
        @InjectModel(Email.name) private emailModel: Model<EmailDocument>
    ) { }


}