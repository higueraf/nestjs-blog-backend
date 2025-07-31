import {
  Controller, Get, Post, Put, Delete,
  Param, Body, Query, NotFoundException, InternalServerErrorException
} from '@nestjs/common';
import { BrandsService } from './brands.service';
import { CreateBrandDto } from './dto/create-brand.dto';
import { UpdateBrandDto } from './dto/update-brand.dto';
import { Pagination } from 'nestjs-typeorm-paginate';
import { Brand } from './brand.entity';
import { SuccessResponseDto } from '../common/dto/response.dto';

@Controller('brands')
export class BrandsController {
  constructor(private readonly brandsService: BrandsService) {}

  @Post()
  async create(@Body() dto: CreateBrandDto) {
    const brand = await this.brandsService.create(dto);
    if (!brand) throw new InternalServerErrorException('Failed to create brand');
    return new SuccessResponseDto('Brand created successfully', brand);
  }

  @Get()
  async findAll(
    @Query('page') page = 1,
    @Query('limit') limit = 10,
  ): Promise<SuccessResponseDto<Pagination<Brand>>> {
    const result = await this.brandsService.findAll({ page, limit });

    if (!result) throw new InternalServerErrorException('Could not retrieve brands');

    return new SuccessResponseDto('Brands retrieved successfully', result);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const brand = await this.brandsService.findOne(id);
    if (!brand) throw new NotFoundException('Brand not found');
    return new SuccessResponseDto('Brand retrieved successfully', brand);
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() dto: UpdateBrandDto) {
    const brand = await this.brandsService.update(id, dto);
    if (!brand) throw new NotFoundException('Brand not found');
    return new SuccessResponseDto('Brand updated successfully', brand);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    const brand = await this.brandsService.remove(id);
    if (!brand) throw new NotFoundException('Brand not found');
    return new SuccessResponseDto('Brand deleted successfully', brand);
  }
}