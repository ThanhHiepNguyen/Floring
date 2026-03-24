import {
    BadRequestException,
    Controller,
    InternalServerErrorException,
    Post,
    UploadedFile,
    UseGuards,
    UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { extname, join } from 'path';
import { mkdirSync } from 'fs';
import { randomUUID } from 'crypto';


type UploadedFileType = {
    filename?: string;
    originalname?: string;
};

type DestinationCallback = (error: Error | null, destination: string) => void;
type FilenameCallback = (error: Error | null, filename: string) => void;

function toError(err: unknown) {
    return err instanceof Error
        ? err
        : new Error('Failed to create upload directory');
}

function getOriginalName(file: unknown): string {
    if (typeof file !== 'object' || file === null) return '';
    const withName = file as { originalname?: unknown };
    return typeof withName.originalname === 'string' ? withName.originalname : '';
}

@Controller('upload')
export class UploadController {
    @Post('image')
    @UseGuards(JwtAuthGuard)
    @UseInterceptors(
        FileInterceptor('file', {

            // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
            storage: diskStorage({
                destination: (_req: unknown, _file: unknown, cb: DestinationCallback) => {
                    try {
                        const uploadDir = join(process.cwd(), 'be', 'uploads');
                        mkdirSync(uploadDir, { recursive: true });
                        cb(null, uploadDir);
                    } catch (err: unknown) {
                        cb(toError(err), '');
                    }
                },
                filename: (_req: unknown, file: unknown, cb: FilenameCallback) => {
                    const safeExt = extname(getOriginalName(file)).toLowerCase() || '.bin';
                    cb(null, `${randomUUID()}${safeExt}`);
                },
            }),
            limits: {
                fileSize: 5 * 1024 * 1024,
            },
        }),
    )
    uploadImage(@UploadedFile() file: UploadedFileType) {
        if (!file) {
            throw new BadRequestException('Không có file upload');
        }


        const filename = file.filename;
        if (!filename) {
            throw new InternalServerErrorException('Upload thất bại (không có filename)');
        }

        return {
            url: `/uploads/${filename}`,
        };
    }

    @Post('contact-request-image')
    @UseInterceptors(
        FileInterceptor('file', {
            // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
            storage: diskStorage({
                destination: (_req: unknown, _file: unknown, cb: DestinationCallback) => {
                    try {
                        const uploadDir = join(process.cwd(), 'be', 'uploads');
                        mkdirSync(uploadDir, { recursive: true });
                        cb(null, uploadDir);
                    } catch (err: unknown) {
                        cb(toError(err), '');
                    }
                },
                filename: (_req: unknown, file: unknown, cb: FilenameCallback) => {
                    const safeExt = extname(getOriginalName(file)).toLowerCase() || '.bin';
                    cb(null, `${randomUUID()}${safeExt}`);
                },
            }),
            limits: {
                fileSize: 5 * 1024 * 1024,
            },
        }),
    )
    uploadContactRequestImage(@UploadedFile() file: UploadedFileType) {
        if (!file) {
            throw new BadRequestException('Không có file upload');
        }

        const filename = file.filename;
        if (!filename) {
            throw new InternalServerErrorException('Upload thất bại (không có filename)');
        }

        return {
            url: `/uploads/${filename}`,
        };
    }
}

