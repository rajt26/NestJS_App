import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { UserDocument, User } from './schema/user.schema'
import { PasswordHashService } from "./password-hash.service";
import { UserFindDto } from "./dtos/user.dto";

@Injectable()
export class UserService {

    constructor(
        @InjectModel(User.name) private userModel: Model<UserDocument>,
        private passwordHashService: PasswordHashService
    ) { }

    async create(user: User): Promise<User> {
        const newUser = new this.userModel(user);
        newUser.password = await this.passwordHashService.hashPassword(newUser.password);
        return newUser.save();
    }

    async getAll(): Promise<User[]> {
        return await this.userModel.find().exec();
    }

    async getUserById(id): Promise<User> {
        return await this.userModel.findById(id).exec();
    }

    async getUserByEmail(email: String): Promise<UserFindDto> {
        return await this.userModel.findOne({ email });
    }

    async update(id, user): Promise<User> {
        return await this.userModel.findByIdAndUpdate(id, user, { new: true })
    }

    async delete(id): Promise<any> {
        return await this.userModel.findByIdAndRemove(id);
    }
}