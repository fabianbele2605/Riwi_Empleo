import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Vacancy } from './entities/vacancy.entity';
import { CreateVacancyDto } from './dto/create-vacancy.dto';
import { UpdateVacancyDto } from './dto/update-vacancy.dto';

/**
 * Servicio para la gestión de vacantes laborales
 * Maneja todas las operaciones CRUD de vacantes
 * Incluye lógica de negocio para activación/desactivación
 * Solo usuarios ADMIN y GESTOR pueden crear/modificar vacantes
 */
@Injectable()
export class VacanciesService {
  constructor(
    @InjectRepository(Vacancy)
    private vacancyRepository: Repository<Vacancy>,
  ) {}

  /**
   * Crea una nueva vacante laboral
   * - Establece isActive=true por defecto
   * - Solo accesible por ADMIN y GESTOR
   * @param createVacancyDto - Datos de la vacante a crear
   * @returns Promise<Vacancy> - Vacante creada con ID asignado
   */
  async create(createVacancyDto: CreateVacancyDto): Promise<Vacancy> {
    const vacancy = this.vacancyRepository.create({
      ...createVacancyDto,
      isActive: true, // Nueva vacante activa por defecto
    });
    return this.vacancyRepository.save(vacancy);
  }

  /**
   * Obtiene todas las vacantes activas
   * - Solo muestra vacantes con isActive=true
   * - Ordenadas por fecha de creación descendente
   * - Accesible por todos los usuarios autenticados
   * @returns Promise<Vacancy[]> - Lista de vacantes activas
   */
  async findAll(): Promise<Vacancy[]> {
    return this.vacancyRepository.find({
      where: { isActive: true },
      order: { createdAt: 'DESC' },
    });
  }

  /**
   * Busca una vacante por ID (incluye inactivas)
   * - Usado internamente para operaciones administrativas
   * @param id - ID de la vacante
   * @returns Promise<Vacancy | null> - Vacante encontrada o null
   */
  async findById(id: number): Promise<Vacancy | null> {
    return this.vacancyRepository.findOne({ where: { id } });
  }

  /**
   * Busca una vacante activa por ID
   * - Solo retorna vacantes con isActive=true
   * - Usado para postulaciones y visualización pública
   * @param id - ID de la vacante
   * @returns Promise<Vacancy | null> - Vacante activa encontrada o null
   */
  async findActiveById(id: number): Promise<Vacancy | null> {
    return this.vacancyRepository.findOne({ 
      where: { id, isActive: true } 
    });
  }

  /**
   * Actualiza una vacante existente
   * - Solo accesible por ADMIN y GESTOR
   * - Verifica que la vacante exista antes de actualizar
   * @param id - ID de la vacante a actualizar
   * @param updateVacancyDto - Datos a actualizar
   * @returns Promise<Vacancy | null> - Vacante actualizada o null
   * @throws NotFoundException si la vacante no existe
   */
  async update(id: number, updateVacancyDto: UpdateVacancyDto): Promise<Vacancy | null> {
    const vacancy = await this.findById(id);
    if (!vacancy) {
      throw new NotFoundException('Vacancy not found');
    }

    await this.vacancyRepository.update(id, updateVacancyDto);
    return this.findById(id);
  }

  /**
   * Elimina una vacante usando soft delete
   * - No eliminación física, mantiene integridad referencial
   * - Solo accesible por ADMIN
   * @param id - ID de la vacante a eliminar
   * @returns Promise<void>
   */
  async remove(id: number): Promise<void> {
    await this.vacancyRepository.softDelete(id);
  }

  /**
   * Alterna el estado activo/inactivo de una vacante
   * - Permite activar/desactivar vacantes sin eliminarlas
   * - Solo accesible por ADMIN y GESTOR
   * @param id - ID de la vacante
   * @returns Promise<Vacancy | null> - Vacante con estado actualizado
   * @throws NotFoundException si la vacante no existe
   */
  async toggleActive(id: number): Promise<Vacancy | null> {
    const vacancy = await this.findById(id);
    if (!vacancy) {
      throw new NotFoundException('Vacancy not found');
    }

    await this.vacancyRepository.update(id, { isActive: !vacancy.isActive });
    return this.findById(id);
  }

  /**
   * Cuenta el número de postulaciones para una vacante
   * - Usado para verificar cupos disponibles
   * - Incluye relación con entidad Application
   * @param vacancyId - ID de la vacante
   * @returns Promise<number> - Número de postulaciones
   */
  async countApplications(vacancyId: number): Promise<number> {
    const vacancy = await this.vacancyRepository.findOne({
      where: { id: vacancyId },
      relations: ['applications'],
    });
    return vacancy?.applications?.length || 0;
  }
}
