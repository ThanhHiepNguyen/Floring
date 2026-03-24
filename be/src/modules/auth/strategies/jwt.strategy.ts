import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import type { JwtPayload, JwtUser } from '../auth.types';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(private readonly prisma: PrismaService) {
        const jwtSecret = process.env.JWT_SECRET;
        if (!jwtSecret) {
            throw new Error('Missing JWT_SECRET in .env');
        }
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: jwtSecret,
        });
    }

    async validate(payload: JwtPayload): Promise<JwtUser> {
        const admin = await this.prisma.admin.findUnique({
            where: { id: payload.id },
            select: { id: true, email: true, role: true, isActive: true },
        });

        if (!admin || !admin.isActive) {
            throw new UnauthorizedException('Phiên đăng nhập không hợp lệ');
        }

        return { id: admin.id, email: admin.email, role: admin.role };
    }
}
