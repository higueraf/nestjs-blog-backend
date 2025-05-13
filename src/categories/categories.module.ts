import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CategoriesService } from './categories.service';
import { CategoriesController } from './categories.controller';
import { Category } from './category.entity'; // Asegúrate que la entidad esté bien importada

@Module({
  imports: [
    TypeOrmModule.forFeature([Category]), // 👈 IMPORTANTE: aquí se registra la entidad
  ],
  controllers: [CategoriesController],
  providers: [CategoriesService],
})
export class CategoriesModule {}
