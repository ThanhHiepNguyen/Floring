import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { CreateBlogPostDto } from './dto/create-blog-post.dto';
import { UpdateBlogPostDto } from './dto/update-blog-post.dto';

@Injectable()
export class BlogService {
  constructor(private prisma: PrismaService) { }

  async getPublicPosts(page = 1, limit = 6) {
    const safePage = page > 0 ? page : 1;
    const safeLimit = limit > 0 ? limit : 6;
    const skip = (safePage - 1) * safeLimit;

    const where = { isActive: true };

    const [data, totalItems] = await Promise.all([
      this.prisma.blogPost.findMany({
        where,
        skip,
        take: safeLimit,
        orderBy: { createdAt: 'desc' },
        select: {
          id: true,
          slug: true,
          title: true,
          excerpt: true,
          content: true,
          imageUrl: true,
          createdAt: true,
        },
      }),
      this.prisma.blogPost.count({ where }),
    ]);

    return {
      data,
      totalItems,
      totalPages: Math.ceil(totalItems / safeLimit),
      page: safePage,
      limit: safeLimit,
    };
  }

  async getPublicPostBySlug(slug: string) {
    const post = await this.prisma.blogPost.findUnique({
      where: { slug },
      select: {
        id: true,
        slug: true,
        title: true,
        excerpt: true,
        content: true,
        imageUrl: true,
        isActive: true,
        createdAt: true,
      },
    });

    if (!post || !post.isActive) throw new NotFoundException('Bài viết không tồn tại');
    const { isActive: _isActive, ...output } = post;
    return output;
  }

  async getAllAdmin() {
    return this.prisma.blogPost.findMany({
      orderBy: { createdAt: 'desc' },
    });
  }

  async create(dto: CreateBlogPostDto) {
    const exists = await this.prisma.blogPost.findUnique({
      where: { slug: dto.slug },
      select: { id: true },
    });

    if (exists) throw new ConflictException('Slug đã tồn tại');

    return this.prisma.blogPost.create({
      data: {
        title: dto.title,
        slug: dto.slug,
        excerpt: dto.excerpt,
        content: dto.content,
        imageUrl: dto.imageUrl,
        ...(dto.isActive !== undefined && { isActive: dto.isActive }),
      },
    });
  }

  async update(id: string, dto: UpdateBlogPostDto) {
    const existing = await this.prisma.blogPost.findUnique({
      where: { id },
      select: { id: true, slug: true },
    });

    if (!existing) throw new NotFoundException('Bài viết không tồn tại');

    if (dto.slug && dto.slug !== existing.slug) {
      const slugExists = await this.prisma.blogPost.findUnique({
        where: { slug: dto.slug },
        select: { id: true },
      });
      if (slugExists) throw new ConflictException('Slug đã tồn tại');
    }

    return this.prisma.blogPost.update({
      where: { id },
      data: {
        ...(dto.title !== undefined && { title: dto.title }),
        ...(dto.slug !== undefined && { slug: dto.slug }),
        ...(dto.excerpt !== undefined && { excerpt: dto.excerpt }),
        ...(dto.content !== undefined && { content: dto.content }),
        ...(dto.imageUrl !== undefined && { imageUrl: dto.imageUrl }),
        ...(dto.isActive !== undefined && { isActive: dto.isActive }),
      },
    });
  }

  async delete(id: string) {
    const existing = await this.prisma.blogPost.findUnique({
      where: { id },
      select: { id: true },
    });

    if (!existing) throw new NotFoundException('Bài viết không tồn tại');

    await this.prisma.blogPost.delete({ where: { id } });
    return { message: 'Xóa bài viết thành công' };
  }
}

