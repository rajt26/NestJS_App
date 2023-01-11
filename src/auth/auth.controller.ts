import { UserService } from "../user/user.service";
import { Body, Controller, HttpStatus, Post, Req, Res, UseGuards, UsePipes, ValidationPipe } from "@nestjs/common";
import { AuthService } from "src/auth/auth.service";
import { LocalAuthGuard } from "src/auth/guards/local-auth.guard";
import { UserDto } from "src/user/dtos/user.dto";
import { PasswordHashService } from "src/user/password-hash.service";

@Controller('auth')
export class AuthController {
    constructor(private userService: UserService, private authService: AuthService, private passwordHashService: PasswordHashService) { }

    @Post('/signup')
    @UsePipes(new ValidationPipe())
    async signUp(@Res() res, @Body() user: UserDto) {
        try {
            const alreadyExist = await this.userService.getUserByEmail(user.email);
            if (alreadyExist) {
                return res.status(400).json({
                    success: false,
                    result: null,
                    message: 'User already exist.',
                });
            }
            const newUser = await this.userService.create(user);
            return res.status(HttpStatus.CREATED).json({
                success: true,
                result: { user: newUser },
                message: "User created successfully",
            })
        } catch (error) {
            return res.status(HttpStatus.BAD_REQUEST).json({
                success: false,
                result: null,
                message: error.message,
            })
        }

    }

    @Post('/login')
    @UseGuards(LocalAuthGuard)
    async login(@Req() req) {
        return this.authService.login(req.user);
    }







    // @Post('/change-password')
    // @Roles(Role.ADMIN, Role.SUBSCRIBER)
    // @UseGuards(JwtAuthGuard, RolesGuard)
    // async changePassword(@Req() req, @Res() res, @Body() bodyParams: changePasswordDto) {
    //     const user = await this.userService.getUserById(req?.user?.userId);
    //     const oldPassword = user.password;
    //     const isCorrectOldPassword = await this.passwordHashService.comparePassword(bodyParams.oldPassword, oldPassword)

    //     if (!isCorrectOldPassword) {
    //         return res.status(HttpStatus.BAD_REQUEST).json({
    //             success: false,
    //             message: "Your old password is incorrect",
    //         })
    //     }

    //     const hashedPassword = await this.passwordHashService.hashPassword(bodyParams.newPassword);
    //     const updateUserPassword = await this.userService.update(req.user.userId, { password: hashedPassword });

    //     return res.status(HttpStatus.OK).json({
    //         success: true,
    //         message: "Password Updated!!"
    //     })
    // }

}
