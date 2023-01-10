import { UserService } from "../user/user.service";
import { User } from "src/user/schema/user.schema";
import { Body, Controller, Delete, Get, HttpStatus, Param, Post, Put, Req, Res, UseGuards, Request, UsePipes, ValidationPipe } from "@nestjs/common";
import { AuthService } from "src/auth/auth.service";
import { Roles } from "src/auth/decorators/role.decorator";
import { RolesGuard } from "src/auth/guards/role.guard";
import { Role } from "src/auth/enums/role.enum";
import { LocalAuthGuard } from "src/auth/guards/local-auth.guard";
import { JwtAuthGuard } from "src/auth/guards/jwt-auth.guard";
import { changePasswordDto, UserDto, UserUpdateDto } from "src/user/dto/user.dto";
import { PasswordHashService } from "src/user/password-hash.service";

@Controller('auth')
export class AuthController {
    constructor(private userService: UserService, private authService: AuthService, private passwordHashService: PasswordHashService) { }

    @Post('/create')
    @UsePipes(new ValidationPipe())
    async registerUser(@Res() res, @Body() user: UserDto) {
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

    @UseGuards(JwtAuthGuard)
    @Get('all')
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

    @UseGuards(JwtAuthGuard)
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

    @Get()
    async findByEmail(@Res() res, @Body() userEmail: string) {
        const user = await this.userService.getUserByEmail(userEmail);
        return res.status(HttpStatus.OK).json({
            success: true,
            result: { user },
            message: "User Data fetched successfully.",
        })
    }

    @Roles(Role.ADMIN)
    @UseGuards(JwtAuthGuard, RolesGuard)
    @UsePipes(new ValidationPipe())
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

    @Delete('/delete/:id')
    @Roles(Role.ADMIN)
    @UseGuards(JwtAuthGuard, RolesGuard)
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
    @Roles(Role.ADMIN, Role.SUBSCRIBER)
    @UseGuards(JwtAuthGuard, RolesGuard)
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

}
