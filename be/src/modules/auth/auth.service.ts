import { ConflictException, ForbiddenException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from 'src/prisma.service';
import * as bcrypt from 'bcrypt';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { ChangePasswordDto } from './dto/change-password.dto';
import type { JwtUser, UserRole } from './auth.types';

const DATA = {
    id: true,
    email: true,
    role: true,
    createdAt: true,
} as const;

@Injectable()
export class AuthService {
    constructor(
        private prisma: PrismaService,
        private jwtService: JwtService,
    ) { }

    private normalizeEmail(email: string) {
        return email.trim().toLowerCase();
    }

    private normalizeRole(role: string | null | undefined): UserRole {
        return role === 'staff' ? 'staff' : 'admin';
    }

    async register(data: RegisterDto, requester?: JwtUser) {
        const email = this.normalizeEmail(data.email);
        if (!requester) {
            throw new UnauthorizedException('Bạn cần đăng nhập để tạo tài khoản admin');
        }

        const existing = await this.prisma.admin.findUnique({
            where: { email },
        });

        if (existing) {
            throw new ConflictException('Email đã được đăng ký');
        }

        const hashedPassword = await bcrypt.hash(data.password, 10);

        const admin = await this.prisma.admin.create({
            data: {
                email,
                password: hashedPassword,
                role: 'staff',
            },
            select: DATA,
        });

        return {
            message: 'Đăng ký admin thành công',
            data: admin,
        };
    }

    async login(data: LoginDto) {
        const email = this.normalizeEmail(data.email);
        const admin = await this.prisma.admin.findUnique({
            where: { email },
        });

        if (!admin || !admin.isActive) {
            throw new UnauthorizedException('Email hoặc mật khẩu không đúng');
        }

        const isPasswordValid = await bcrypt.compare(data.password, admin.password);

        if (!isPasswordValid) {
            throw new UnauthorizedException('Email hoặc mật khẩu không đúng');
        }

        const payload: JwtUser = { id: admin.id, email: admin.email, role: this.normalizeRole(admin.role) };
        const accessToken = this.jwtService.sign(payload);

        return {
            message: 'Đăng nhập thành công',
            data: {
                accessToken,
                admin: {
                    id: admin.id,
                    email: admin.email,
                    role: admin.role,
                },
            },
        };
    }

    async changePassword(userId: string, data: ChangePasswordDto) {
        const admin = await this.prisma.admin.findUnique({
            where: { id: userId },
        });

        if (!admin) {
            throw new UnauthorizedException('Admin không tồn tại');
        }

        const isOldPasswordValid = await bcrypt.compare(data.oldPassword, admin.password);

        if (!isOldPasswordValid) {
            throw new UnauthorizedException('Mật khẩu cũ không đúng');
        }

        if (data.oldPassword === data.newPassword) {
            throw new ConflictException('Mật khẩu mới phải khác mật khẩu cũ');
        }

        const hashedNewPassword = await bcrypt.hash(data.newPassword, 10);

        await this.prisma.admin.update({
            where: { id: userId },
            data: { password: hashedNewPassword },
        });

        return { message: 'Đổi mật khẩu thành công' };
    }

    async getAllAdmins() {
        const admins = await this.prisma.admin.findMany({
            select: DATA,
            orderBy: { createdAt: 'desc' },
        });

        return { data: admins };
    }

    async deleteAdmin(adminId: string, requester: JwtUser) {
        if (adminId === requester.id) {
            throw new ConflictException('Không thể xóa chính mình');
        }

        const admin = await this.prisma.admin.findUnique({
            where: { id: adminId },
            select: { id: true, role: true },
        });

        if (!admin) {
            throw new NotFoundException('Admin không tồn tại');
        }

        if (requester.role !== 'admin') {
            throw new ForbiddenException('Chỉ admin mới có quyền xóa tài khoản');
        }

        if (admin.role === 'admin') {
            throw new ForbiddenException('Admin không thể xóa tài khoản admin khác');
        }

        await this.prisma.admin.delete({ where: { id: adminId } });
        return { message: 'Xóa admin thành công' };
    }
}
