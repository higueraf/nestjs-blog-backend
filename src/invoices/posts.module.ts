import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PostsService } from './posts.service';
import { PostsController } from './posts.controller';
import { Post } from './post.entity'; // 👈 Entidad del Post
import { Category } from '../categories/category.entity'; // 👈 Entidad de Category

@Module({
  imports: [
    TypeOrmModule.forFeature([Post, Category]), // 👈 REGISTRAR las dos entidades que necesitas
  ],
  controllers: [PostsController],
  providers: [PostsService],
})
export class PostsModule {}
