import { Module } from '@nestjs/common';

import { PrismaService } from 'src/prisma.service';
import { HomepageSlideController } from './homepage-slide.controller';
import { HomepageSlideService } from './homepage-slide.service';

@Module({
  controllers: [HomepageSlideController],
  providers: [HomepageSlideService, PrismaService],
})
export class HomepageSlideModule {}

