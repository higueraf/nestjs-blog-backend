import { Schema, Document, Types } from 'mongoose';

export interface Contenido extends Document {
  _id: Types.ObjectId;
  titulo: string;
  duracion: number;
  descripcion: string;
  tipo: string;
  enlace: string;
  dificultad: string;
  fecha_publicacion: Date;
  completado: boolean;
  tiempo_estimado: string;
  video_id: string;
}

export interface Curso extends Document {
  _id: Types.ObjectId;
  nombre: string;
  descripcion: string;
  categoria: string;
  fecha_inicio: Date;
  fecha_fin: Date;
  nivel: string;
  requisitos: string[];
  precio: number;
  instructor: { nombre: string; email: string };
  calificacion_promedio: number;
  estado: string;
  contenidos: Contenido[];
}

export const ContenidoSchema = new Schema<Contenido>({
  titulo: { type: String, required: true },
  duracion: { type: Number, required: true },
  descripcion: { type: String, required: true },
  tipo: { type: String, required: true },
  enlace: { type: String, required: true },
  dificultad: { type: String, required: true },
  fecha_publicacion: { type: Date, required: true },
  completado: { type: Boolean, required: true },
  tiempo_estimado: { type: String, required: true },
  video_id: { type: String, required: true },
});

export const CursoSchema = new Schema<Curso>({
  nombre: { type: String, required: true },
  descripcion: { type: String, required: true },
  categoria: { type: String, required: true },
  fecha_inicio: { type: Date, required: true },
  fecha_fin: { type: Date, required: true },
  nivel: { type: String, required: true },
  requisitos: { type: [String], required: true },
  precio: { type: Number, required: true },
  instructor: {
    nombre: { type: String, required: true },
    email: { type: String, required: true },
  },
  calificacion_promedio: { type: Number, required: true },
  estado: { type: String, required: true },
  contenidos: { type: [ContenidoSchema], required: true },
});
