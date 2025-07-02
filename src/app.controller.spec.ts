import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from './app.controller';
import { AppService } from './app.service';

describe('AppController', () => {
  let appController: AppController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      providers: [AppService],
    }).compile();

    appController = app.get<AppController>(AppController);
  });

  describe('getHealth', () => {
    it('should return the service health info', () => {
      expect(appController.getHealth()).toEqual({
        service: 'nestjs-blog-backend-api',
        version: '0.0.3',
        status: true,
      });
    });
  });
});
