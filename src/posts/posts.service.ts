import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Post } from './post.entity';
import { CreatePostDto } from './dto/create-post.dto';
import { Category } from '../categories/category.entity';

@Injectable()
export class PostsService {
  constructor(
    @InjectRepository(Post)
    private postsRepository: Repository<Post>,
    @InjectRepository(Category)
    private categoriesRepository: Repository<Category>,
  ) {}

  async create(createPostDto: CreatePostDto): Promise<Post> {
    const category = await this.categoriesRepository.findOne({ where: { id: createPostDto.categoryId } });

    if (!category) {
      throw new Error('Category not found');
    }

    const post = this.postsRepository.create({
      title: createPostDto.title,
      content: createPostDto.content,
      category: category,
    });

    return this.postsRepository.save(post);
  }

  async findAll(): Promise<Post[]> {
    return this.postsRepository.find({ relations: ['category'] });
  }

  async findOne(id: string): Promise<Post | null> {
    const post = await this.postsRepository.findOne({ where: { id }, relations: ['category'] });
    return post || null;
  }

  async remove(id: string): Promise<void> {
    await this.postsRepository.delete(id);
  }
}
