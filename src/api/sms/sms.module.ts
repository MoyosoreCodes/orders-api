import { TwilioModule } from 'nestjs-twilio';
import { Module } from "@nestjs/common";
import { ConfigService } from '@nestjs/config';
import { SMSService } from './sms.service';

@Module({
  imports: [
    TwilioModule.forRootAsync({
        inject: [ConfigService],
        useFactory: (configService: ConfigService) => ({
            accountSid: configService.get('TWILIO_ACCOUNT_SID'),
            authToken: configService.get('TWILIO_AUTH_TOKEN'),
        })
    })
  ],
  providers: [SMSService],
  exports: [SMSService]
})
export class SMSModule {}