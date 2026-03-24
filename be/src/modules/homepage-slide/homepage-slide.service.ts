import { Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';

import { PrismaService } from 'src/prisma.service';
import { CreateHomepageSlideDto } from './dto/create-homepage-slide.dto';
import { UpdateHomepageSlideDto } from './dto/update-homepage-slide.dto';

@Injectable()
export class HomepageSlideService {
  constructor(private prisma: PrismaService) {}

  async getPublicSlides() {
    return this.prisma.homepageSlide.findMany({
      where: { isActive: true },
      orderBy: { sortOrder: 'asc' },
      select: {
        id: true,
        imageUrl: true,
        title: true,
        description: true,
        ctaLabel: true,
        ctaHref: true,
      },
    });
  }

  async getAllAdmin({
    page = 1,
    limit = 50,
    isActive,
  }: {
    page?: number;
    limit?: number;
    isActive?: boolean;
  }) {
    const safePage = page > 0 ? page : 1;
    const safeLimit = limit > 0 ? limit : 50;
    const skip = (safePage - 1) * safeLimit;

    const where: Prisma.HomepageSlideWhereInput = {};
    if (isActive !== undefined) where.isActive = isActive;

    const [data, totalItems] = await Promise.all([
      this.prisma.homepageSlide.findMany({
        where,
        skip,
        take: safeLimit,
        orderBy: { sortOrder: 'asc' },
        select: {
          id: true,
          title: true,
          description: true,
          imageUrl: true,
          ctaLabel: true,
          ctaHref: true,
          sortOrder: true,
          isActive: true,
          createdAt: true,
          updatedAt: true,
        },
      }),
      this.prisma.homepageSlide.count({ where }),
    ]);

    return {
      data,
      totalItems,
      totalPages: Math.ceil(totalItems / safeLimit),
      page: safePage,
      limit: safeLimit,
    };
  }

  async create(dto: CreateHomepageSlideDto) {
    return this.prisma.homepageSlide.create({
      data: {
        title: dto.title,
        description: dto.description,
        imageUrl: dto.imageUrl,
        ctaLabel: dto.ctaLabel,
        ctaHref: dto.ctaHref,
        sortOrder: dto.sortOrder ?? 0,
        isActive: dto.isActive ?? true,
      },
      select: {
        id: true,
        title: true,
        description: true,
        imageUrl: true,
        ctaLabel: true,
        ctaHref: true,
        sortOrder: true,
        isActive: true,
        createdAt: true,
        updatedAt: true,
      },
    });
  }

  async update(id: string, dto: UpdateHomepageSlideDto) {
    const existing = await this.prisma.homepageSlide.findUnique({
      where: { id },
      select: { id: true },
    });

    if (!existing) throw new NotFoundException('Slide không tồn tại');

    return this.prisma.homepageSlide.update({
      where: { id },
      data: {
        ...(dto.title !== undefined && { title: dto.title }),
        ...(dto.description !== undefined && { description: dto.description }),
        ...(dto.imageUrl !== undefined && { imageUrl: dto.imageUrl }),
        ...(dto.ctaLabel !== undefined && { ctaLabel: dto.ctaLabel }),
        ...(dto.ctaHref !== undefined && { ctaHref: dto.ctaHref }),
        ...(dto.sortOrder !== undefined && { sortOrder: dto.sortOrder }),
        ...(dto.isActive !== undefined && { isActive: dto.isActive }),
      },
      select: {
        id: true,
        title: true,
        description: true,
        imageUrl: true,
        ctaLabel: true,
        ctaHref: true,
        sortOrder: true,
        isActive: true,
        createdAt: true,
        updatedAt: true,
      },
    });
  }

  async remove(id: string) {
    const existing = await this.prisma.homepageSlide.findUnique({
      where: { id },
      select: { id: true },
    });

    if (!existing) throw new NotFoundException('Slide không tồn tại');

    await this.prisma.homepageSlide.delete({ where: { id } });
    return { message: 'Xóa slide thành công' };
  }
}

