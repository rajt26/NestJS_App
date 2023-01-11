import { Body, Controller, Get, HttpStatus, Param, Post, Res, Query } from "@nestjs/common";
import { Mongoose } from "mongoose";
import { UserService } from "src/user/user.service";
import { CampaignDto } from "../dtos/campaign/campaign.dto";
import { Campaign } from "../schemas/campaign.schema";
import { CampaignService } from "../services/campaign.service";



@Controller('campaign')
export class CampaignController {
    constructor(
        private campaignService: CampaignService,
        private userService: UserService
    ) { }

    //create campaign
    @Post('/create')
    async createCampaign(@Res() res, @Body() bodyParams) {
        try {
            const { email, name, totalCount } = bodyParams;
            const user = await this.userService.getUserByEmail(email);
            if (!user) {
                return res.status(HttpStatus.NOT_FOUND).json({
                    success: false,
                    result: null,
                    message: 'User not found',
                })
            }
            const payload: any = {
                name,
                createdBy: user.id,
                totalMailCount: totalCount,
                sentSuccessfully: 0
            }
            const newCampaign = await this.campaignService.createCampaign(payload);
            return res.status(HttpStatus.OK).json({
                success: true,
                result: { campaign: newCampaign },
                message: "New campaign created successfully",
            })
        } catch (error) {
            return res.status(HttpStatus.BAD_REQUEST).json({
                success: false,
                message: error.message,
            })
        }
    }

}