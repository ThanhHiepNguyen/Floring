import { IsBoolean, IsNotEmpty, IsOptional, IsString, IsUrl } from 'class-validator';

export class CreateBlogPostDto {
    @IsString()
    @IsNotEmpty()
    title!: string;

    @IsString()
    @IsNotEmpty()
    slug!: string;

    @IsOptional()
    @IsString()
    excerpt?: string;

    @IsString()
    @IsNotEmpty()
    content!: string;

    @IsUrl({}, { message: 'URL ảnh không hợp lệ' })
    @IsOptional()
    imageUrl?: string;

    @IsOptional()
    @IsBoolean()
    isActive?: boolean;
}

