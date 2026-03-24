import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtStrategy } from './strategies/jwt.strategy';
import { PrismaService } from 'src/prisma.service';
import type { SignOptions } from 'jsonwebtoken';

const jwtSecret = process.env.JWT_SECRET;
const jwtExpiresIn = process.env.JWT_EXPIRES_IN;
if (!jwtSecret || !jwtExpiresIn) {
    throw new Error('Missing JWT_SECRET or JWT_EXPIRES_IN in .env');
}

function toJwtExpiresIn(raw: string): SignOptions['expiresIn'] {
    // Support plain seconds ("3600") or ms-style string ("7d", "12h", ...)
    if (/^\d+$/.test(raw)) return Number(raw);
    return raw as SignOptions['expiresIn'];
}

@Module({
    imports: [
        PassportModule,
        JwtModule.register({
            secret: jwtSecret,
            signOptions: { expiresIn: toJwtExpiresIn(jwtExpiresIn) },
        }),
    ],
    controllers: [AuthController],
    providers: [AuthService, JwtStrategy, PrismaService],
    exports: [AuthService],
})
export class AuthModule { }
