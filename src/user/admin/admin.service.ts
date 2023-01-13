import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { Email, EmailDocument } from "src/email/schemas/email.schema";
import { User, UserDocument } from "../schema/user.schema";
import * as moment from 'moment';

export class AdminService {
    constructor(
        @InjectModel(User.name) private userModel: Model<UserDocument>,
        @InjectModel(Email.name) private emailModel: Model<EmailDocument>
    ) { }

    /*
    *Function to Get the Count of Total Number of Users
    */
    async getUserCount() {
        try {
            const count = await this.userModel.find().countDocuments();
            return count;
        } catch (error) {
            console.log("🚀 ~ file: admin.service.js:8 ~ getUsersCount ~ error", error)
            throw new Error("Cannot Count Users error:" + error.message);
        }
    }

    /*
        *Function to get the Count of Total Number of Emails Sent
    */

    async getEmailCount() {
        try {
            const count = await this.emailModel.find().countDocuments();
            return count;
        } catch (error) {
            console.log("🚀 ~ file: admin.service.js:8 ~ getUsersCount ~ error", error)
            throw new Error("Cannot Count Users error:" + error.message);
        }
    }

    /*
        *Function to get the Count of Total Number of Emails Sent
    */

    async getTrackEmailsCount() {
        try {
            const count = await this.emailModel.find({ 'trackingDetails.isOpen': true }).countDocuments();
            return count;
        } catch (error) {
            throw new Error("Cannot Count Tracked Emails error:" + error.message);
        }
    }

    /*
    *Function to get The Number of Emails Sent Day Wise
    */

    async getWeeklyEmailCount() {
        try {
            const data = await this.emailModel.aggregate([{
                $match: {
                    "createdAt": {
                        $gte: moment().startOf('isoWeek').toDate(),
                        $lt: moment().endOf('isoWeek').toDate(),
                    }
                }
            },
            {
                $group: {
                    _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
                    count: { $sum: 1 }
                }
            },
            {
                $sort: { _id: 1 }
            }
            ]);
            return data;
        } catch (error) {
            console.log("🚀 ~ file: admin.service.js:52 ~ getWeeklyEmailCount ~ error", error)
            throw new Error("Cannot Count Weekly Emails error:" + error.message);
        }
    }

}