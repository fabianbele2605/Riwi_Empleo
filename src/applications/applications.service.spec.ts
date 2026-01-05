import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { ApplicationsService } from './applications.service';
import { Application } from './entities/application.entity';
import { VacanciesService } from '../vacancies/vacancies.service';
import { UsersService } from '../users/users.service';
import { ApplyVacancyDto } from './dto/apply-vacancy.dto';

describe('ApplicationsService', () => {
  let service: ApplicationsService;
  let applicationRepository: Repository<Application>;
  let vacanciesService: VacanciesService;
  let usersService: UsersService;

  const mockApplicationRepository = {
    create: jest.fn(),
    save: jest.fn(),
    find: jest.fn(),
    findOne: jest.fn(),
    count: jest.fn(),
    softDelete: jest.fn(),
  };

  const mockVacanciesService = {
    findActiveById: jest.fn(),
  };

  const mockUsersService = {
    findOne: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ApplicationsService,
        {
          provide: getRepositoryToken(Application),
          useValue: mockApplicationRepository,
        },
        {
          provide: VacanciesService,
          useValue: mockVacanciesService,
        },
        {
          provide: UsersService,
          useValue: mockUsersService,
        },
      ],
    }).compile();

    service = module.get<ApplicationsService>(ApplicationsService);
    applicationRepository = module.get<Repository<Application>>(getRepositoryToken(Application));
    vacanciesService = module.get<VacanciesService>(VacanciesService);
    usersService = module.get<UsersService>(UsersService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('apply', () => {
    const applyDto: ApplyVacancyDto = { vacancyId: 1 };
    const mockVacancy = { id: 1, title: 'Test', maxApplicants: 10, isActive: true };
    const mockApplication = { id: 1, userId: 1, vacancyId: 1 };

    it('should create application successfully', async () => {
      mockVacanciesService.findActiveById.mockResolvedValue(mockVacancy);
      mockApplicationRepository.findOne.mockResolvedValue(null);
      mockApplicationRepository.count.mockResolvedValueOnce(2).mockResolvedValueOnce(5);
      mockApplicationRepository.create.mockReturnValue(mockApplication);
      mockApplicationRepository.save.mockResolvedValue(mockApplication);

      const result = await service.apply(1, applyDto);

      expect(mockVacanciesService.findActiveById).toHaveBeenCalledWith(1);
      expect(mockApplicationRepository.create).toHaveBeenCalledWith({ userId: 1, vacancyId: 1 });
      expect(result).toEqual(mockApplication);
    });

    it('should throw NotFoundException when vacancy not found', async () => {
      mockVacanciesService.findActiveById.mockResolvedValue(null);

      await expect(service.apply(1, applyDto)).rejects.toThrow(NotFoundException);
    });

    it('should throw BadRequestException when user already applied', async () => {
      mockVacanciesService.findActiveById.mockResolvedValue(mockVacancy);
      mockApplicationRepository.findOne.mockResolvedValue(mockApplication);

      await expect(service.apply(1, applyDto)).rejects.toThrow(BadRequestException);
    });

    it('should throw BadRequestException when user has 3 applications', async () => {
      mockVacanciesService.findActiveById.mockResolvedValue(mockVacancy);
      mockApplicationRepository.findOne.mockResolvedValue(null);
      mockApplicationRepository.count.mockResolvedValueOnce(3);

      await expect(service.apply(1, applyDto)).rejects.toThrow(BadRequestException);
    });

    it('should throw BadRequestException when vacancy is full', async () => {
      mockVacanciesService.findActiveById.mockResolvedValue(mockVacancy);
      mockApplicationRepository.findOne.mockResolvedValue(null);
      mockApplicationRepository.count.mockResolvedValueOnce(2).mockResolvedValueOnce(10);

      await expect(service.apply(1, applyDto)).rejects.toThrow(BadRequestException);
    });
  });

  describe('findAll', () => {
    it('should return all applications', async () => {
      const mockApplications = [{ id: 1, userId: 1, vacancyId: 1 }];
      mockApplicationRepository.find.mockResolvedValue(mockApplications);

      const result = await service.findAll();

      expect(mockApplicationRepository.find).toHaveBeenCalledWith({
        relations: ['user', 'vacancy'],
        order: { createdAt: 'DESC' },
      });
      expect(result).toEqual(mockApplications);
    });
  });

  describe('findByUser', () => {
    it('should return user applications', async () => {
      const mockApplications = [{ id: 1, userId: 1, vacancyId: 1 }];
      mockApplicationRepository.find.mockResolvedValue(mockApplications);

      const result = await service.findByUser(1);

      expect(mockApplicationRepository.find).toHaveBeenCalledWith({
        where: { userId: 1 },
        relations: ['vacancy'],
        order: { createdAt: 'DESC' },
      });
      expect(result).toEqual(mockApplications);
    });
  });

  describe('findByVacancy', () => {
    it('should return vacancy applications', async () => {
      const mockApplications = [{ id: 1, userId: 1, vacancyId: 1 }];
      mockApplicationRepository.find.mockResolvedValue(mockApplications);

      const result = await service.findByVacancy(1);

      expect(mockApplicationRepository.find).toHaveBeenCalledWith({
        where: { vacancyId: 1 },
        relations: ['user'],
        order: { createdAt: 'DESC' },
      });
      expect(result).toEqual(mockApplications);
    });
  });

  describe('remove', () => {
    it('should remove application successfully', async () => {
      mockApplicationRepository.softDelete.mockResolvedValue({ affected: 1 });

      await service.remove(1);

      expect(mockApplicationRepository.softDelete).toHaveBeenCalledWith(1);
    });
  });
});