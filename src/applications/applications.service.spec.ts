import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BadRequestException, NotFoundException, ConflictException } from '@nestjs/common';
import { ApplicationsService } from './applications.service';
import { Application } from './entities/application.entity';
import { Vacancy } from '../vacancies/entities/vacancy.entity';
import { User, UserRole } from '../users/entities/user.entity';
import { CreateApplicationDto } from './dto/create-application.dto';

describe('ApplicationsService', () => {
  let service: ApplicationsService;
  let applicationRepository: Repository<Application>;
  let vacancyRepository: Repository<Vacancy>;
  let userRepository: Repository<User>;

  const mockApplicationRepository = {
    create: jest.fn(),
    save: jest.fn(),
    find: jest.fn(),
    findOne: jest.fn(),
    count: jest.fn(),
    softDelete: jest.fn(),
  };

  const mockVacancyRepository = {
    findOne: jest.fn(),
  };

  const mockUserRepository = {
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
          provide: getRepositoryToken(Vacancy),
          useValue: mockVacancyRepository,
        },
        {
          provide: getRepositoryToken(User),
          useValue: mockUserRepository,
        },
      ],
    }).compile();

    service = module.get<ApplicationsService>(ApplicationsService);
    applicationRepository = module.get<Repository<Application>>(getRepositoryToken(Application));
    vacancyRepository = module.get<Repository<Vacancy>>(getRepositoryToken(Vacancy));
    userRepository = module.get<Repository<User>>(getRepositoryToken(User));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('apply', () => {
    const mockUser = {
      id: 1,
      name: 'Joel Adrian',
      email: 'joel123@mail.com',
      role: UserRole.CODER,
      status: 'active',
    };

    const mockVacancy = {
      id: 1,
      title: 'Desarrollador Full Stack',
      maxApplicants: 10,
      isActive: true,
      applications: [],
    };

    const createApplicationDto: CreateApplicationDto = {
      vacancyId: 1,
    };

    it('should create application successfully', async () => {
      const mockApplication = {
        id: 1,
        userId: 1,
        vacancyId: 1,
        appliedAt: new Date(),
        user: mockUser,
        vacancy: mockVacancy,
      };

      mockUserRepository.findOne.mockResolvedValue(mockUser);
      mockVacancyRepository.findOne.mockResolvedValue(mockVacancy);
      mockApplicationRepository.findOne.mockResolvedValue(null); // No existe aplicación previa
      mockApplicationRepository.count.mockResolvedValue(2); // Usuario tiene 2 aplicaciones activas
      mockApplicationRepository.create.mockReturnValue(mockApplication);
      mockApplicationRepository.save.mockResolvedValue(mockApplication);

      const result = await service.apply(1, createApplicationDto);

      expect(mockUserRepository.findOne).toHaveBeenCalledWith({
        where: { id: 1, status: 'active' },
      });
      expect(mockVacancyRepository.findOne).toHaveBeenCalledWith({
        where: { id: 1, isActive: true },
        relations: ['applications'],
      });
      expect(mockApplicationRepository.create).toHaveBeenCalledWith({
        userId: 1,
        vacancyId: 1,
      });
      expect(result).toEqual(mockApplication);
    });

    it('should throw NotFoundException when user not found', async () => {
      mockUserRepository.findOne.mockResolvedValue(null);

      await expect(service.apply(999, createApplicationDto)).rejects.toThrow(
        NotFoundException,
      );
    });

    it('should throw NotFoundException when vacancy not found', async () => {
      mockUserRepository.findOne.mockResolvedValue(mockUser);
      mockVacancyRepository.findOne.mockResolvedValue(null);

      await expect(service.apply(1, createApplicationDto)).rejects.toThrow(
        NotFoundException,
      );
    });

    it('should throw ConflictException when user already applied', async () => {
      const existingApplication = {
        id: 1,
        userId: 1,
        vacancyId: 1,
      };

      mockUserRepository.findOne.mockResolvedValue(mockUser);
      mockVacancyRepository.findOne.mockResolvedValue(mockVacancy);
      mockApplicationRepository.findOne.mockResolvedValue(existingApplication);

      await expect(service.apply(1, createApplicationDto)).rejects.toThrow(
        ConflictException,
      );
    });

    it('should throw BadRequestException when vacancy is full', async () => {
      const fullVacancy = {
        ...mockVacancy,
        applications: new Array(10).fill({}), // 10 aplicaciones (cupo completo)
      };

      mockUserRepository.findOne.mockResolvedValue(mockUser);
      mockVacancyRepository.findOne.mockResolvedValue(fullVacancy);
      mockApplicationRepository.findOne.mockResolvedValue(null);

      await expect(service.apply(1, createApplicationDto)).rejects.toThrow(
        BadRequestException,
      );
    });

    it('should throw BadRequestException when user has 3 active applications', async () => {
      mockUserRepository.findOne.mockResolvedValue(mockUser);
      mockVacancyRepository.findOne.mockResolvedValue(mockVacancy);
      mockApplicationRepository.findOne.mockResolvedValue(null);
      mockApplicationRepository.count.mockResolvedValue(3); // Usuario ya tiene 3 aplicaciones

      await expect(service.apply(1, createApplicationDto)).rejects.toThrow(
        BadRequestException,
      );
    });

    it('should throw BadRequestException when vacancy is inactive', async () => {
      const inactiveVacancy = {
        ...mockVacancy,
        isActive: false,
      };

      mockUserRepository.findOne.mockResolvedValue(mockUser);
      mockVacancyRepository.findOne.mockResolvedValue(null); // findOne no devuelve vacantes inactivas

      await expect(service.apply(1, createApplicationDto)).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('findAll', () => {
    it('should return all applications with relations', async () => {
      const mockApplications = [
        {
          id: 1,
          userId: 1,
          vacancyId: 1,
          appliedAt: new Date(),
          user: { name: 'Joel Adrian' },
          vacancy: { title: 'Desarrollador Full Stack' },
        },
      ];

      mockApplicationRepository.find.mockResolvedValue(mockApplications);

      const result = await service.findAll();

      expect(mockApplicationRepository.find).toHaveBeenCalledWith({
        relations: ['user', 'vacancy'],
        order: { appliedAt: 'DESC' },
      });
      expect(result).toEqual(mockApplications);
    });
  });

  describe('findByUser', () => {
    it('should return user applications', async () => {
      const mockApplications = [
        {
          id: 1,
          userId: 1,
          vacancyId: 1,
          vacancy: { title: 'Desarrollador Full Stack' },
        },
      ];

      mockApplicationRepository.find.mockResolvedValue(mockApplications);

      const result = await service.findByUser(1);

      expect(mockApplicationRepository.find).toHaveBeenCalledWith({
        where: { userId: 1 },
        relations: ['vacancy'],
        order: { appliedAt: 'DESC' },
      });
      expect(result).toEqual(mockApplications);
    });
  });

  describe('findByVacancy', () => {
    it('should return vacancy applications', async () => {
      const mockApplications = [
        {
          id: 1,
          userId: 1,
          vacancyId: 1,
          user: { name: 'Joel Adrian' },
        },
      ];

      mockVacancyRepository.findOne.mockResolvedValue({ id: 1 });
      mockApplicationRepository.find.mockResolvedValue(mockApplications);

      const result = await service.findByVacancy(1);

      expect(mockVacancyRepository.findOne).toHaveBeenCalledWith({
        where: { id: 1 },
      });
      expect(mockApplicationRepository.find).toHaveBeenCalledWith({
        where: { vacancyId: 1 },
        relations: ['user'],
        order: { appliedAt: 'DESC' },
      });
      expect(result).toEqual(mockApplications);
    });

    it('should throw NotFoundException when vacancy not found', async () => {
      mockVacancyRepository.findOne.mockResolvedValue(null);

      await expect(service.findByVacancy(999)).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('remove', () => {
    it('should remove application successfully', async () => {
      const mockApplication = {
        id: 1,
        userId: 1,
        vacancyId: 1,
      };

      mockApplicationRepository.findOne.mockResolvedValue(mockApplication);
      mockApplicationRepository.softDelete.mockResolvedValue({ affected: 1 });

      await service.remove(1, 1);

      expect(mockApplicationRepository.findOne).toHaveBeenCalledWith({
        where: { id: 1, userId: 1 },
      });
      expect(mockApplicationRepository.softDelete).toHaveBeenCalledWith(1);
    });

    it('should throw NotFoundException when application not found', async () => {
      mockApplicationRepository.findOne.mockResolvedValue(null);

      await expect(service.remove(999, 1)).rejects.toThrow(
        NotFoundException,
      );
    });
  });
});
