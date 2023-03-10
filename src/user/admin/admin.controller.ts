import { Body, Controller, Delete, Get, HttpStatus, Param, Post, Put, Req, Res, UseGuards, Request, UsePipes, ValidationPipe, Query } from "@nestjs/common";
import mongoose from "mongoose";
import { Roles } from "src/auth/decorators/role.decorator";
import { Role } from "src/auth/enums/role.enum";
import { JwtAuthGuard } from "src/auth/guards/jwt-auth.guard";
import { RolesGuard } from "src/auth/guards/role.guard";
import { CampaignService } from "src/email/services/campaign.service";
import { EmailService } from "src/email/services/email.service";
import { PasswordHashService } from "src/user/password-hash.service";
import { changePasswordDto, UserUpdateDto } from "../dtos/user.dto";
import { UserService } from "../user.service";
import { AdminService } from "./admin.service";

@Controller('admin')
@Roles(Role.ADMIN)
@UseGuards(JwtAuthGuard, RolesGuard)
@UsePipes(new ValidationPipe())
export class AdminController {

    constructor(private userService: UserService,
        private passwordHashService: PasswordHashService,
        private campaignService: CampaignService,
        private emailService: EmailService,
        private adminService: AdminService) { }

    @Get('/all')
    async fetchAll(@Res() res) {
        try {
            const users = await this.userService.getAll();
            return res.status(HttpStatus.OK).json({
                success: true,
                result: users,
                message: "Users data fetched successfully",
            })
        } catch (error) {
            return res.status(HttpStatus.BAD_REQUEST).json({
                success: false,
                result: null,
                message: error.message,
            })
        }

    }

    @Get('/:id')
    async findById(@Res() res, @Param('id') id) {
        try {
            const user = await this.userService.getUserById(id);
            return res.status(HttpStatus.OK).json({
                success: true,
                result: user,
                message: "User data fetched successfully",
            })
        } catch (error) {
            return res.status(HttpStatus.BAD_REQUEST).json({
                success: false,
                result: null,
                message: error.message,
            })
        }

    }

    async findByEmail(@Res() res, @Body() userEmail: string) {
        const user = await this.userService.getUserByEmail(userEmail);
        return res.status(HttpStatus.OK).json({
            success: true,
            result: { user },
            message: "User Data fetched successfully.",
        })
    }

    @Put('/update/:id')
    async update(@Res() res, @Param('id') id, @Body() user: UserUpdateDto) {
        try {
            const updatedUser = await this.userService.update(id, user);
            return res.status(HttpStatus.OK).json({
                success: true,
                result: { user: updatedUser },
                message: "User data updated successfully",
            })
        } catch (error) {
            return res.status(HttpStatus.BAD_REQUEST).json({
                success: false,
                result: null,
                message: error.message,
            })
        }
    }

    @Post('/edit-profile')
    async editProfile(@Req() req, @Res() res, @Body() user: UserUpdateDto) {
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

    @Delete('/delete/:id')
    async delete(@Res() res, @Param('id') id) {
        try {
            const deletedUser = await this.userService.delete(id);
            return res.status(HttpStatus.OK).json({
                success: true,
                result: { user: deletedUser },
                message: "User deleted successfully",
            })
        } catch (error) {
            return res.status(HttpStatus.BAD_REQUEST).json({
                success: false,
                result: null,
                message: error.message,
            })
        }

    }

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

    @Get('/campaigns/all')
    async getAllCampaigns(@Req() req, @Res() res, @Query('id') id) {
        try {
            const userId = id;
            const campaigns = await this.campaignService.getAllCampaignsByUserId(userId);
            return res.status(HttpStatus.OK).json({
                success: true,
                result: campaigns,
                message: "All campaigns are successfully fetched"
            })
        } catch (error) {
            return res.status(HttpStatus.BAD_REQUEST).json({
                success: false,
                result: [],
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

    @Get('/users/search-users')
    async search(@Res() res, @Query() queryParams) {
        try {
            const getSearchData = await this.userService.searchFilterUsers(queryParams);
            return res.status(HttpStatus.OK).json({
                success: getSearchData.success,
                result: getSearchData.result,
                count: getSearchData.count,
                message: getSearchData.message
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

    @Get('/dashboard')
    async adminDashBoardData(@Res() res) {
        try {
            // * service to get Total number of Users from DB.
            const userCount = await this.adminService.getUserCount();

            // *service to get Total Number of Emails Sent from DB.
            const emailCount = await this.adminService.getEmailCount();

            // *service to get Total Number of Emails Tracked from DB.
            const trackedEmailCount = await this.adminService.getTrackEmailsCount();

            // *service to get Total Number of Emails Sent in a Week from DB.
            const weeklyCount = await this.adminService.getWeeklyEmailCount();
            return res.status(200).json({
                success: true,
                result: {
                    userCount,
                    emailCount,
                    trackedEmailCount,
                    weeklyCount
                },
                message: "Successfully fetched dashboard data"
            });
        } catch (error) {
            return res.status(HttpStatus.BAD_REQUEST).json({
                success: false,
                message: error.message
            })
        }
    }
}
