import {
  Controller,
  Get,
  Post,
  Put, Delete, Body, Param, UseGuards, Query, BadRequestException, UseInterceptors, UploadedFile
} from '@nestjs/common';

import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { Pagination } from 'nestjs-typeorm-paginate';
import { User } from './user.entity';
import { SuccessResponseDto } from 'src/common/dto/response.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) { }

  @Post()
  //@UseGuards(JwtAuthGuard)
  async create(@Body() createUserDto: CreateUserDto) {
    const user: User = await this.usersService.create(createUserDto);
    return new SuccessResponseDto('Users retrieved', user);
  }

 @Get()
async findAll(
  @Query('page') page = 1,
  @Query('limit') limit = 10,
  @Query('isActive') isActive?: string,
): Promise<SuccessResponseDto<Pagination<User>>> {
  if (isActive !== undefined && isActive !== 'true' && isActive !== 'false') {
    throw new BadRequestException('Invalid value for "isActive" query param. Use "true" or "false".');
  }
  limit = limit > 100 ? 100 : limit;
  const users = await this.usersService.findAll({
    page,
    limit},
    isActive !== undefined ? isActive === 'true' : undefined,
  );
  return new SuccessResponseDto('Users retrieved', users);
}


  @Get(':id')
  async findOne(@Param('id') id: string) {
    const user: User = await this.usersService.findOne(id);
    return new SuccessResponseDto('Users retrieved', user);
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    const user = await this.usersService.update(id, updateUserDto);
    return new SuccessResponseDto('Users updated Successfully', user);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    const user = await this.usersService.remove(id);
    return new SuccessResponseDto('Users deleted Successfully', user);
  }

  @Put(':id/profile')
  @UseInterceptors(FileInterceptor('profile', {
    storage: diskStorage({
      destination: './public/profile',
      filename: (req, file, cb) => {
        const uniqueName = `${Date.now()}-${file.originalname}`;
        cb(null, uniqueName);
      }
    }),
    fileFilter: (req, file, cb) => {
      if (!file.mimetype.match(/\/(jpg|jpeg|png)$/)) {
        return cb(new BadRequestException('Only JPG or PNG files are allowed'), false);
      }
      cb(null, true);
    }
  }))
  async uploadProfile(
    @Param('id') id: string,
    @UploadedFile() file: Express.Multer.File,
  ) {
    if (!file) throw new BadRequestException('Profile image is required');
    console.log(file);
    const user = await this.usersService.updateProfile(id, file.filename);
    return new SuccessResponseDto('Profile image updated', user);
  }
}


