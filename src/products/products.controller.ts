import {
  Controller,
  Post,
  Get,
  Param,
  Delete,
  Body,
  Query,
  NotFoundException,
  InternalServerErrorException,
  Put,
} from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { Product as ProductEntity } from './products.entity';
import { Pagination } from 'nestjs-typeorm-paginate';
import { SuccessResponseDto } from 'src/common/dto/response.dto';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService,) { }

  @Post()
  async create(@Body() createProductDto: CreateProductDto): Promise<SuccessResponseDto<ProductEntity>> {
    const post = await this.productsService.create(createProductDto);
    if (!post) throw new NotFoundException('Category not found or error creating post');
    return new SuccessResponseDto('Product created successfully', post);
  }

  @Get()
  async findAll(
    @Query('page') page = 1,
    @Query('limit') limit = 10,
  ): Promise<SuccessResponseDto<Pagination<ProductEntity>>> {
    limit = limit > 100 ? 100 : limit;
    const result = await this.productsService.findAll({ page, limit });

    if (!result) throw new InternalServerErrorException('Could not retrieve products');

    return new SuccessResponseDto('Products retrieved successfully', result);
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<SuccessResponseDto<ProductEntity>> {
    const post = await this.productsService.findOne(id);
    if (!post) throw new NotFoundException('Product not found');
    return new SuccessResponseDto('Product retrieved successfully', post);
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() updateProductDto: CreateProductDto
  ): Promise<SuccessResponseDto<ProductEntity>> {
    const updated = await this.productsService.update(id, updateProductDto);
    if (!updated) throw new NotFoundException('Product not found or category not valid');
    return new SuccessResponseDto('Product updated successfully', updated);
  }

  @Delete(':id')
  async remove(@Param('id') id: string): Promise<SuccessResponseDto<string>> {
    const deleted = await this.productsService.remove(id);
    if (!deleted) throw new NotFoundException('Product not found or could not be deleted');
    return new SuccessResponseDto('Product deleted successfully', id);
  }
}
