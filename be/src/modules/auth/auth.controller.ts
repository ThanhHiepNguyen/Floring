import { Body, Controller, Delete, Get, Param, Patch, Post, Req, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { ChangePasswordDto } from './dto/change-password.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import type { AuthenticatedRequest } from './auth.types';

@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) { }

    @UseGuards(JwtAuthGuard)
    @Post('register')
    register(@Body() registerDto: RegisterDto, @Req() req: AuthenticatedRequest) {
        return this.authService.register(registerDto, req.user);
    }

    @Post('login')
    login(@Body() loginDto: LoginDto) {
        return this.authService.login(loginDto);
    }

    @UseGuards(JwtAuthGuard)
    @Patch('change-password')
    changePassword(
        @Req() req: AuthenticatedRequest,
        @Body() changePasswordDto: ChangePasswordDto,
    ) {
        return this.authService.changePassword(req.user.id, changePasswordDto);
    }

    @UseGuards(JwtAuthGuard)
    @Get('admins')
    getAllAdmins() {
        return this.authService.getAllAdmins();
    }

    @UseGuards(JwtAuthGuard)
    @Delete('admins/:id')
    deleteAdmin(@Param('id') adminId: string, @Req() req: AuthenticatedRequest) {
        return this.authService.deleteAdmin(adminId, req.user);
    }
}
