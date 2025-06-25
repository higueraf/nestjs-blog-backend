import { Controller, Post, Get, Param, Delete, Body, Put } from '@nestjs/common';
import { CursosService } from './cursos.service';
import { CreateCursoDto } from './dto/create-curso.dto';
import { Curso } from './schemas/curso.schema';
import { SuccessResponseDto } from '../common/dto/response.dto';

@Controller('cursos')
export class CursosController {
  constructor(private readonly cursosService: CursosService) {}

  @Post()
  async create(@Body() createCursoDto: CreateCursoDto): Promise<SuccessResponseDto<Curso>> {
    const curso = await this.cursosService.create(createCursoDto);
    return new SuccessResponseDto('Curso creado exitosamente', curso);
  }

  @Get()
  async findAll(): Promise<SuccessResponseDto<Curso[]>> {
    const cursos = await this.cursosService.findAll();
    return new SuccessResponseDto('Cursos obtenidos exitosamente', cursos);
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<SuccessResponseDto<Curso>> {
    const curso = await this.cursosService.findOne(id);
    return new SuccessResponseDto('Curso obtenido exitosamente', curso);
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() updateCursoDto: CreateCursoDto): Promise<SuccessResponseDto<Curso>> {
    const curso = await this.cursosService.update(id, updateCursoDto);
    return new SuccessResponseDto('Curso actualizado exitosamente', curso);
  }

  @Delete(':id')
  async remove(@Param('id') id: string): Promise<SuccessResponseDto<string>> {
    await this.cursosService.remove(id);
    return new SuccessResponseDto('Curso eliminado exitosamente', id);
  }
}
