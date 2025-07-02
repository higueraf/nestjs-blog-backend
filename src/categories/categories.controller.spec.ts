import { Test, TestingModule } from '@nestjs/testing';
import { CategoriesController } from './categories.controller';
import { CategoriesService } from './categories.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { SuccessResponseDto } from '../common/dto/response.dto';
import { NotFoundException, InternalServerErrorException } from '@nestjs/common';

describe('CategoriesController', () => {
  let controller: CategoriesController;
  let service: CategoriesService;

  const mockCategory = { id: '1', name: 'Category' };
  const mockPagination = { items: [mockCategory], meta: {}, links: {} };

  const mockService = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CategoriesController],
      providers: [{ provide: CategoriesService, useValue: mockService }],
    }).compile();

    controller = module.get<CategoriesController>(CategoriesController);
    service = module.get<CategoriesService>(CategoriesService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should return success dto if creation is successful', async () => {
      mockService.create.mockResolvedValue(mockCategory);
      const dto: CreateCategoryDto = { name: 'Test' };
      const result = await controller.create(dto);
      expect(result).toBeInstanceOf(SuccessResponseDto);
    });

    it('should throw 500 if service returns null', async () => {
      mockService.create.mockResolvedValue(null);
      await expect(controller.create({ name: 'Fail' })).rejects.toThrow(InternalServerErrorException);
    });
  });

  describe('findAll', () => {
    it('should return paginated result', async () => {
      mockService.findAll.mockResolvedValue(mockPagination);
      const result = await controller.findAll(1, 10);
      expect(result.data.items).toHaveLength(1);
    });

    it('should throw 500 if result is null', async () => {
      mockService.findAll.mockResolvedValue(null);
      await expect(controller.findAll(1, 10)).rejects.toThrow(InternalServerErrorException);
    });
  });

  describe('findOne', () => {
    it('should return the category', async () => {
      mockService.findOne.mockResolvedValue(mockCategory);
      const result = await controller.findOne('1');
      expect(result.data).toEqual(mockCategory);
    });

    it('should throw 404 if not found', async () => {
      mockService.findOne.mockResolvedValue(null);
      await expect(controller.findOne('999')).rejects.toThrow(NotFoundException);
    });
  });

  describe('update', () => {
    it('should return updated category', async () => {
      mockService.update.mockResolvedValue(mockCategory);
      const dto: UpdateCategoryDto = { name: 'Updated' };
      const result = await controller.update('1', dto);
      expect(result.data).toEqual(mockCategory);
    });

    it('should throw 404 if category not found', async () => {
      mockService.update.mockResolvedValue(null);
      await expect(controller.update('999', { name: 'Fail' })).rejects.toThrow(NotFoundException);
    });
  });

  describe('remove', () => {
    it('should return deleted category', async () => {
      mockService.remove.mockResolvedValue(mockCategory);
      const result = await controller.remove('1');
      expect(result.data).toEqual(mockCategory);
    });

    it('should throw 404 if not found', async () => {
      mockService.remove.mockResolvedValue(null);
      await expect(controller.remove('999')).rejects.toThrow(NotFoundException);
    });
  });
});
