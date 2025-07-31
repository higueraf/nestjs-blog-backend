import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { paginate, IPaginationOptions, Pagination } from 'nestjs-typeorm-paginate';
import { Brand } from './brand.entity';
import { CreateBrandDto } from './dto/create-brand.dto';
import { UpdateBrandDto } from './dto/update-brand.dto';

@Injectable()
export class BrandsService {
  constructor(
    @InjectRepository(Brand)
    private readonly brandRepo: Repository<Brand>,
  ) {}

  async create(dto: CreateBrandDto): Promise<Brand | null> {
    try {
      const brand = this.brandRepo.create(dto);
      return await this.brandRepo.save(brand);
    } catch (err) {
      console.error('Error creating brand:', err);
      return null;
    }
  }

  async findAll(options: IPaginationOptions): Promise<Pagination<Brand> | null> {
    try {
      const query = this.brandRepo.createQueryBuilder('brand');
      return await paginate<Brand>(query, options);
    } catch (err) {
      console.error('Error retrieving brands:', err);
      return null;
    }
  }

  async findOne(id: string): Promise<Brand | null> {
    try {
      return await this.brandRepo.findOne({ where: { id } });
    } catch (err) {
      console.error('Error finding brand:', err);
      return null;
    }
  }

  async update(id: string, dto: UpdateBrandDto): Promise<Brand | null> {
    try {
      const brand = await this.findOne(id);
      if (!brand) return null;

      Object.assign(brand, dto);
      return await this.brandRepo.save(brand);
    } catch (err) {
      console.error('Error updating brand:', err);
      return null;
    }
  }

  async remove(id: string): Promise<Brand | null> {
    try {
      const brand = await this.findOne(id);
      if (!brand) return null;

      return await this.brandRepo.remove(brand);
    } catch (err) {
      console.error('Error deleting brand:', err);
      return null;
    }
  }
}