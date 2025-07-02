import { Test, TestingModule } from '@nestjs/testing';
import { CategoriesService } from './categories.service';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Category } from './category.entity';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { paginate, Pagination } from 'nestjs-typeorm-paginate';

jest.mock('nestjs-typeorm-paginate', () => ({
  ...jest.requireActual('nestjs-typeorm-paginate'),
  paginate: jest.fn(),
}));

describe('CategoriesService', () => {
  let service: CategoriesService;
  let repo: Repository<Category>;

  const mockCategory: Category = {
    id: '1',
    name: 'Test Category',
    description: 'Test Description',
  } as Category;

  const mockRepo = {
    create: jest.fn().mockImplementation((dto) => ({ id: '1', ...dto })),
    save: jest.fn().mockResolvedValue(mockCategory),
    findOne: jest.fn().mockResolvedValue(mockCategory),
    createQueryBuilder: jest.fn().mockReturnValue({
      getMany: jest.fn().mockResolvedValue([mockCategory]),
      skip: jest.fn().mockReturnThis(),
      take: jest.fn().mockReturnThis(),
    }),
    remove: jest.fn().mockResolvedValue(mockCategory),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CategoriesService,
        {
          provide: getRepositoryToken(Category),
          useValue: mockRepo,
        },
      ],
    }).compile();

    service = module.get<CategoriesService>(CategoriesService);
    repo = module.get<Repository<Category>>(getRepositoryToken(Category));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create and save a new category', async () => {
      const dto: CreateCategoryDto = { name: 'New Category' };
      const result = await service.create(dto);
      expect(repo.create).toHaveBeenCalledWith(dto);
      expect(repo.save).toHaveBeenCalledWith(expect.objectContaining(dto));
      expect(result).toEqual(mockCategory);
    });
  });

  describe('findAll', () => {
    it('should return paginated categories', async () => {
      (paginate as jest.Mock).mockResolvedValue({
        items: [mockCategory],
        meta: {},
        links: {},
      } as Pagination<Category>);

      const result = await service.findAll({ page: 1, limit: 10 });
      expect(paginate).toHaveBeenCalled();
      expect(result?.items).toContain(mockCategory);
    });
  });

  describe('findOne', () => {
    it('should return a single category by id', async () => {
      const result = await service.findOne('1');
      expect(repo.findOne).toHaveBeenCalledWith({ where: { id: '1' } });
      expect(result).toEqual(mockCategory);
    });
  });

  describe('update', () => {
    it('should update an existing category', async () => {
      const dto: UpdateCategoryDto = { name: 'Updated Name' };
      const result = await service.update('1', dto);
      expect(result).toEqual(mockCategory);
      expect(repo.save).toHaveBeenCalled();
    });

    it('should return null if category not found', async () => {
      jest.spyOn(service, 'findOne').mockResolvedValueOnce(null);
      const result = await service.update('999', { name: 'Does Not Exist' });
      expect(result).toBeNull();
    });
  });

  describe('remove', () => {
    it('should remove a category', async () => {
      const result = await service.remove('1');
      expect(repo.remove).toHaveBeenCalledWith(mockCategory);
      expect(result).toEqual(mockCategory);
    });

    it('should return null if category not found', async () => {
      jest.spyOn(service, 'findOne').mockResolvedValueOnce(null);
      const result = await service.remove('999');
      expect(result).toBeNull();
    });
  });
});
