import { Controller, Post as HttpPost, Get, Param, Delete, Body, UseGuards, Query } from '@nestjs/common';
import { PostsService } from './posts.service';
import { CreatePostDto } from './dto/create-post.dto';

import { Post, Post as PostEntity } from './post.entity';
import { Pagination } from 'nestjs-typeorm-paginate';

@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}


  @HttpPost()
  async create(@Body() createPostDto: CreatePostDto): Promise<PostEntity> {
    return this.postsService.create(createPostDto);
  }

  @Get()
  findAll(
    @Query('page') page = 1,
    @Query('limit') limit = 10,
  ): Promise<Pagination<Post>> {
    limit = limit > 100 ? 100 : limit;
    return this.postsService.findAll({ page, limit });
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<PostEntity | null> {
    return this.postsService.findOne(id);
  }

  
  @Delete(':id')
  async remove(@Param('id') id: string): Promise<void> {
    return this.postsService.remove(id);
  }
}
