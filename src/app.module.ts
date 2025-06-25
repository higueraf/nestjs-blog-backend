import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';  // Importar Mongoose
import { TypeOrmModule } from '@nestjs/typeorm';  // Importar TypeOrm
import { ConfigModule } from '@nestjs/config';  // Importar ConfigModule
import { UsersModule } from './users/users.module';
import { CategoriesModule } from './categories/categories.module';
import { PostsModule } from './posts/posts.module';
import { AuthModule } from './auth/auth.module';
import { MailModule } from './mail/mail.module';
import { ProductsModule } from './products/products.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CustomersModule } from './customers/customers.module';
import { InvoicesModule } from './invoices/invoices.module';
import { CursosModule } from './cursos/cursos.module';

@Module({
  imports: [
    ConfigModule.forRoot(),  // Cargar variables de entorno

    // Conexión a MongoDB (Mongoose)
    MongooseModule.forRoot(process.env.MONGO_URI || ''),

    // Conexión a PostgreSQL (TypeORM)
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST,
      port: process.env.DB_PORT as unknown as number,
      username: process.env.DB_USER,
      password: process.env.DB_PASS,
      database: process.env.DB_NAME,
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      //synchronize: true,
      ssl: { rejectUnauthorized: false },
    }),

    UsersModule,
    CategoriesModule,
    CustomersModule,
    InvoicesModule,
    PostsModule,
    AuthModule,
    MailModule,
    ProductsModule,
    CursosModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
