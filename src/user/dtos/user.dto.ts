import { IsString, IsNotEmpty, IsEmail, IsArray, IsOptional, MinLength, MaxLength, Matches, IsMongoId } from 'class-validator';
import { Role } from 'src/auth/enums/role.enum';

export class UserDto {
    @IsNotEmpty()
    @IsString()
    name: string;

    @IsNotEmpty()
    @IsEmail()
    @IsString()
    email: string;

    @IsNotEmpty()
    @IsString()
    @MinLength(4)
    @MaxLength(20)
    @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, { message: 'password is too weak' })
    password: string;

    @IsOptional()
    @IsArray()
    roles: Role[];
}

export class UserFindDto {
    @IsOptional()
    id: string;

    @IsOptional()
    @IsString()
    name: string

    @IsOptional()
    @IsString()
    password: string

    @IsOptional()
    @IsEmail()
    @IsString()
    email: string;

    @IsOptional()
    @IsArray()
    roles: Role[];
}

export class UserLoginDto {

    @IsNotEmpty()
    email: string;

    @IsNotEmpty()
    password: string;

}

export class UserUpdateDto {
    @IsOptional()
    @IsString()
    name: string;

    @IsOptional()
    @IsEmail()
    @IsString()
    email: string;

    @IsOptional()
    @IsString()
    @MinLength(4)
    @MaxLength(20)
    @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, { message: 'password contain 1 lowercase letter and 1 Uppercase letter and number' })
    password: string

    @IsOptional()
    @IsArray()
    roles: Role[];
}

export class EditProfileDto {
    @IsOptional()
    @IsString()
    name: string;

    @IsOptional()
    @IsEmail()
    @IsString()
    email: string;
}

export class changePasswordDto {
    @IsNotEmpty()
    oldPassword: string;

    @IsNotEmpty()
    @MinLength(4)
    @MaxLength(20)
    @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, { message: 'password contain 1 lowercase letter and 1 Uppercase letter and number' })
    newPassword: string;

}