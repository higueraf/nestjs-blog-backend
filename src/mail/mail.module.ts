import { Module } from '@nestjs/common';
import { MailService } from './mail.service';
import { MailController } from './main.controller';

@Module({
  controllers: [MailController],
  providers: [MailService],
  exports: [MailService]
})
export class MailModule {}
