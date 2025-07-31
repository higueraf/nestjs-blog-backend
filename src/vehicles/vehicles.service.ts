import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { paginate, IPaginationOptions, Pagination } from 'nestjs-typeorm-paginate';
import { Vehicle } from './vehicle.entity';
import { Brand } from '../brands/brand.entity';
import { CreateVehicleDto } from './dto/create-vehicle.dto';
import { UpdateVehicleDto } from './dto/update-vehicle.dto';

@Injectable()
export class VehiclesService {
  constructor(
    @InjectRepository(Vehicle)
    private readonly vehicleRepo: Repository<Vehicle>,
    @InjectRepository(Brand)
    private readonly brandRepo: Repository<Brand>,
  ) {}

  async create(dto: CreateVehicleDto): Promise<Vehicle | null> {
    try {
      // Verificar que la marca existe
      const brand = await this.brandRepo.findOne({ where: { id: dto.brandId } });
      if (!brand) return null;

      const vehicle = this.vehicleRepo.create(dto);
      return await this.vehicleRepo.save(vehicle);
    } catch (err) {
      console.error('Error creating vehicle:', err);
      return null;
    }
  }

  async findAll(options: IPaginationOptions): Promise<Pagination<Vehicle> | null> {
    try {
      const query = this.vehicleRepo.createQueryBuilder('vehicle')
        .leftJoinAndSelect('vehicle.brand', 'brand');
      return await paginate<Vehicle>(query, options);
    } catch (err) {
      console.error('Error retrieving vehicles:', err);
      return null;
    }
  }

  async findOne(id: string): Promise<Vehicle | null> {
    try {
      return await this.vehicleRepo.findOne({ 
        where: { id },
        relations: ['brand']
      });
    } catch (err) {
      console.error('Error finding vehicle:', err);
      return null;
    }
  }

  async update(id: string, dto: UpdateVehicleDto): Promise<Vehicle | null> {
    try {
      const vehicle = await this.findOne(id);
      if (!vehicle) return null;

      // Si se está actualizando la marca, verificar que existe
      if (dto.brandId) {
        const brand = await this.brandRepo.findOne({ where: { id: dto.brandId } });
        if (!brand) return null;
      }

      Object.assign(vehicle, dto);
      return await this.vehicleRepo.save(vehicle);
    } catch (err) {
      console.error('Error updating vehicle:', err);
      return null;
    }
  }

  async remove(id: string): Promise<Vehicle | null> {
    try {
      const vehicle = await this.findOne(id);
      if (!vehicle) return null;

      return await this.vehicleRepo.remove(vehicle);
    } catch (err) {
      console.error('Error deleting vehicle:', err);
      return null;
    }
  }

  async findByBrand(brandId: string, options: IPaginationOptions): Promise<Pagination<Vehicle> | null> {
    try {
      const query = this.vehicleRepo.createQueryBuilder('vehicle')
        .leftJoinAndSelect('vehicle.brand', 'brand')
        .where('vehicle.brandId = :brandId', { brandId });
      return await paginate<Vehicle>(query, options);
    } catch (err) {
      console.error('Error retrieving vehicles by brand:', err);
      return null;
    }
  }
}