import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { NotFoundException } from '@nestjs/common';
import { VacanciesService } from './vacancies.service';
import { Vacancy, enumModality } from './entities/vacancy.entity';
import { CreateVacancyDto } from './dto/create-vacancy.dto';
import { UpdateVacancyDto } from './dto/update-vacancy.dto';

describe('VacanciesService - Creación de Vacantes', () => {
  let service: VacanciesService;
  let repository: Repository<Vacancy>;

  const mockRepository = {
    create: jest.fn(),
    save: jest.fn(),
    find: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    softDelete: jest.fn(),
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

      expect(mockRepository.create).toHaveBeenCalledWith({
        ...createVacancyDto,
        isActive: true,
      });
      expect(mockRepository.save).toHaveBeenCalledWith(mockVacancy);
      expect(result).toEqual(mockVacancy);
    });

    it('should set isActive to true by default', async () => {
      const mockVacancy = { ...createVacancyDto, isActive: true };
      
      mockRepository.create.mockReturnValue(mockVacancy);
      mockRepository.save.mockResolvedValue(mockVacancy);

      await service.create(createVacancyDto);

      expect(mockRepository.create).toHaveBeenCalledWith({
        ...createVacancyDto,
        isActive: true,
      });
    });
  });

  describe('findAll', () => {
    it('should return only active vacancies', async () => {
      const mockVacancies = [
        { id: 1, title: 'Dev Frontend', isActive: true },
        { id: 2, title: 'Dev Backend', isActive: true },
      ];

      mockRepository.find.mockResolvedValue(mockVacancies);

      const result = await service.findAll();

      expect(mockRepository.find).toHaveBeenCalledWith({
        where: { isActive: true },
        order: { createdAt: 'DESC' },
      });
      expect(result).toEqual(mockVacancies);
    });
  });

  describe('findById', () => {
    it('should return vacancy by id', async () => {
      const mockVacancy = { id: 1, title: 'Test Vacancy' };
      
      mockRepository.findOne.mockResolvedValue(mockVacancy);

      const result = await service.findById(1);

      expect(mockRepository.findOne).toHaveBeenCalledWith({ where: { id: 1 } });
      expect(result).toEqual(mockVacancy);
    });

    it('should return null if vacancy not found', async () => {
      mockRepository.findOne.mockResolvedValue(null);

      const result = await service.findById(999);

      expect(result).toBeNull();
    });
  });

  describe('update', () => {
    const updateDto: UpdateVacancyDto = {
      title: 'Updated Title',
      maxApplicants: 15,
    };

    it('should update vacancy successfully', async () => {
      const existingVacancy = { id: 1, title: 'Old Title' };
      const updatedVacancy = { ...existingVacancy, ...updateDto };

      mockRepository.findOne
        .mockResolvedValueOnce(existingVacancy) // Primera llamada en update
        .mockResolvedValueOnce(updatedVacancy); // Segunda llamada después del update
      mockRepository.update.mockResolvedValue({ affected: 1 });

      const result = await service.update(1, updateDto);

      expect(mockRepository.update).toHaveBeenCalledWith(1, updateDto);
      expect(result).toEqual(updatedVacancy);
    });

    it('should throw NotFoundException if vacancy not found', async () => {
      mockRepository.findOne.mockResolvedValue(null);

      await expect(service.update(999, updateDto)).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('toggleActive', () => {
    it('should toggle vacancy active status', async () => {
      const vacancy = { id: 1, isActive: true };
      const toggledVacancy = { ...vacancy, isActive: false };

      mockRepository.findOne
        .mockResolvedValueOnce(vacancy) // Primera llamada
        .mockResolvedValueOnce(toggledVacancy); // Segunda llamada después del update
      mockRepository.update.mockResolvedValue({ affected: 1 });

      const result = await service.toggleActive(1);

      expect(mockRepository.update).toHaveBeenCalledWith(1, { isActive: false });
      expect(result).toEqual(toggledVacancy);
    });

    it('should throw NotFoundException if vacancy not found', async () => {
      mockRepository.findOne.mockResolvedValue(null);

      await expect(service.toggleActive(999)).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('remove', () => {
    it('should soft delete vacancy', async () => {
      mockRepository.softDelete.mockResolvedValue({ affected: 1 });

      await service.remove(1);

      expect(mockRepository.softDelete).toHaveBeenCalledWith(1);
    });
  });
});