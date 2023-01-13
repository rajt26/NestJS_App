import { InjectModel } from "@nestjs/mongoose";
import mongoose, { Model } from "mongoose";
import { Email, EmailDocument } from "../schemas/email.schema";
import { EmailConfigService } from '../../common/email/emailConfig.service'

export class EmailService {

    constructor(
        @InjectModel(Email.name) private emailModel: Model<EmailDocument>,
        private emailConfigService: EmailConfigService
    ) { }

    async getEmails(queryData: Record<string, any>, userId: string): Promise<any> {

        const page = parseInt(queryData.page) || 1;
        const limit = parseInt(queryData.limit) || 5;
        const skip = page * limit - limit;
        const searchValue = queryData.search;
        const campaign = queryData.campaign;
        let booleanSearch = undefined;


        if (searchValue == "true" || searchValue == "false") {
            /*
            *to Check if we search value contain true or false
            *as a String to Avoid type Error in isOpen and unSubscribe field.
            */
            booleanSearch = (searchValue === "true");
        }

        try {
            // *Custom campaign query

            let findCampaigns = {}
            findCampaigns['$and'] = [{ 'sender': userId }];

            if (mongoose.Types.ObjectId.isValid(campaign)) {
                // * if Campaign Id is present then add it in query
                findCampaigns['$and'].push({ 'campaign': campaign });
            }
            // * add the rest of filter query
            findCampaigns['$and'].push({
                $or: [{ 'receiver': { "$regex": searchValue, "$options": "i" } },
                { 'subject': { "$regex": searchValue, "$options": "i" } },
                { 'trackingDetails.isOpen': booleanSearch },
                { 'unSubscribe': booleanSearch },
                ]
            });

            // * fire the query
            const result = await this.emailModel.find(findCampaigns).select('receiver subject files unSubscribe trackingDetails campaign')
                .skip(skip)
                .limit(limit)
                .sort({ _id: -1 });

            // * Get the Total Count of all the Email for the given User.
            const count = await this.emailModel.find(findCampaigns).countDocuments();
            if (count == 0) {
                // ! if No Emails Found send an empty array
                return {
                    success: false,
                    result,
                    count,
                    message: "No Emails found."
                }
            }
            // * Send the list of All Emails
            return {
                success: true,
                result,
                count,
                message: "Found All Emails"
            }
        } catch (error) {
            console.log("🚀 ~ file: email.service.js:96 ~ getEmails ~ error", error)
            throw new Error(error.message);
        }
    }

    async sendEmail(emailData: Record<string, any>): Promise<Email> {
        const { from, password, host, to, port, subject, textBody: text, attachments } = emailData;

        //*create transporter instance
        const newTransporter = await this.emailConfigService.createTransporter({
            from,
            password,
            host,
            port,
        });

        try {
            const info = new newTransporter.sendMail({
                from,
                to,
                subject,
                html: text,
                attachments: attachments,
            })
            console.log(
                "🚀 ~ file: mailMergePlugin.controller.js:26 ~ sendMail ~ info",
                info
            );
            return info;
        } catch (error) {
            throw new Error(error.message)
        }
    }

    async saveEmailData(emailData: Record<string, any>): Promise<Email> {
        const newEmailData = new this.emailModel(emailData);
        return newEmailData.save();
    }

    async updateEmailsData(emailData: Record<string, any>): Promise<any> {
        return await this.emailModel.updateMany(
            { $and: [{ sender: emailData.id }, { receiver: emailData.email }] },
            { $set: { unSubscribe: true } }
        )
    }

    async updateEmailTrackingDetails(trackingData: Record<string, any>): Promise<any> {
        return await this.emailModel.findOneAndUpdate(
            { trackingId: trackingData.id },
            {
                $set: {
                    "trackingDetails.isOpen": true,
                    "trackingDetails.timeOfOpen": new Date().toString(),
                },
                $push: {
                    "trackingDetails.history": {
                        browser: trackingData.ua.browser,
                        ua: trackingData.ua,
                        openAt: new Date().toDateString(),
                    },
                },
            },
            { new: true }
        );
    }
}
