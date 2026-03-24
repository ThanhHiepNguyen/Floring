import { BadRequestException, ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { GetProductsQueryDto } from './dto/get-products-query.dto';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';

const PRODUCT_SELECT = {
  id: true,
  name: true,
  description: true,
  imageUrl: true,
  slug: true,
  brand: true,
  style: true,
  range: true,
  priceGuide: true,
  priceSortOrder: true,
  service: {
    select: {
      id: true,
      name: true,
    },
  },
  variants: {
    where: { isActive: true },
    orderBy: { createdAt: 'desc' as const },
    select: {
      id: true,
      name: true,
      imageUrl: true,
      colorCode: true,
      swatchImage: true,
      primaryImage: true,
      permalink: true,
      price: true,
      rrp: true,
      sku: true,
    },
  },
} as const;

@Injectable()
export class ProductService {
  constructor(private prisma: PrismaService) { }

  private normalizeString(value: string | undefined) {
    const v = value?.trim();
    return v && v.length > 0 ? v : undefined;
  }

  private async ensureServiceExists(serviceId: string) {
    const service = await this.prisma.service.findUnique({
      where: { id: serviceId },
      select: { id: true },
    });
    if (!service) {
      throw new BadRequestException('serviceId không hợp lệ hoặc không tồn tại');
    }
  }

  private async ensureSlugUnique(slug: string, exceptId?: string) {
    const existing = await this.prisma.product.findUnique({
      where: { slug },
      select: { id: true },
    });
    if (existing && existing.id !== exceptId) {
      throw new ConflictException('Slug đã tồn tại');
    }
  }

  private mapVariant(v: {
    id: string;
    name: string;
    imageUrl: string | null;
    colorCode: string | null;
    swatchImage: string | null;
    primaryImage: string | null;
    permalink: string | null;
    price: number | null;
    rrp: number | null;
    sku: string | null;
  }) {
    return {
      id: v.id,
      title: v.name,
      image: v.imageUrl,
      primaryImage: v.primaryImage ?? v.imageUrl,
      swatchImage: v.swatchImage ?? v.imageUrl,
      permalink: v.permalink ?? '',
      rrp: v.rrp ?? null,
      price: v.price ?? null,
      sku: v.sku ?? null,
      quantityAvailable: 0,
      colour: v.colorCode ?? null,
    };
  }

  private mapProduct(p: {
    id: string;
    name: string;
    description: string | null;
    imageUrl: string | null;
    slug: string;
    brand: string | null;
    style: string | null;
    range: string | null;
    priceGuide: string | null;
    priceSortOrder: number | null;
    service: { id: string; name: string } | null;
    variants: Array<{
      id: string;
      name: string;
      imageUrl: string | null;
      colorCode: string | null;
      swatchImage: string | null;
      primaryImage: string | null;
      permalink: string | null;
      price: number | null;
      rrp: number | null;
      sku: string | null;
    }>;
  }) {
    const variants = p.variants.map((v) => this.mapVariant(v));
    const prices = variants.map((v) => v.price ?? 0);

    return {
      id: p.id,
      title: p.name,
      description: p.description ?? '',
      descriptionHtml: p.description ?? '',
      image: p.imageUrl,
      permalink: p.slug,
      priceRange: {
        maxPrice: variants.length ? Math.max(...prices) : null,
        minPrice: variants.length ? Math.min(...prices) : null,
      },
      productType: p.service?.name ?? '',
      serviceId: p.service?.id ?? null,
      serviceName: p.service?.name ?? null,
      tags: [],
      currentVariant: variants[0] ?? null,
      variants,
      collections: [],
      range: p.range ?? null,
      brand: p.brand ?? null,
      priceGuide: p.priceGuide ?? null,
      priceSortOrder: p.priceSortOrder ?? 0,
      lifestyle: null,
      style: p.style ?? 'Plank',
      rooms: [],
    };
  }

  async create(dto: CreateProductDto) {
    const serviceId = this.normalizeString(dto.serviceId);
    const name = this.normalizeString(dto.name);
    const slug = this.normalizeString(dto.slug);
    if (!serviceId || !name || !slug) {
      throw new BadRequestException('serviceId, name và slug là bắt buộc');
    }
    await this.ensureServiceExists(serviceId);
    await this.ensureSlugUnique(slug);

    const created = await this.prisma.product.create({
      data: {
        serviceId,
        name,
        slug,
        description: this.normalizeString(dto.description),
        imageUrl: this.normalizeString(dto.imageUrl),
        brand: this.normalizeString(dto.brand),
        style: this.normalizeString(dto.style),
        range: this.normalizeString(dto.range),
        priceGuide: this.normalizeString(dto.priceGuide),
        priceSortOrder: dto.priceSortOrder,
        isActive: dto.isActive,
      },
    });

    return { message: 'Tạo product thành công', data: created };
  }

  async getAll({ serviceId, page = 1 }: GetProductsQueryDto) {
    const safePage = page > 0 ? page : 1;
    const safeLimit = 6;
    const skip = (safePage - 1) * safeLimit;
    const where = serviceId ? { serviceId } : {};

    const [products, totalItems] = await Promise.all([
      this.prisma.product.findMany({
        where,
        skip,
        take: safeLimit,
        orderBy: { createdAt: 'desc' },
        select: PRODUCT_SELECT,
      }),
      this.prisma.product.count({ where }),
    ]);
    const mapped = products.map((p) => this.mapProduct(p));

    return {
      data: {
        products: mapped,
      },
      meta: {
        items: totalItems,
        previousPage: safePage > 1 ? safePage - 1 : safePage,
        page: safePage,
        nextPage: safePage < Math.ceil(totalItems / safeLimit) ? safePage + 1 : safePage,
        totalPages: Math.ceil(totalItems / safeLimit),
        hasMoreItems: safePage < Math.ceil(totalItems / safeLimit),
      },
      status: {
        code: 200,
        message: 'Success',
        description: 'OK',
      },
    };
  }

  async getBySlug(slug: string) {
    const product = await this.prisma.product.findUnique({
      where: { slug },
      select: PRODUCT_SELECT,
    });

    if (!product) throw new NotFoundException('Product không tồn tại');
    const mapped = this.mapProduct(product);

    return {
      data: { products: [mapped] },
      status: {
        code: 200,
        message: 'Success',
        description: 'OK',
      },
    };
  }

  async update(id: string, dto: UpdateProductDto) {
    const existing = await this.prisma.product.findUnique({ where: { id }, select: { id: true } });
    if (!existing) throw new NotFoundException('Product không tồn tại');

    const payload = {
      serviceId: this.normalizeString(dto.serviceId),
      name: this.normalizeString(dto.name),
      slug: this.normalizeString(dto.slug),
      description: this.normalizeString(dto.description),
      imageUrl: this.normalizeString(dto.imageUrl),
      brand: this.normalizeString(dto.brand),
      style: this.normalizeString(dto.style),
      range: this.normalizeString(dto.range),
      priceGuide: this.normalizeString(dto.priceGuide),
      priceSortOrder: dto.priceSortOrder,
      isActive: dto.isActive,
    };

    const hasAnyField = Object.values(payload).some((v) => v !== undefined);
    if (!hasAnyField) {
      throw new BadRequestException('Không có dữ liệu để cập nhật');
    }

    if (payload.serviceId) {
      await this.ensureServiceExists(payload.serviceId);
    }
    if (payload.slug) {
      await this.ensureSlugUnique(payload.slug, id);
    }

    const updated = await this.prisma.product.update({
      where: { id },
      data: payload,
    });

    return { message: 'Cập nhật product thành công', data: updated };
  }

  async remove(id: string) {
    const existing = await this.prisma.product.findUnique({ where: { id }, select: { id: true } });
    if (!existing) throw new NotFoundException('Product không tồn tại');

    await this.prisma.product.delete({ where: { id } });
    return { message: 'Xóa product thành công' };
  }
}

