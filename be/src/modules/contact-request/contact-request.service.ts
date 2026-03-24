import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import type { Prisma } from '@prisma/client';
import { PrismaService } from 'src/prisma.service';
import { EmailService } from 'src/services/email.service';
import { CreateContactRequestDto } from './dto/create-contact-request.dto';
import { ReplyContactRequestDto } from './dto/reply-contact-request.dto';
import { UpdateContactRequestDto } from './dto/update-contact-request.dto';

@Injectable()
export class ContactRequestService {
  constructor(
    private prisma: PrismaService,
    private emailService: EmailService,
  ) { }

  private readonly detailInclude = {
    service: {
      select: { id: true, name: true, slug: true },
    },
    productVariant: {
      select: { id: true, name: true, imageUrl: true },
    },
    images: {
      select: { id: true, imageUrl: true, createdAt: true },
      orderBy: { createdAt: 'asc' },
    },
  } satisfies Prisma.ContactRequestInclude;

  async create(dto: CreateContactRequestDto) {
    const created = await this.prisma.contactRequest.create({
      data: {
        name: dto.name,
        phone: dto.phone,
        email: dto.email,
        message: dto.message,
        status: dto.status,
        serviceId: dto.serviceId,
        productVariantId: dto.productVariantId,
        ...(dto.imageUrls?.length
          ? {
            images: {
              create: dto.imageUrls.map((url) => ({ imageUrl: url })),
            },
          }
          : {}),
      },
    });

    // Send immediate "received" confirmation email for customer flow.
    if (dto.email?.trim()) {
      try {
        await this.emailService.sendContactAutoReceivedEmail({
          to: dto.email.trim(),
          customerName: dto.name,
        });
      } catch {
        // Do not fail request creation if email sending has SMTP issues.
      }
    }

    return created;
  }

  async getAll({
    page = 1,
    limit = 50,
    status,
    serviceId,
    productVariantId,
  }: {
    page?: number;
    limit?: number;
    status?: string;
    serviceId?: string;
    productVariantId?: string;
  }) {
    const safePage = page > 0 ? page : 1;
    const safeLimit = limit > 0 ? limit : 50;
    const skip = (safePage - 1) * safeLimit;

    const where: any = {};
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    if (status) where.status = status;
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    if (serviceId) where.serviceId = serviceId;
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    if (productVariantId) where.productVariantId = productVariantId;

    const [data, totalItems] = await Promise.all([
      this.prisma.contactRequest.findMany({
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        where,
        skip,
        take: safeLimit,
        orderBy: { createdAt: 'desc' },
        include: this.detailInclude,
      }),
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      this.prisma.contactRequest.count({ where }),
    ]);

    return {
      data,
      totalItems,
      totalPages: Math.ceil(totalItems / safeLimit),
      page: safePage,
      limit: safeLimit,
    };
  }

  async getById(id: string) {
    const row = await this.prisma.contactRequest.findUnique({
      where: { id },
      include: this.detailInclude,
    });
    if (!row) throw new NotFoundException('Yêu cầu liên hệ không tồn tại');
    return row;
  }

  async update(id: string, dto: UpdateContactRequestDto) {
    const existing = await this.prisma.contactRequest.findUnique({
      where: { id },
      select: { id: true },
    });

    if (!existing) throw new NotFoundException('Yêu cầu liên hệ không tồn tại');

    return this.prisma.contactRequest.update({
      where: { id },
      data: {
        ...(dto.status !== undefined && { status: dto.status }),
      },
    });
  }

  async replyByEmail(id: string, dto: ReplyContactRequestDto) {
    const existing = await this.prisma.contactRequest.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        email: true,
      },
    });

    if (!existing) throw new NotFoundException('Yêu cầu liên hệ không tồn tại');
    if (!existing.email) {
      throw new BadRequestException('Khách chưa cung cấp email để phản hồi');
    }

    const subject = dto.subject?.trim() || 'Floring phản hồi yêu cầu khảo sát của bạn';
    try {
      await this.emailService.sendContactReplyEmail({
        to: existing.email,
        customerName: existing.name,
        subject,
        message: dto.message.trim(),
      });
    } catch (error: unknown) {
      const err = error as { code?: string };
      if (err?.code === 'EAUTH') {
        throw new BadRequestException(
          'Thiếu cấu hình SMTP. Vui lòng kiểm tra EMAIL_USER và EMAIL_PASSWORD trong .env',
        );
      }
      throw new InternalServerErrorException('Không thể gửi email phản hồi lúc này');
    }

    await this.prisma.contactRequest.update({
      where: { id },
      data: { status: 'contacted' },
    });

    return { message: 'Đã gửi email phản hồi thành công' };
  }

  async remove(id: string) {
    const existing = await this.prisma.contactRequest.findUnique({
      where: { id },
      select: { id: true },
    });
    if (!existing) throw new NotFoundException('Yêu cầu liên hệ không tồn tại');

    await this.prisma.contactRequest.delete({ where: { id } });
    return { message: 'Xóa yêu cầu thành công' };
  }
}

