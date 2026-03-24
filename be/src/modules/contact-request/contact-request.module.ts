import { Module } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { EmailService } from 'src/services/email.service';
import { ContactRequestController } from './contact-request.controller';
import { ContactRequestService } from './contact-request.service';

@Module({
  controllers: [ContactRequestController],
  providers: [ContactRequestService, PrismaService, EmailService],
})
export class ContactRequestModule {}

