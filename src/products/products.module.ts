import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductsService } from './products.service';
import { ProductsController } from './products.controller';
import { Product } from './products.entity'; // 👈 Entidad del Product
import { Category } from '../categories/category.entity'; // 👈 Entidad de Category

@Module({
  imports: [
    TypeOrmModule.forFeature([Product, Category]), // 👈 REGISTRAR las dos entidades que necesitas
  ],
  controllers: [ProductsController],
  providers: [ProductsService],
})
export class ProductsModule {}
