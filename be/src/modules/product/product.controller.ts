import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { ProductService } from './product.service';
import { GetProductsQueryDto } from './dto/get-products-query.dto';
import { ProductSlugParamDto } from './dto/product-slug-param.dto';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('product')
export class ProductController {
  constructor(private readonly service: ProductService) { }

  @Get()
  getAll(@Query() query: GetProductsQueryDto) {
    return this.service.getAll(query);
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  create(@Body() dto: CreateProductDto) {
    return this.service.create(dto);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateProductDto) {
    return this.service.update(id, dto);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.service.remove(id);
  }

  @Get('by-slug/:slug')
  getBySlug(@Param() { slug }: ProductSlugParamDto) {
    return this.service.getBySlug(slug);
  }
}

