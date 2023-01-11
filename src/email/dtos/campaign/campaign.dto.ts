import { IsNumber, IsOptional, IsString } from "class-validator"

export class CampaignDto {

    @IsOptional()
    @IsString()
    name: string

    @IsOptional()
    createdBy: string

    @IsOptional()
    @IsNumber()
    totalMailCount: number

}