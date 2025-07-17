import { DataSource } from 'typeorm';
import { resolve } from 'path';
import * as dotenv from 'dotenv';
dotenv.config();

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT || '5432', 10),
  username: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  entities: [resolve(process.cwd(), 'src/**/*.entity.{ts,js}')],
  migrations: [resolve(process.cwd(), 'src/migrations/**/*.{ts,js}')],
  ssl: { rejectUnauthorized: false },
  synchronize: false,
});
