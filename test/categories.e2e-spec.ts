import * as request from 'supertest';
import { Test } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { AppModule } from '../src/app.module';

describe('CategoriesController (e2e)', () => {
  let app: INestApplication;
  let createdCategoryId: string;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleRef.createNestApplication();
    app.useGlobalPipes(
      new ValidationPipe({ whitelist: true, transform: true }),
    );
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('/categories (POST) should create a new category', async () => {
    const response = await request(app.getHttpServer())
      .post('/categories')
      .send({ name: 'Test Category' })
      .expect(201);

    expect(response.body).toEqual(
      expect.objectContaining({
        success: true,
        message: expect.any(String),
        data: expect.objectContaining({
          id: expect.any(String),
          name: 'Test Category',
        }),
      }),
    );

    createdCategoryId = response.body.data.id;
  });

  it('/categories (GET) should return paginated list of categories', async () => {
    const response = await request(app.getHttpServer())
      .get('/categories?page=1&limit=5')
      .expect(200);

    expect(response.body).toEqual(
      expect.objectContaining({
        success: true,
        message: expect.any(String),
        data: expect.objectContaining({
          items: expect.any(Array),
          meta: expect.any(Object),
        }),
      }),
    );
  });

  it('/categories/:id (GET) should return a single category', async () => {
    const response = await request(app.getHttpServer())
      .get(`/categories/${createdCategoryId}`)
      .expect(200);

    expect(response.body).toEqual(
      expect.objectContaining({
        success: true,
        message: 'Category retrieved successfully',
        data: expect.objectContaining({
          id: createdCategoryId,
          name: 'Test Category',
        }),
      }),
    );
  });

  it('/categories/:id (PUT) should update a category', async () => {
    const response = await request(app.getHttpServer())
      .put(`/categories/${createdCategoryId}`)
      .send({ name: 'Updated Category' })
      .expect(200);

    expect(response.body).toEqual(
      expect.objectContaining({
        success: true,
        message: 'Category updated successfully',
        data: expect.objectContaining({
          id: createdCategoryId,
          name: 'Updated Category',
        }),
      }),
    );
  });

  it('/categories/:id (DELETE) should delete a category', async () => {
    const response = await request(app.getHttpServer())
      .delete(`/categories/${createdCategoryId}`)
      .expect(200);

    expect(response.body).toEqual(
      expect.objectContaining({
        success: true,
        message: 'Category deleted successfully',
        data: expect.any(Object),
      }),
    );
  });

  it('/categories/:id (GET) should return NestJS 404 after deletion', async () => {
    const response = await request(app.getHttpServer())
      .get(`/categories/${createdCategoryId}`)
      .expect(404);

    expect(response.body).toEqual({
      statusCode: 404,
      message: 'Category not found',
      error: 'Not Found',
    });
  });
});
