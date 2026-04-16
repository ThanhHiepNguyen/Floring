import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { generateUniqueSlug } from 'src/common/slug';

@Injectable()
export class ProjectService {
    constructor(private prisma: PrismaService) { }

    private existsProjectBySlug = async (slug: string) => {
        const existing = await this.prisma.project.findUnique({
            where: { slug },
            select: { id: true },
        });
        return existing?.id ?? null;
    };

    async createProject(data: CreateProjectDto) {
        const slug = await generateUniqueSlug(
            data.slug?.trim() || data.title,
            this.existsProjectBySlug,
        );

        const project = await this.prisma.project.create({
            data: {
                title: data.title,
                slug,
                serviceId: data.serviceId,
                description: data.description,
                roomDetails: data.roomDetails,
                totalAreaM2: data.totalAreaM2,
                ...(data.isActive !== undefined && { isActive: data.isActive }),
                images: data.images
                    ? {
                        create: data.images.map((img) => ({
                            imageUrl: img.imageUrl,
                            ...(img.caption !== undefined && { caption: img.caption }),
                        })),
                    }
                    : undefined,
            },
            include: {
                images: true,
            },
        });

        return {
            message: 'Tạo dự án thành công',
            data: project,
        };
    }

    async getAllProjects(page = 1, limit = 6) {
        const safePage = page > 0 ? page : 1;
        const safeLimit = limit > 0 ? limit : 6;
        const skip = (safePage - 1) * safeLimit;

        const [data, totalItems] = await Promise.all([
            this.prisma.project.findMany({
                where: { isActive: true },
                skip,
                take: safeLimit,
                orderBy: { createdAt: 'desc' },
                select: {
                    id: true,
                    title: true,
                    slug: true,
                    description: true,
                    totalAreaM2: true,
                    createdAt: true,
                    images: {
                        select: {
                            id: true,
                            imageUrl: true,
                        },
                    },
                },
            }),
            this.prisma.project.count({ where: { isActive: true } }),
        ]);

        return {
            data,
            totalItems,
            totalPages: Math.ceil(totalItems / safeLimit),
            page: safePage,
            limit: safeLimit,
        };
    }

    async getProjectBySlug(slug: string) {
        const project = await this.prisma.project.findUnique({
            where: { slug },
            select: {
                id: true,
                title: true,
                slug: true,
                description: true,
                totalAreaM2: true,
                createdAt: true,
                isActive: true,
                images: {
                    select: {
                        id: true,
                        imageUrl: true,
                    },
                },
            },
        });

        if (!project || !project.isActive) {
            throw new NotFoundException('Dự án không tồn tại');
        }

        const { isActive: _isActive, ...output } = project;
        return output;
    }

    async updateProject(id: string, data: UpdateProjectDto) {
        const existing = await this.prisma.project.findUnique({
            where: { id },
            select: { id: true, title: true, slug: true },
        });

        if (!existing) {
            throw new NotFoundException('Dự án không tồn tại');
        }

        let newSlug: string | undefined;
        if (data.slug?.trim()) {
            newSlug = await generateUniqueSlug(
                data.slug,
                this.existsProjectBySlug,
                id,
            );
        } else if (data.title?.trim() && data.title !== existing.title) {
            newSlug = await generateUniqueSlug(
                data.title,
                this.existsProjectBySlug,
                id,
            );
        }

        const updated = await this.prisma.project.update({
            where: { id },
            data: {
                ...(data.title !== undefined && { title: data.title }),
                ...(newSlug !== undefined && { slug: newSlug }),
                ...(data.serviceId !== undefined && { serviceId: data.serviceId }),
                ...(data.description !== undefined && { description: data.description }),
                ...(data.roomDetails !== undefined && { roomDetails: data.roomDetails }),
                ...(data.totalAreaM2 !== undefined && { totalAreaM2: data.totalAreaM2 }),
                ...(data.isActive !== undefined && { isActive: data.isActive }),
                ...(data.images?.length
                    ? {
                        images: {
                            create: data.images.map((img) => ({
                                imageUrl: img.imageUrl,
                                ...(img.caption !== undefined && { caption: img.caption }),
                            })),
                        },
                    }
                    : {}),
            },
            include: {
                images: true,
            },
        });

        return {
            message: 'Cập nhật dự án thành công',
            data: updated,
        };
    }

    async deleteProject(id: string) {
        const existing = await this.prisma.project.findUnique({
            where: { id },
            select: { id: true },
        });

        if (!existing) {
            throw new NotFoundException('Dự án không tồn tại');
        }

        await this.prisma.project.delete({ where: { id } });
        return { message: 'Xóa dự án thành công' };
    }

    async addProjectImage(projectId: string, imageUrl: string, caption?: string) {
        const project = await this.prisma.project.findUnique({
            where: { id: projectId },
            select: { id: true },
        });

        if (!project) {
            throw new NotFoundException('Dự án không tồn tại');
        }

        const image = await this.prisma.projectImage.create({
            data: {
                imageUrl,
                ...(caption !== undefined && { caption }),
                projectId,
            },
        });

        return { message: 'Thêm ảnh thành công', data: image };
    }

    async deleteProjectImage(imageId: string) {
        const image = await this.prisma.projectImage.findUnique({
            where: { id: imageId },
            select: { id: true },
        });

        if (!image) {
            throw new NotFoundException('Ảnh không tồn tại');
        }

        await this.prisma.projectImage.delete({ where: { id: imageId } });
        return { message: 'Xóa ảnh thành công' };
    }
}
