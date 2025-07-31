import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BrandsService } from './brands.service';
import { BrandsController } from './brands.controller';
import { Brand } from './brand.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Brand]), // 👈 IMPORTANTE: aquí se registra la entidad
  ],
  controllers: [BrandsController],
  providers: [BrandsService],
})
export class BrandsModule {}