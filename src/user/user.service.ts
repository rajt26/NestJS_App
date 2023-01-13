import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { UserDocument, User } from './schema/user.schema'
import { PasswordHashService } from "./password-hash.service";
import { UserFindDto } from "./dtos/user.dto";
import { UnSubScribeUser, UnSubScribeUserDocument } from "./schema/unSubscibeUsers.schema";

@Injectable()
export class UserService {

    constructor(
        @InjectModel(User.name) private userModel: Model<UserDocument>,
        @InjectModel(UnSubScribeUser.name) private UnSubScribeUserModel: Model<UnSubScribeUserDocument>,
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

    async searchFilterUsers(queryData: Record<string, any>): Promise<any> {
        const searchValue = queryData.search;
        const page = parseInt(queryData.page) || 1;
        const limit = parseInt(queryData.limit) || 5;
        const skip = page * limit - limit;

        try {
            const result = await this.userModel.find({
                $or: [
                    { 'name': { "$regex": searchValue, "$options": "i" } },
                    { 'email': { "$regex": searchValue, "$options": "i" } },
                    { 'roles': { "$regex": searchValue, "$options": "i" } }
                ]
            }).skip(skip).limit(limit);

            const count = await this.userModel.find({
                $or: [{ 'name': { "$regex": searchValue, "$options": "i" } },
                { 'email': { "$regex": searchValue, "$options": "i" } },
                { 'roles': { "$regex": searchValue, "$options": "i" } }]
            }).countDocuments();

            if (result.length == 0) {
                return {
                    success: false,
                    result: [],
                    count: 0,
                    message: "No result"
                }
            }
            return {
                success: true,
                result,
                message: "Found",
                count
            }
        } catch (error) {
            throw new Error(error.message);
        }
    }

    async getAllUnSubscriber(queryData: Record<string, any>, email: string): Promise<any> {
        const searchValue = queryData.search;
        const page = parseInt(queryData.page) || 1;
        const limit = parseInt(queryData.limit) || 5;
        const skip = page * limit - limit;

        try {
            const result = await this.UnSubScribeUserModel.find({
                $and: [{ 'unSubscribeFrom': email }, {
                    $or: [{ 'unSubscriber': { "$regex": searchValue, "$options": "i" } },
                    ]
                }]
            }).skip(skip).limit(limit).sort({ _id: -1 });

            // * Get a the Total Count of The unSubscriber List
            const count = await this.UnSubScribeUserModel.find({
                $and: [{ 'unSubscribeFrom': email }, {
                    $or: [{ 'unSubscriber': { "$regex": searchValue, "$options": "i" } },
                    ]
                }]
            }).countDocuments();

            if (count == 0) {
                // !No unSubscriber found
                return {
                    success: false,
                    message: "No Unsubscriber Found",
                    result,
                    count
                }
            }
            return {
                success: true,
                message: "Unsubscriber data fetch successfully",
                result,
                count
            }
        } catch (error) {
            throw new Error(error.message);
        }
    }

    async saveUnsubscribeUser(unSubscribeUser: Record<string, any>): Promise<UnSubScribeUser> {
        const newUnSubscriber = await new this.UnSubScribeUserModel(unSubscribeUser);
        return newUnSubscriber.save();
    }

    async getUnsubscribeUser(unSubscribeUser: Record<string, any>): Promise<UnSubScribeUser> {
        return await this.UnSubScribeUserModel.findOne({
            $and: [{ unSubscriber: unSubscribeUser.email }, { unSubscribeFrom: unSubscribeUser.id }],
        })
    }

    async getUnsubscribeUsers(queryData: Record<string, any>): Promise<any> {
        let userExist = await this.getUserByEmail(queryData.email);
        let result = await this.UnSubScribeUserModel.find({
            unSubscribeFrom: userExist.id,
        }).select("unSubscriber");

        if (!result.length) {
            return {
                success: false,
                result: [],
                message: "No result"
            }
        }
        return {
            success: true,
            result: result,
            message: "Unsubscribe User data fetched successfully"
        };

    }
}