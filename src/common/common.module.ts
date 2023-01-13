import { Module } from '@nestjs/common';
import { CommonService } from './common.service';
import { EmailConfigService } from './email/emailConfig.service';

@Module({
    imports: [],
    providers: [EmailConfigService, CommonService],
    exports: [EmailConfigService, CommonService]
})
export class CommonModule { }
