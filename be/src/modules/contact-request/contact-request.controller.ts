import {
    Body,
    Controller,
    DefaultValuePipe,
    Delete,
    Get,
    Param,
    ParseIntPipe,
    Patch,
    Post,
    Query,
    UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CreateContactRequestDto } from './dto/create-contact-request.dto';
import { ReplyContactRequestDto } from './dto/reply-contact-request.dto';
import { UpdateContactRequestDto } from './dto/update-contact-request.dto';
import { ContactRequestService } from './contact-request.service';

@Controller('contact-request')
export class ContactRequestController {
    constructor(private readonly service: ContactRequestService) { }

    @Post()
    create(@Body() dto: CreateContactRequestDto) {
        return this.service.create(dto);
    }

    @UseGuards(JwtAuthGuard)
    @Get()
    getAllAdmin(
        @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
        @Query('limit', new DefaultValuePipe(50), ParseIntPipe) limit: number,
        @Query('status') status?: string,
        @Query('serviceId') serviceId?: string,
        @Query('productVariantId') productVariantId?: string,
    ) {
        return this.service.getAll({ page, limit, status, serviceId, productVariantId });
    }

    @UseGuards(JwtAuthGuard)
    @Get(':id')
    getDetail(@Param('id') id: string) {
        return this.service.getById(id);
    }

    @UseGuards(JwtAuthGuard)
    @Patch(':id')
    update(
        @Param('id') id: string,
        @Body() dto: UpdateContactRequestDto,
    ) {
        return this.service.update(id, dto);
    }

    @UseGuards(JwtAuthGuard)
    @Post(':id/reply')
    replyByEmail(
        @Param('id') id: string,
        @Body() dto: ReplyContactRequestDto,
    ) {
        return this.service.replyByEmail(id, dto);
    }

    @UseGuards(JwtAuthGuard)
    @Delete(':id')
    remove(@Param('id') id: string) {
        return this.service.remove(id);
    }
}

