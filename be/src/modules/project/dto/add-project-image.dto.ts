import { IsNotEmpty, IsUrl } from 'class-validator';
import { IsOptional, IsString } from 'class-validator';

export class AddProjectImageDto {
    @IsUrl({}, { message: 'URL ảnh không hợp lệ' })
    @IsNotEmpty({ message: 'URL ảnh không được để trống' })
    imageUrl!: string;

    @IsOptional()
    @IsString()
    @IsNotEmpty({ message: 'caption không được để trống' })
    caption?: string;
}
