import { Type } from 'class-transformer';
import {
    IsArray,
    IsBoolean,
    IsNumber,
    IsOptional,
    IsString,
    IsUrl,
    Min,
    ValidateNested,
} from 'class-validator';

class ProjectImageInput {
    @IsUrl({}, { message: 'URL ảnh không hợp lệ' })
    @IsString()
    imageUrl!: string;

    @IsString()
    @IsOptional()
    caption?: string;
}

export class UpdateProjectDto {
    @IsString()
    @IsOptional()
    title?: string;

    @IsString()
    @IsOptional()
    slug?: string;

    @IsString()
    @IsOptional()
    serviceId?: string;

    @IsString()
    @IsOptional()
    description?: string;

    @IsString()
    @IsOptional()
    roomDetails?: string;

    @IsNumber()
    @IsOptional()
    @Min(0, { message: 'totalAreaM2 phải lớn hơn hoặc bằng 0' })
    totalAreaM2?: number;

    @IsBoolean()
    @IsOptional()
    isActive?: boolean;

    @IsArray()
    @IsOptional()
    @ValidateNested({ each: true })
    @Type(() => ProjectImageInput)
    images?: ProjectImageInput[];
}
