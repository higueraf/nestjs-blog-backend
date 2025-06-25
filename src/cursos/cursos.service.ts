import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Curso, Contenido } from './schemas/curso.schema';
import { CreateCursoDto } from './dto/create-curso.dto';

@Injectable()
export class CursosService {
  constructor(@InjectModel('Curso') private readonly cursoModel: Model<Curso>) {}

  async create(createCursoDto: CreateCursoDto): Promise<Curso> {
    const newCurso = new this.cursoModel(createCursoDto);
    return await newCurso.save();
  }

  async findAll(): Promise<Curso[]> {
    return this.cursoModel.find().exec();
  }

  async findOne(id: string): Promise<Curso> {
    const curso = await this.cursoModel.findById(id).exec();
    if (!curso) {
      throw new NotFoundException('Curso no encontrado');
    }
    return curso;
  }

  async update(id: string, updateCursoDto: CreateCursoDto): Promise<Curso> {
    const curso = await this.findOne(id);
    if (!curso) throw new NotFoundException('Curso no encontrado');
    
    const { contenidos } = updateCursoDto;

    if (contenidos) {
      for (const contenido of curso.contenidos) {
        const contenidoExistente = contenidos.find(
          (newContenido) => newContenido._id.toString() === contenido._id.toString()
        );
        if (!contenidoExistente) {
          await this.removeContenido(curso._id.toString(), contenido._id.toString());
        }
      }

      for (const contenidoDto of contenidos) {
        const contenidoExistente = curso.contenidos.find(
          (contenido) => contenido._id.toString() === contenidoDto._id?.toString()
        );
        
        if (contenidoExistente) {
          Object.assign(contenidoExistente, contenidoDto);
        } else {
          curso.contenidos.push(contenidoDto);
        }
      }
    }

    Object.assign(curso, updateCursoDto);

    await this.cursoModel.findByIdAndUpdate(id, curso, { new: true });
    return curso;
  }

  private async removeContenido(cursoId: string, contenidoId: string): Promise<void> {
    await this.cursoModel.updateOne(
      { _id: cursoId },
      { $pull: { contenidos: { _id: new Types.ObjectId(contenidoId) } } }
    );
  }

  async remove(id: string): Promise<Curso> {
    const curso = await this.findOne(id);
    if (!curso) throw new NotFoundException('Curso no encontrado');
    await this.cursoModel.findByIdAndDelete(id);
    return curso
  }
}
