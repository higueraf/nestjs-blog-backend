import {
  Controller,
  Post,
  Get,
  Param,
  Delete,
  Body,
  Query,
  NotFoundException,
  InternalServerErrorException,
  Put,
  UploadedFile,
  UseInterceptors,
  ValidationPipe,
  UsePipes,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { Product as ProductEntity } from './products.entity';
import { Pagination } from 'nestjs-typeorm-paginate';
import { SuccessResponseDto } from '../common/dto/response.dto';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Post()
  @UseInterceptors(
    FileInterceptor('photo', {
      storage: diskStorage({
        destination: './public/uploads/products',
        filename: (req, file, cb) => {
          const filename = `${Date.now()}_${file.filename}`;
          cb(null, filename);
        },
      }),
    }),
  )
  @UsePipes(new ValidationPipe({ transform: true }))
  async create(
    @UploadedFile() file: Express.Multer.File,
    @Body() body: any, // no uses CreateProductDto directamente aquí con `multipart/form-data`
  ) {
    const dto: CreateProductDto = {
      name: body.name,
      description: body.description,
      upc_code: body.upc_code,
      ean_code: body.ean_code,
      unit_price: parseFloat(body.unit_price),
      categoryId: body.categoryId,
      photo: file?.filename ?? '',
    };

    return this.productsService.create(dto);
  }

  @Get()
  async findAll(
    @Query('page') page = 1,
    @Query('limit') limit = 10,
  ): Promise<SuccessResponseDto<Pagination<ProductEntity>>> {
    limit = limit > 100 ? 100 : limit;
    const result = await this.productsService.findAll({ page, limit });

    if (!result)
      throw new InternalServerErrorException('Could not retrieve products');

    return new SuccessResponseDto('Products retrieved successfully', result);
  }

  @Get(':id')
  async findOne(
    @Param('id') id: string,
  ): Promise<SuccessResponseDto<ProductEntity>> {
    const post = await this.productsService.findOne(id);
    if (!post) throw new NotFoundException('Product not found');
    return new SuccessResponseDto('Product retrieved successfully', post);
  }

 @Put(':id')
@UseInterceptors(
  FileInterceptor('photo', {
    storage: diskStorage({
      destination: './public/uploads/products',
      filename: (req, file, cb) => {
        const filename = `${Date.now()}_${file.originalname}`;
        cb(null, filename);
      },
    }),
  }),
)
@UsePipes(new ValidationPipe({ transform: true }))
async update(
  @Param('id') id: string,
  @UploadedFile() file: Express.Multer.File,
  @Body() body: any,
): Promise<SuccessResponseDto<ProductEntity>> {
  
  const dto: CreateProductDto = {
    name: body.name,
    description: body.description,
    upc_code: body.upc_code,
    ean_code: body.ean_code,
    unit_price: parseFloat(body.unit_price),
    categoryId: body.categoryId,
    photo: file?.filename ?? body.photo ?? '', // Keep existing photo if no new file uploaded
  };

  const updatedProduct = await this.productsService.update(id, dto);
  if (!updatedProduct) {
    throw new NotFoundException('Product not found or could not be updated');
  }
  return new SuccessResponseDto('Product updated successfully', updatedProduct);
}


  @Delete(':id')
  async remove(@Param('id') id: string): Promise<SuccessResponseDto<string>> {
    const deleted = await this.productsService.remove(id);
    if (!deleted)
      throw new NotFoundException('Product not found or could not be deleted');
    return new SuccessResponseDto('Product deleted successfully', id);
  }
}
