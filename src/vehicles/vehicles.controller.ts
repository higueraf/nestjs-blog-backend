import {
  Controller, Get, Post, Put, Delete,
  Param, Body, Query, NotFoundException, InternalServerErrorException, BadRequestException
} from '@nestjs/common';
import { VehiclesService } from './vehicles.service';
import { CreateVehicleDto } from './dto/create-vehicle.dto';
import { UpdateVehicleDto } from './dto/update-vehicle.dto';
import { Pagination } from 'nestjs-typeorm-paginate';
import { Vehicle } from './vehicle.entity';
import { SuccessResponseDto } from '../common/dto/response.dto';

@Controller('vehicles')
export class VehiclesController {
  constructor(private readonly vehiclesService: VehiclesService) {}

  @Post()
  async create(@Body() dto: CreateVehicleDto) {
    const vehicle = await this.vehiclesService.create(dto);
    if (!vehicle) throw new BadRequestException('Failed to create vehicle. Brand might not exist.');
    return new SuccessResponseDto('Vehicle created successfully', vehicle);
  }

  @Get()
  async findAll(
    @Query('page') page = 1,
    @Query('limit') limit = 10,
  ): Promise<SuccessResponseDto<Pagination<Vehicle>>> {
    const result = await this.vehiclesService.findAll({ page, limit });

    if (!result) throw new InternalServerErrorException('Could not retrieve vehicles');

    return new SuccessResponseDto('Vehicles retrieved successfully', result);
  }

  @Get('brand/:brandId')
  async findByBrand(
    @Param('brandId') brandId: string,
    @Query('page') page = 1,
    @Query('limit') limit = 10,
  ): Promise<SuccessResponseDto<Pagination<Vehicle>>> {
    const result = await this.vehiclesService.findByBrand(brandId, { page, limit });

    if (!result) throw new InternalServerErrorException('Could not retrieve vehicles by brand');

    return new SuccessResponseDto('Vehicles retrieved successfully', result);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const vehicle = await this.vehiclesService.findOne(id);
    if (!vehicle) throw new NotFoundException('Vehicle not found');
    return new SuccessResponseDto('Vehicle retrieved successfully', vehicle);
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() dto: UpdateVehicleDto) {
    const vehicle = await this.vehiclesService.update(id, dto);
    if (!vehicle) throw new NotFoundException('Vehicle not found or brand does not exist');
    return new SuccessResponseDto('Vehicle updated successfully', vehicle);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    const vehicle = await this.vehiclesService.remove(id);
    if (!vehicle) throw new NotFoundException('Vehicle not found');
    return new SuccessResponseDto('Vehicle deleted successfully', vehicle);
  }
}