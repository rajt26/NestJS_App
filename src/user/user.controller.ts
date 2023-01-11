
import { Body, Controller, Delete, Get, HttpStatus, Param, Post, Put, Req, Res, UseGuards, Request, UsePipes, ValidationPipe } from "@nestjs/common";
import { Roles } from "src/auth/decorators/role.decorator";
import { Role } from "src/auth/enums/role.enum";
import { JwtAuthGuard } from "src/auth/guards/jwt-auth.guard";
import { RolesGuard } from "src/auth/guards/role.guard";
import { changePasswordDto, EditProfileDto, UserUpdateDto } from "./dtos/user.dto";
import { PasswordHashService } from "./password-hash.service";
import { UserService } from "./user.service";



@Controller('user')
@Roles(Role.SUBSCRIBER)
@UseGuards(JwtAuthGuard, RolesGuard)
@UsePipes(new ValidationPipe())
export class UserController {

    constructor(private userService: UserService, private passwordHashService: PasswordHashService) { }

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
            console.log('user---', req.user);

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
}
