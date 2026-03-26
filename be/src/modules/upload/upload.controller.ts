import {
    BadRequestException,
    Controller,
    Post,
    UploadedFile,
    UseGuards,
    UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { memoryStorage } from 'multer';
import { v2 as cloudinary } from 'cloudinary';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';


type UploadedFileType = {
    originalname?: string;
    buffer?: Buffer;
};

function mustGetEnv(key: string): string {
    const v = process.env[key];
    if (!v) throw new Error(`Missing env var: ${key}`);
    return v.trim();
}

async function uploadBufferToCloudinary(buffer: Buffer, folder: string): Promise<string> {
    const cloudName = mustGetEnv('CLOUDINARY_CLOUD_NAME');
    const apiKey = mustGetEnv('CLOUDINARY_API_KEY');
    const apiSecret = mustGetEnv('CLOUDINARY_API_SECRET');

    cloudinary.config({
        cloud_name: cloudName,
        api_key: apiKey,
        api_secret: apiSecret,
    });

    const result = await new Promise<{ secure_url?: string }>((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
            {
                folder,
                resource_type: 'image',
            },
            (error, res) => {
                if (error) reject(error);
                else resolve(res as { secure_url?: string });
            },
        );

        stream.end(buffer);
    });

    if (!result.secure_url) throw new Error('Cloudinary upload failed (missing secure_url)');
    return result.secure_url;
}

@Controller('upload')
export class UploadController {
    @Post('image')
    @UseGuards(JwtAuthGuard)
    @UseInterceptors(
        FileInterceptor('file', {

            storage: memoryStorage(),
            limits: {
                fileSize: 5 * 1024 * 1024,
            },
        }),
    )
    uploadImage(@UploadedFile() file: UploadedFileType) {
        if (!file) {
            throw new BadRequestException('Không có file upload');
        }

        if (!file.buffer) {
            throw new BadRequestException('Không có buffer file upload');
        }

        return {
            url: uploadBufferToCloudinary(file.buffer, 'floring/uploads'),
        };
    }

    @Post('contact-request-image')
    @UseInterceptors(
        FileInterceptor('file', {
            storage: memoryStorage(),
            limits: {
                fileSize: 5 * 1024 * 1024,
            },
        }),
    )
    uploadContactRequestImage(@UploadedFile() file: UploadedFileType) {
        if (!file) {
            throw new BadRequestException('Không có file upload');
        }

        if (!file.buffer) {
            throw new BadRequestException('Không có buffer file upload');
        }

        return {
            url: uploadBufferToCloudinary(file.buffer, 'floring/contact-requests'),
        };
    }
}

