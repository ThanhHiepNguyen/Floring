import { Type } from 'class-transformer';
import {
    IsArray,
    IsBoolean,
    IsNotEmpty,
    IsNumber,
    IsOptional,
    IsString,
    IsUrl,
    Min,
    ValidateNested,
} from 'class-validator';

class ProjectImageInput {
    @IsUrl({}, { message: 'URL ảnh không hợp lệ' })
    @IsNotEmpty()
    imageUrl!: string;

    @IsString()
    @IsOptional()
    caption?: string;
}

export class CreateProjectDto {
    @IsString()
    @IsNotEmpty({ message: 'Tiêu đề không được để trống' })
    title!: string;

    @IsString()
    @IsOptional()
    slug?: string;

    @IsString()
    @IsNotEmpty({ message: 'serviceId không được để trống' })
    serviceId!: string;

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
