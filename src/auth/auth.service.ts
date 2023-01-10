import { Injectable } from "@nestjs/common";
import { UserService } from "src/user/user.service";
import { JwtService } from "@nestjs/jwt";

@Injectable()
export class AuthService {
    constructor(private userService: UserService, private jwtService: JwtService) { }

    async validateUser(email: string, password: string): Promise<any> {
        const user = await this.userService.getUserByEmail(email);
        if (user && user.password === password) {
            return user;
        }
        return null;
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