import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { AuthService } from "../auth.service";
import { UnauthorizedException, Injectable } from '@nestjs/common';
import { UserLoginDto } from 'src/user/dtos/user.dto';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
    constructor(private authService: AuthService) {
        super();
    }

    async validate(email: string, password: string): Promise<UserLoginDto> {
        const user = await this.authService.validateUser(email, password);
        if (!user) {
            throw new UnauthorizedException({
                message: "You have entered a wrong username or password"
            });
        }
        return user;
    }
}