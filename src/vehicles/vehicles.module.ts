import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { VehiclesService } from './vehicles.service';
import { VehiclesController } from './vehicles.controller';
import { Vehicle } from './vehicle.entity';
import { Brand } from '../brands/brand.entity'; // Importamos Brand para validaciones

@Module({
  imports: [
    TypeOrmModule.forFeature([Vehicle, Brand]), // 👈 IMPORTANTE: registramos ambas entidades
  ],
  controllers: [VehiclesController],
  providers: [VehiclesService],
})
export class VehiclesModule {}