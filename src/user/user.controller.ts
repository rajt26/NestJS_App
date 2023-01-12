
import { Body, Controller, Delete, Get, HttpStatus, Param, Post, Put, Req, Res, UseGuards, Request, UsePipes, ValidationPipe } from "@nestjs/common";
import { Query } from "@nestjs/common/decorators";
import { Roles } from "src/auth/decorators/role.decorator";
import { Role } from "src/auth/enums/role.enum";
import { JwtAuthGuard } from "src/auth/guards/jwt-auth.guard";
import { RolesGuard } from "src/auth/guards/role.guard";
import { CampaignService } from "src/email/services/campaign.service";
import { EmailService } from "src/email/services/email.service";
import { changePasswordDto, EditProfileDto, UserUpdateDto } from "./dtos/user.dto";
import { PasswordHashService } from "./password-hash.service";
import { UserService } from "./user.service";



@Controller('user')
@Roles(Role.SUBSCRIBER)
@UseGuards(JwtAuthGuard, RolesGuard)
@UsePipes(new ValidationPipe())
export class UserController {

    constructor(private userService: UserService,
        private passwordHashService: PasswordHashService,
        private emailService: EmailService,
        private campaignService: CampaignService) { }

    @Post('/change-password')
    async changePassword(@Req() req, @Res() res, @Body() bodyParams: changePasswordDto) {
        const user = await this.userService.getUserById(req?.user?.userId);
        const oldPassword = user.password;
        const isCorrectOldPassword = await this.passwordHashService.comparePassword(bodyParams.oldPassword, oldPassword)

        if (!isCorrectOldPassword) {
            return res.status(HttpStatus.BAD_REQUEST).json({
                success: false,
                message: "Your old password is incorrect",
            })
        }

        const hashedPassword = await this.passwordHashService.hashPassword(bodyParams.newPassword);
        const updateUserPassword = await this.userService.update(req.user.userId, { password: hashedPassword });

        return res.status(HttpStatus.OK).json({
            success: true,
            message: "Password Updated!!"
        })
    }

    @Post('/edit-profile')
    async editProfile(@Req() req, @Res() res, @Body() user: EditProfileDto) {
        try {
            const updatedUser = await this.userService.update(req.user.userId, user);
            return res.status(HttpStatus.OK).json({
                success: true,
                result: { user: updatedUser },
                message: "Profile Updated!!",
            })
        } catch (error) {
            return res.status(HttpStatus.BAD_REQUEST).json({
                success: false,
                result: null,
                message: error.message,
            })
        }
    }

    @Get('/emails/all')
    async getAllEmails(@Req() req, @Res() res, @Query() queryParams) {
        try {
            const emails = await this.emailService.getEmails(queryParams, req.user.userId)
            return res.status(HttpStatus.OK).json({
                success: emails.success,
                result: emails.result,
                count: emails.count,
                message: emails.message
            })
        } catch (error) {
            return res.status(HttpStatus.BAD_REQUEST).json({
                success: false,
                result: [],
                count: 0,
                message: error.message
            })
        }
    }

    @Get('/campaigns/all')
    async getAllCampaigns(@Req() req, @Res() res) {
        const userId = req?.user?.userId;
        const dummyTemplateData = [
            { name: "No Campaign", TotalMailCount: 0, sentSuccessFully: 0 },
            { name: "No Campaign", TotalMailCount: 0, sentSuccessFully: 0 },
            { name: "No Campaign", TotalMailCount: 0, sentSuccessFully: 0 },
            { name: "No Campaign", TotalMailCount: 0, sentSuccessFully: 0 }];

        try {
            let campaignList = await this.campaignService.getAllCampaignsByUserId(userId);

            if (campaignList.length == 0) {
                //* if no campaign found send the dummy Campaign List
                return res.status(200).json({
                    success: true,
                    result: dummyTemplateData,
                    message: "Campaign List"
                })
            }
            // * send the Campaign List
            return res.status(200).json({
                success: true,
                result: campaignList,
                message: "Campaign List"
            })
        } catch (error) {
            return res.status(HttpStatus.BAD_REQUEST).json({
                success: false,
                result: null,
                message: error.message,
            })
        }
    }

    @Get('/unsubscribe-user/all')
    async getAllUnSubscriber(@Req() req, @Res() res, @Query() queryParams) {
        const email = req.user.email;
        try {
            const UnSubScriberList = await this.userService.getAllUnSubscriber(queryParams, email);
            return res.status(HttpStatus.OK).json({
                success: UnSubScriberList.success,
                result: UnSubScriberList.result,
                count: UnSubScriberList.count,
                message: UnSubScriberList.message
            })
        } catch (error) {
            return res.status(HttpStatus.BAD_REQUEST).json({
                success: false,
                result: null,
                message: error.message,
            })
        }
    }

}
