import { UserService } from "../user/user.service";
import { User } from "src/user/schema/user.schema";
import { Body, Controller, Delete, Get, HttpStatus, Param, Post, Put, Req, Res, UseGuards, Request } from "@nestjs/common";
import { AuthService } from "src/auth/auth.service";
import { Roles } from "src/auth/decorators/role.decorator";
import { RolesGuard } from "src/auth/guards/role.guard";
import { Role } from "src/auth/enums/role.enum";
import { LocalAuthGuard } from "src/auth/guards/local-auth.guard";
import { JwtAuthGuard } from "src/auth/guards/jwt-auth.guard";

@Controller('auth')
export class AuthController {
    constructor(private userService: UserService, private authService: AuthService) { }

    @Post('/create')
    async registerUser(@Res() res, @Body() user: User) {
        const newUser = await this.userService.create(user);
        return res.status(HttpStatus.CREATED).json({
            newUser
        })
    }

    @Get('all')
    async fetchAll(@Res() response) {
        const users = await this.userService.getAll();
        return response.status(HttpStatus.OK).json({
            users
        })
    }

    @Get('/:id')
    async findById(@Res() response, @Param('id') id) {
        const user = await this.userService.getUserById(id);
        return response.status(HttpStatus.OK).json({
            user
        })
    }

    @Get()
    async findByEmail(@Res() response, @Body() userEmail: String) {
        const user = await this.userService.getUserByEmail(userEmail);
        return response.status(HttpStatus.OK).json({
            user
        })
    }

    @Roles(Role.ADMIN)
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Put('/update/:id')
    async update(@Req() req, @Res() response, @Param('id') id, @Body() user: User) {
        const updatedUser = await this.userService.update(id, user);
        return response.status(HttpStatus.OK).json({
            updatedUser
        })
    }

    @Delete('/delete/:id')
    @Roles(Role.ADMIN)
    @UseGuards(JwtAuthGuard, RolesGuard)
    async delete(@Res() response, @Param('id') id) {
        const deletedUser = await this.userService.delete(id);
        return response.status(HttpStatus.OK).json({
            deletedUser
        })
    }

    @Post('/login')
    @UseGuards(LocalAuthGuard)
    async login(@Request() req) {
        return this.authService.login(req.user);
    }

}
