import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Application } from './entities/application.entity';
import { ApplyVacancyDto } from './dto/apply-vacancy.dto';
import { VacanciesService } from '../vacancies/vacancies.service';
import { UsersService } from '../users/users.service';

/**
 * Servicio para la gestión de postulaciones a vacantes
 * Implementa todas las reglas de negocio del sistema:
 * - Máximo 3 postulaciones activas por usuario CODER
 * - No postulaciones duplicadas a la misma vacante
 * - Verificación de cupos disponibles
 * - Validación de vacantes activas
 */
@Injectable()
export class ApplicationsService {
  constructor(
    @InjectRepository(Application)
    private applicationRepository: Repository<Application>,
    private vacanciesService: VacanciesService,
    private usersService: UsersService,
  ) {}

  /**
   * Procesa una postulación a una vacante
   * Implementa todas las reglas de negocio del sistema
   * Solo usuarios con rol CODER pueden postularse
   * 
   * Reglas de negocio aplicadas:
   * 1. La vacante debe existir y estar activa
   * 2. El usuario no puede postularse dos veces a la misma vacante
   * 3. El usuario no puede tener más de 3 postulaciones activas
   * 4. La vacante debe tener cupos disponibles
   * 
   * @param userId - ID del usuario que se postula (obtenido del JWT)
   * @param applyVacancyDto - Datos de la postulación (vacancyId)
   * @returns Promise<Application> - Postulación creada exitosamente
   * @throws NotFoundException si la vacante no existe o está inactiva
   * @throws BadRequestException si viola alguna regla de negocio
   */
  async apply(userId: number, applyVacancyDto: ApplyVacancyDto): Promise<Application> {
    const { vacancyId } = applyVacancyDto;

    // REGLA 1: Verificar que la vacante existe y está activa
    const vacancy = await this.vacanciesService.findActiveById(vacancyId);
    if (!vacancy) {
      throw new NotFoundException('Vacancy not found or inactive');
    }

    // REGLA 2: Verificar que el usuario no se haya postulado ya
    const existingApplication = await this.applicationRepository.findOne({
      where: { userId, vacancyId },
    });
    if (existingApplication) {
      throw new BadRequestException('You have already applied to this vacancy');
    }

    // REGLA 3: Verificar límite de 3 postulaciones activas por usuario
    const userActiveApplications = await this.applicationRepository.count({
      where: { userId },
      relations: ['vacancy'],
    });
    if (userActiveApplications >= 3) {
      throw new BadRequestException('You cannot apply to more than 3 active vacancies');
    }

    // REGLA 4: Verificar cupo disponible en la vacante
    const currentApplications = await this.applicationRepository.count({
      where: { vacancyId },
    });
    if (currentApplications >= vacancy.maxApplicants) {
      throw new BadRequestException('This vacancy has reached its maximum number of applicants');
    }

    // Crear la postulación si pasa todas las validaciones
    const application = this.applicationRepository.create({
      userId,
      vacancyId,
    });

    return this.applicationRepository.save(application);
  }

  /**
   * Obtiene todas las postulaciones del sistema
   * Solo accesible por ADMIN y GESTOR
   * Incluye información del usuario y vacante relacionados
   * @returns Promise<Application[]> - Lista completa de postulaciones
   */
  async findAll(): Promise<Application[]> {
    return this.applicationRepository.find({
      relations: ['user', 'vacancy'],
      order: { createdAt: 'DESC' },
    });
  }

  /**
   * Obtiene las postulaciones de un usuario específico
   * Usado por usuarios CODER para ver sus propias postulaciones
   * @param userId - ID del usuario
   * @returns Promise<Application[]> - Postulaciones del usuario
   */
  async findByUser(userId: number): Promise<Application[]> {
    return this.applicationRepository.find({
      where: { userId },
      relations: ['vacancy'],
      order: { createdAt: 'DESC' },
    });
  }

  /**
   * Obtiene las postulaciones para una vacante específica
   * Solo accesible por ADMIN y GESTOR
   * Usado para revisar candidatos de una vacante
   * @param vacancyId - ID de la vacante
   * @returns Promise<Application[]> - Postulaciones a la vacante
   */
  async findByVacancy(vacancyId: number): Promise<Application[]> {
    return this.applicationRepository.find({
      where: { vacancyId },
      relations: ['user'],
      order: { createdAt: 'DESC' },
    });
  }

  /**
   * Elimina una postulación usando soft delete
   * Solo accesible por ADMIN
   * Mantiene integridad referencial en la base de datos
   * @param id - ID de la postulación a eliminar
   * @returns Promise<void>
   */
  async remove(id: number): Promise<void> {
    await this.applicationRepository.softDelete(id);
  }
}
