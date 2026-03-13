import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { Prisma } from '@prisma/client';
import { UpdateCategoryDto } from './dto/update-category.dto';
import slugify from 'slugify';

@Injectable()
export class CategoryService {
  constructor(private prisma: PrismaService) { }

  private async generateUniqueSlug(
    input: string,
    excludeId?: string,
  ): Promise<string> {
    const base = slugify(input, { lower: true, strict: true, locale: 'vi' });
    if (!base) return crypto.randomUUID();

    let uniqueSlug = base;
    let counter = 2;

    while (true) {
      const existing = await this.prisma.category.findUnique({
        where: { slug: uniqueSlug },
        select: { id: true },
      });

      if (!existing || (excludeId && existing.id === excludeId)) {
        return uniqueSlug;
      }

      uniqueSlug = `${base}-${counter}`;
      counter += 1;
    }
  }

  async createCategory(data: CreateCategoryDto) {
    const existingCategory = await this.prisma.category.findUnique({
      where: { name: data.name },
    });
    const slug = await this.generateUniqueSlug(data.slug?.trim() || data.name);

    if (existingCategory) {
      throw new ConflictException({ message: 'Tên danh mục đã tồn tại' });
    }

    const category = await this.prisma.category.create({
      data: {
        name: data.name,
        slug: slug,
        description: data.description,
      },
      select: {
        id: true,
        name: true,
        slug: true,
        description: true,
        isActive: true,
        createdAt: true,
        updatedAt: true,
      },
    });
    return category;
  }

  async getAllCategory(isActive?: boolean) {
    const where: Prisma.CategoryWhereInput = {};
    if (isActive !== undefined) {
      where.isActive = isActive;
    }
    return this.prisma.category.findMany({
      where,
      orderBy: { createdAt: 'desc' },
    });
  }

  async getCategoryBySlug(slug: string, page = 1, limit = 10) {
    const safePage = page > 0 ? page : 1;
    const safeLimit = limit > 0 ? limit : 10;
    const skip = (safePage - 1) * safeLimit;

    const category = await this.prisma.category.findUnique({
      where: { slug },
      select: {
        id: true,
        name: true,
        slug: true,
        description: true,
        isActive: true,
      },
    });

    if (!category) {
      throw new NotFoundException('Danh mục không tồn tại');
    }

    const [products, totalItems] = await Promise.all([
      this.prisma.product.findMany({
        where: { categoryId: category.id },
        skip,
        take: safeLimit,
        orderBy: { createdAt: 'desc' },
        select: {
          id: true,
          name: true,
          slug: true,
          description: true,
          thumbnail: true,
        },
      }),
      this.prisma.product.count({
        where: { categoryId: category.id },
      }),
    ]);

    return {
      ...category,
      products,
      totalItems,
      totalPages: Math.ceil(totalItems / safeLimit),
      page: safePage,
      limit: safeLimit,
    };
  }
  async updateCategory(id: string, data: UpdateCategoryDto) {
    const category = await this.prisma.category.findUnique({
      where: { id },
    });
    if (!category) {
      throw new NotFoundException('Danh mục không tồn tại');
    }
    let newSlug: string | undefined;
    if (data.slug?.trim()) {
      newSlug = await this.generateUniqueSlug(data.slug, id);
    } else if (data.name?.trim() && data.name !== category.name) {
      newSlug = await this.generateUniqueSlug(data.name, id);
    }
    const updatedCategory = await this.prisma.category.update({
      where: { id },
      data: {
        ...(data.name !== undefined && { name: data.name }),
        ...(newSlug !== undefined && { slug: newSlug }),
        ...(data.description !== undefined && {
          description: data.description,
        }),
        ...(data.isActive !== undefined && { isActive: data.isActive }),
      },
      select: {
        id: true,
        name: true,
        slug: true,
        description: true,
        isActive: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return updatedCategory;
  }
  async deleteCategory(id: string) {
    const category = await this.prisma.category.findUnique({
      where: { id },
      include: {
        _count: {
          select: {
            products: true,
          },
        },
      },
    });

    if (!category) {
      throw new NotFoundException({ message: 'Danh mục không tồn tại' });
    }
    if (category._count.products > 0) {
      throw new ConflictException(
        'Không thể xoá danh mục vì vẫn còn sản phẩm trong danh mục',
      );
    }
    await this.prisma.category.delete({
      where: { id },
    });

    return {
      message: 'Xóa danh mục thành công',
    };
  }
}
