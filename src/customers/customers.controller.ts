import {
  Controller, Get, Post, Put, Delete, Body, Param,
  Query, BadRequestException, NotFoundException,
  UseInterceptors, UploadedFile,
  InternalServerErrorException
} from '@nestjs/common';
import { CustomersService } from './customers.service';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { UpdateCustomerDto } from './dto/update-customer.dto';
import { SuccessResponseDto } from 'src/common/dto/response.dto';
import { Pagination } from 'nestjs-typeorm-paginate';
import { Customer } from './customer.entity';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';

@Controller('users')
export class CustomersController {
  constructor(private readonly usersService: CustomersService) { }

  @Post()
  async create(@Body() dto: CreateCustomerDto) {
    const user = await this.usersService.create(dto);
    return new SuccessResponseDto('Customer created successfully', user);
  }

  @Get()
  async findAll(
    @Query('page') page = 1,
    @Query('limit') limit = 10,
    @Query('isActive') isActive?: string,
  ): Promise<SuccessResponseDto<Pagination<Customer>>> {
    if (isActive !== undefined && isActive !== 'true' && isActive !== 'false') {
      throw new BadRequestException('Invalid value for "isActive". Use "true" or "false".');
    }
    const result = await this.usersService.findAll({ page, limit }, isActive === 'true');
    if (!result) throw new InternalServerErrorException('Could not retrieve users');

    return new SuccessResponseDto('Customers retrieved successfully', result);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const user = await this.usersService.findOne(id);
    if (!user) throw new NotFoundException('Customer not found');
    return new SuccessResponseDto('Customer retrieved successfully', user);
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() dto: UpdateCustomerDto) {
    const user = await this.usersService.update(id, dto);
    if (!user) throw new NotFoundException('Customer not found');
    return new SuccessResponseDto('Customer updated successfully', user);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    const user = await this.usersService.remove(id);
    if (!user) throw new NotFoundException('Customer not found');
    return new SuccessResponseDto('Customer deleted successfully', user);
  }


}
