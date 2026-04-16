import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { CreateServiceDto } from './dto/create-service.dto';
import { UpdateServiceDto } from './dto/update-service.dto';
import { generateUniqueSlug } from 'src/common/slug';

@Injectable()
export class ServiceService {
  constructor(private prisma: PrismaService) { }

  private existsServiceBySlug = async (slug: string) => {
    const existing = await this.prisma.service.findUnique({
      where: { slug },
      select: { id: true },
    });
    return existing?.id ?? null;
  };

  async create(dto: CreateServiceDto) {
    const slug = await generateUniqueSlug(
      dto.slug?.trim() || dto.name,
      this.existsServiceBySlug,
    );

    return this.prisma.service.create({
      data: {
        name: dto.name,
        slug,
        description: dto.description,
        imageUrl: dto.imageUrl,
        ...(dto.isActive !== undefined && { isActive: dto.isActive }),
      },
      select: {
        id: true,
        name: true,
        slug: true,
        description: true,
        imageUrl: true,
        isActive: true,
      },
    });
  }

  async getAll({ page = 1, limit = 6, isActive }: { page?: number; limit?: number; isActive?: boolean }) {
    const safePage = page > 0 ? page : 1;
    const safeLimit = limit > 0 ? limit : 6;
    const skip = (safePage - 1) * safeLimit;

    const where = isActive === undefined ? {} : { isActive };

    const [data, totalItems] = await Promise.all([
      this.prisma.service.findMany({
        where,
        skip,
        take: safeLimit,
        orderBy: { createdAt: 'desc' },
        select: {
          id: true,
          name: true,
          slug: true,
          description: true,
          imageUrl: true,
          isActive: true,
        },
      }),
      this.prisma.service.count({ where }),
    ]);

    return {
      data,
      totalItems,
      totalPages: Math.ceil(totalItems / safeLimit),
      page: safePage,
      limit: safeLimit,
    };
  }

  async getBySlug(slug: string, opts?: { requireActive?: boolean }) {
    const service = await this.prisma.service.findUnique({
      where: { slug },
      select: {
        id: true,
        name: true,
        slug: true,
        description: true,
        imageUrl: true,
        isActive: true,
      },
    });

    if (!service) throw new NotFoundException('Dịch vụ không tồn tại');
    if (opts?.requireActive && !service.isActive) {
      throw new NotFoundException('Dịch vụ không tồn tại');
    }

    const { isActive: _isActive, ...output } = service;
    return output;
  }

  async update(id: string, dto: UpdateServiceDto) {
    const existing = await this.prisma.service.findUnique({
      where: { id },
      select: { id: true, slug: true, name: true, isActive: true },
    });
    if (!existing) throw new NotFoundException('Dịch vụ không tồn tại');

    let newSlug: string | undefined;
    if (dto.slug?.trim()) {
      newSlug = await generateUniqueSlug(dto.slug, this.existsServiceBySlug, id);
    } else if (dto.name?.trim() && dto.name !== existing.name) {
      newSlug = await generateUniqueSlug(dto.name, this.existsServiceBySlug, id);
    }

    return this.prisma.service.update({
      where: { id },
      data: {
        ...(dto.name !== undefined && { name: dto.name }),
        ...(newSlug !== undefined && { slug: newSlug }),
        ...(dto.description !== undefined && { description: dto.description }),
        ...(dto.imageUrl !== undefined && { imageUrl: dto.imageUrl }),
        ...(dto.isActive !== undefined && { isActive: dto.isActive }),
      },
      select: {
        id: true,
        name: true,
        slug: true,
        description: true,
        imageUrl: true,
        isActive: true,
      },
    });
  }

  async remove(id: string) {
    const existing = await this.prisma.service.findUnique({
      where: { id },
      select: { id: true },
    });
    if (!existing) throw new NotFoundException('Dịch vụ không tồn tại');

    await this.prisma.service.delete({ where: { id } });
    return { message: 'Xóa dịch vụ thành công' };
  }
}

