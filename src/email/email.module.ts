import { forwardRef, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UserModule } from 'src/user/user.module';
import { CampaignService } from './services/campaign.service';
import { EmailController } from './controllers/email.controller';
import { EmailService } from './services/email.service';
import { CampaignSchema } from './schemas/campaign.schema';
import { EmailSchema } from './schemas/email.schema';
import { CampaignController } from './controllers/campaign.controller';

@Module({

    imports: [forwardRef(() => UserModule), MongooseModule.forFeature([{ name: 'Campaign', schema: CampaignSchema }, { name: 'Email', schema: EmailSchema }])],
    controllers: [EmailController, CampaignController],
    providers: [EmailService, CampaignService],
    exports: [EmailService, CampaignService]
})
export class EmailModule { }
