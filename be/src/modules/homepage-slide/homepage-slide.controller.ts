import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseBoolPipe,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';

import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CreateHomepageSlideDto } from './dto/create-homepage-slide.dto';
import { UpdateHomepageSlideDto } from './dto/update-homepage-slide.dto';
import { HomepageSlideService } from './homepage-slide.service';

@Controller('homepage-slides')
export class HomepageSlideController {
  constructor(private readonly service: HomepageSlideService) { }

  @Get('public')
  getPublicSlides() {
    return this.service.getPublicSlides();
  }

  @UseGuards(JwtAuthGuard)
  @Get('admin')
  getAllAdmin(
    @Query('page', new ParseIntPipe({ optional: true })) page?: number,
    @Query('limit', new ParseIntPipe({ optional: true })) limit?: number,
    @Query('isActive', new ParseBoolPipe({ optional: true })) isActive?: boolean,
  ) {
    return this.service.getAllAdmin({ page, limit, isActive });
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  create(@Body() dto: CreateHomepageSlideDto) {
    return this.service.create(dto);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateHomepageSlideDto) {
    return this.service.update(id, dto);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.service.remove(id);
  }
}

