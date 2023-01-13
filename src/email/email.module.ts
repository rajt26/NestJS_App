import { forwardRef, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UserModule } from 'src/user/user.module';
import { CampaignService } from './services/campaign.service';
import { EmailController } from './controllers/email.controller';
import { EmailService } from './services/email.service';
import { CampaignSchema } from './schemas/campaign.schema';
import { EmailSchema } from './schemas/email.schema';
import { CampaignController } from './controllers/campaign.controller';
import { CommonModule } from 'src/common/common.module';

@Module({

    imports: [forwardRef(() => UserModule), CommonModule, MongooseModule.forFeature([{ name: 'Campaign', schema: CampaignSchema }, { name: 'Email', schema: EmailSchema }])],
    controllers: [EmailController, CampaignController],
    providers: [EmailService, CampaignService],
    exports: [EmailService, CampaignService]
})
export class EmailModule { }
