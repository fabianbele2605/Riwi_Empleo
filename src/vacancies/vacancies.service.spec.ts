import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { VacanciesService } from './vacancies.service';
import { Vacancy, enumModality } from './entities/vacancy.entity';
import { CreateVacancyDto } from './dto/create-vacancy.dto';
import { UpdateVacancyDto } from './dto/update-vacancy.dto';

describe('VacanciesService', () => {
  let service: VacanciesService;
  let repository: Repository<Vacancy>;

  const mockRepository = {
    create: jest.fn(),
    save: jest.fn(),
    find: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    softDelete: jest.fn(),
    count: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        VacanciesService,
        {
          provide: getRepositoryToken(Vacancy),
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get<VacanciesService>(VacanciesService);
    repository = module.get<Repository<Vacancy>>(getRepositoryToken(Vacancy));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('create', () => {
    const createVacancyDto: CreateVacancyDto = {
      title: 'Desarrollador Full Stack',
      description: 'Desarrollo de aplicaciones web',
      technologies: 'React, Node.js, TypeScript',
      seniority: 'Semi Senior',
      softSkills: 'Trabajo en equipo, comunicación',
      location: 'Medellín',
      modality: enumModality.hybrid,
      salaryRange: '$3,000,000 - $4,500,000',
      company: 'RIWI Tech',
      maxApplicants: 10,
    };

    it('should create a vacancy successfully', async () => {
      const mockVacancy = {
        id: 1,
        ...createVacancyDto,
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
        deletedAt: null,
        applications: [],
      };

      mockRepository.create.mockReturnValue(mockVacancy);
      mockRepository.save.mockResolvedValue(mockVacancy);

      const result = await service.create(createVacancyDto);

      expect(mockRepository.create).toHaveBeenCalledWith(createVacancyDto);
      expect(mockRepository.save).toHaveBeenCalledWith(mockVacancy);
      expect(result).toEqual(mockVacancy);
    });

    it('should throw BadRequestException when maxApplicants is 0', async () => {
      const invalidDto = { ...createVacancyDto, maxApplicants: 0 };

      await expect(service.create(invalidDto)).rejects.toThrow(
        BadRequestException,
      );
      expect(mockRepository.create).not.toHaveBeenCalled();
      expect(mockRepository.save).not.toHaveBeenCalled();
    });

    it('should throw BadRequestException when maxApplicants is negative', async () => {
      const invalidDto = { ...createVacancyDto, maxApplicants: -5 };

      await expect(service.create(invalidDto)).rejects.toThrow(
        BadRequestException,
      );
    });

    it('should handle database errors during creation', async () => {
      mockRepository.create.mockReturnValue(createVacancyDto);
      mockRepository.save.mockRejectedValue(new Error('Database error'));

      await expect(service.create(createVacancyDto)).rejects.toThrow(
        'Database error',
      );
    });
  });

  describe('findAll', () => {
    it('should return all active vacancies', async () => {
      const mockVacancies = [
        {
          id: 1,
          title: 'Desarrollador Frontend',
          isActive: true,
          applications: [],
        },
        {
          id: 2,
          title: 'Desarrollador Backend',
          isActive: true,
          applications: [],
        },
      ];

      mockRepository.find.mockResolvedValue(mockVacancies);

      const result = await service.findAll();

      expect(mockRepository.find).toHaveBeenCalledWith({
        where: { isActive: true },
        relations: ['applications'],
      });
      expect(result).toEqual(mockVacancies);
    });
  });

  describe('findOne', () => {
    it('should return a vacancy by id', async () => {
      const mockVacancy = {
        id: 1,
        title: 'Desarrollador Full Stack',
        isActive: true,
        applications: [],
      };

      mockRepository.findOne.mockResolvedValue(mockVacancy);

      const result = await service.findOne(1);

      expect(mockRepository.findOne).toHaveBeenCalledWith({
        where: { id: 1, isActive: true },
        relations: ['applications', 'applications.user'],
      });
      expect(result).toEqual(mockVacancy);
    });

    it('should throw NotFoundException when vacancy not found', async () => {
      mockRepository.findOne.mockResolvedValue(null);

      await expect(service.findOne(999)).rejects.toThrow(NotFoundException);
    });
  });

  describe('update', () => {
    const updateVacancyDto: UpdateVacancyDto = {
      title: 'Desarrollador Senior Full Stack',
      maxApplicants: 15,
    };

    it('should update a vacancy successfully', async () => {
      const existingVacancy = {
        id: 1,
        title: 'Desarrollador Full Stack',
        maxApplicants: 10,
        isActive: true,
      };

      const updatedVacancy = {
        ...existingVacancy,
        ...updateVacancyDto,
      };

      mockRepository.findOne.mockResolvedValue(existingVacancy);
      mockRepository.save.mockResolvedValue(updatedVacancy);

      const result = await service.update(1, updateVacancyDto);

      expect(mockRepository.findOne).toHaveBeenCalledWith({
        where: { id: 1 },
      });
      expect(mockRepository.save).toHaveBeenCalledWith(updatedVacancy);
      expect(result).toEqual(updatedVacancy);
    });

    it('should throw NotFoundException when vacancy not found', async () => {
      mockRepository.findOne.mockResolvedValue(null);

      await expect(service.update(999, updateVacancyDto)).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('toggleActive', () => {
    it('should toggle vacancy active status', async () => {
      const mockVacancy = {
        id: 1,
        title: 'Desarrollador Full Stack',
        isActive: true,
      };

      const toggledVacancy = { ...mockVacancy, isActive: false };

      mockRepository.findOne.mockResolvedValue(mockVacancy);
      mockRepository.save.mockResolvedValue(toggledVacancy);

      const result = await service.toggleActive(1);

      expect(mockRepository.save).toHaveBeenCalledWith(toggledVacancy);
      expect(result.isActive).toBe(false);
    });
  });

  describe('remove', () => {
    it('should soft delete a vacancy', async () => {
      const mockVacancy = { id: 1, title: 'Test Vacancy' };

      mockRepository.findOne.mockResolvedValue(mockVacancy);
      mockRepository.softDelete.mockResolvedValue({ affected: 1 });

      await service.remove(1);

      expect(mockRepository.softDelete).toHaveBeenCalledWith(1);
    });

    it('should throw NotFoundException when vacancy not found', async () => {
      mockRepository.findOne.mockResolvedValue(null);

      await expect(service.remove(999)).rejects.toThrow(NotFoundException);
    });
  });
});
