import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { UserService } from "src/user/user.service";
import { JwtService } from "@nestjs/jwt";
import { PasswordHashService } from "src/user/password-hash.service";

@Injectable()
export class AuthService {
    constructor(private userService: UserService, private jwtService: JwtService, private passwordHashService: PasswordHashService) { }

    async validateUser(email: string, password: string): Promise<any> {
        const user = await this.userService.getUserByEmail(email);
        const isCorrectPassword = await this.passwordHashService.comparePassword(password, user.password)

        if (user && isCorrectPassword) {
            return user;
        }
        throw new HttpException('Invalid username or password', HttpStatus.UNAUTHORIZED);
    }
    async login(user: any) {
        const payload = {
            username: user.email,
            sub: user.id,
            roles: user.roles,
        };
        const generateToken = this.jwtService.sign(payload)
        return {
            access_token: generateToken
        }
    }
}