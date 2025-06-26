import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CursosController } from './cursos.controller';
import { CursosService } from './cursos.service';
import { CursoSchema } from './schemas/curso.schema';
import { ContenidoSchema } from './schemas/contenido.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'Curso', schema: CursoSchema },
      { name: 'Contenido', schema: ContenidoSchema },
    ]),
  ],
  controllers: [CursosController],
  providers: [CursosService],
})
export class CursosModule {}
