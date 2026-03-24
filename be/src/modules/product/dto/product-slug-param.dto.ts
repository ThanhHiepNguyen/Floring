import { IsNotEmpty, IsString } from 'class-validator';

export class ProductSlugParamDto {
  @IsString()
  @IsNotEmpty()
  slug!: string;
}

