import { Body, Controller, HttpStatus, Post, Req, Res, Headers } from "@nestjs/common";
import { Query } from "@nestjs/common/decorators";
import { UserService } from "src/user/user.service";
import { CampaignService } from "../services/campaign.service";
import { EmailService } from "../services/email.service";
import { EventEmitter2 } from "@nestjs/event-emitter"
import { OnEvent } from "@nestjs/event-emitter/dist/decorators";
import { parser } from "ua-parser-js"
import path from "path";

@Controller('email')
export class EmailController {

    constructor(
        private emailService: EmailService,
        private userService: UserService,
        private campaignService: CampaignService,
        private eventEmitter: EventEmitter2
    ) {
    }

    async sendEmail(@Req() req, @Res() res, @Body() bodyParams) {
        if (process.env.SECRET_KEY != req.headers?.authorization?.split(" ")[1]) {
            // ! if not key found return 400 msg
            return res.status(HttpStatus.BAD_REQUEST).json({ message: "Invalid Key Found!!!" });
        }
        try {
            const emailInfo = await this.emailService.sendEmail(bodyParams);
            console.log(
                "🚀 ~ file: mailMergePlugin.controller.js:26 ~ sendMail ~ info",
                emailInfo
            );
            return res.status(HttpStatus.OK).json("Success.");
        } catch (error) {
            console.log(
                "🚀 ~ file: mailMergePlugin.controller.js:24 ~ sendMail ~ error",
                error.message
            );
            return res.status(HttpStatus.BAD_REQUEST).json({ message: error.message });
        }
    }

    async sendTestEmail(@Req() req, @Res() res, @Body() bodyParams) {
        if (process.env.SECRET_KEY != req.headers?.authorization?.split(" ")[1]) {
            // ! if not key found return 400 msg
            return res.status(HttpStatus.BAD_REQUEST).json({ message: "Invalid Key Found!!!" });
        }
        try {
            const emailInfo = await this.emailService.sendEmail(bodyParams);
            console.log(
                "🚀 ~ file: mailMergePlugin.controller.js:26 ~ sendMail ~ info",
                emailInfo
            );
            return res.status(HttpStatus.OK).json("Success.");
        } catch (error) {
            console.log(
                "🚀 ~ file: mailMergePlugin.controller.js:24 ~ sendMail ~ error",
                error.message
            );
            return res.status(HttpStatus.OK).json({ message: error.message });
        }
    }

    @OnEvent('EmailTrack')
    async myEventHandler(data: any) {
        try {
            //find the email with the tracking id
            const result = await this.emailService.updateEmailTrackingDetails(data);
            return result;
        } catch (error) {
            console.log(error.message);
        }
    };

    async trackMail(@Req() req, @Res() res, @Headers() headers) {
        if (
            !headers["referer"] &&
            headers["referer"] !== "http://mail.google.com"
        ) {
            this.eventEmitter.emit("EmailTrack", {
                id: req.params.id,
                ua: parser(headers["user-agent"]),
            })
        }
        let options = {
            root: path.join(__dirname, "../"),
        };
        let fileName = "image3.webp";
        res.sendFile(fileName, options);
    }


    async receiveData(@Req() req, @Res() res, @Body() bodyParams) {
        try {
            // find the sender's email id
            const data = bodyParams;
            const userEmail = await this.userService.getUserByEmail(data.sender);
            if (userEmail == null) {
                throw new Error("Email not Found");
            }
            await this.emailService.saveEmailData({
                trackingId: data.id,
                receiver: data.currentEmail,
                sender: userEmail.id,
                subject: data.currentSubject,
                files: data.files,
                campaign: data.campaignId,
            })
            const campaign = await this.campaignService.getCampaignById(data.campaignId);
            campaign.sentSuccessfully += 1;
            const result = await this.campaignService.createCampaign(campaign);
            return res.status(HttpStatus.OK).json({
                success: true,
                result: result,
                message: "receive data..",
            })
        } catch (error) {
            return res.status(HttpStatus.BAD_REQUEST).json({
                success: false,
                message: error.message,
            })
        }
    }

    async doesUserExist(@Res() res, @Body() bodyParams) {
        try {
            const data = await this.userService.getUserByEmail(bodyParams.email);
            if (!data) {
                //  !no record found
                return res.status(HttpStatus.NOT_FOUND).json({
                    id: "",
                    subscribe: false,
                });
            }
            return res.status(HttpStatus.OK).json({
                id: data.id,
                subscribe: true,
            });

        } catch (error) {
            console.log(
                "🚀 ~ file: mailMergePlugin.controller.js:128 ~ doesUserExist ~ error",
                error
            );
            return res.status(HttpStatus.BAD_REQUEST).json({
                id: "",
                subscribe: false,
            });
        }
    }

    async unSubscribeUser(@Res() res, @Body() bodyParams) {
        const { id, email } = bodyParams;

        try {
            // *check if email exists
            const result = await this.userService.getUserById(id);
            if (!result) {
                return res.status(HttpStatus.BAD_REQUEST).json({
                    success: false,
                    message: "Invalid Subscribe link.",
                });
            }
            // *check if user is already unSubscribed
            const alreadyExist = await this.userService.getUnsubscribeUser({ email, id })
            if (alreadyExist) {
                return res.status(HttpStatus.BAD_REQUEST).json({
                    success: false,
                    message: "Already unsubscribe.",
                });
            }
            // *add to unScriber List

            await this.userService.saveUnsubscribeUser({
                unSubscriber: email,
                unSubscribeFrom: id,
            })

            const update = await this.emailService.updateEmailsData({ id, email });
            return res.status(200).json({
                success: true,
                message: "unSubscribe Successfully!",
                result: update,
            });
        } catch (error) {
            return res.status(HttpStatus.BAD_REQUEST).json({
                success: false,
                message: "Something went wrong or Invalid Link",
            });
        }
    }

    async getAllUnSubscriberByEmail(@Res() res, @Query() queryParams) {
        try {
            const result = await this.userService.getUnsubscribeUsers(queryParams);
            return res.status(HttpStatus.BAD_REQUEST).json({
                success: true,
                result: result,
                message: "data fetched successfully "
            })
        } catch (error) {
            return res.status(HttpStatus.BAD_REQUEST).json({
                success: false,
                result: [],
                message: error.message
            })
        }
    }

}