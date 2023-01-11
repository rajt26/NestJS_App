import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { Campaign, CampaignDocument } from "../schemas/campaign.schema";

@Injectable()
export class CampaignService {

    constructor(
        @InjectModel(Campaign.name) private campaignModel: Model<CampaignDocument>
    ) { }

    async createCampaign(campaign: Campaign): Promise<Campaign> {
        const newCampaign = new this.campaignModel(campaign)
        return newCampaign.save();
    }

    async getAllCampaignsByUserId(userId: string): Promise<Campaign[]> {
        return await this.campaignModel.find({ createdBy: userId }).select('name').sort({ createdAt: 'desc' }).exec()
    }
}