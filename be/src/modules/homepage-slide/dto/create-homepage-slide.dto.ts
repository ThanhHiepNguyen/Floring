import { IsBoolean, IsInt, IsNotEmpty, IsOptional, IsString, IsUrl } from 'class-validator';

export class CreateHomepageSlideDto {
  @IsString()
  @IsNotEmpty({ message: 'Tiêu đề không được để trống' })
  title!: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsUrl({}, { message: 'imageUrl không hợp lệ' })
  @IsNotEmpty({ message: 'imageUrl không được để trống' })
  imageUrl!: string;

  @IsString()
  @IsOptional()
  ctaLabel?: string;

  @IsString()
  @IsOptional()
  ctaHref?: string;

  @IsInt()
  @IsOptional()
  sortOrder?: number;

  @IsBoolean()
  @IsOptional()
  isActive?: boolean;
}

