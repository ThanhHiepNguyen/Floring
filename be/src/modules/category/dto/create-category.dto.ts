import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateCategoryDto {
  @IsString()
  @IsNotEmpty({ message: 'Tên danh mục không được để trống' })
  name!: string;

  @IsOptional()
  @IsString()
  slug?: string;

  @IsString()
  @IsOptional()
  description?: string;
}
