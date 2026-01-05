import { PartialType } from '@nestjs/mapped-types';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { CreateVacancyDto } from './create-vacancy.dto';
import { IsOptional, IsBoolean } from 'class-validator';

/**
 * DTO para actualización de vacantes existentes
 * Extiende CreateVacancyDto haciendo todos los campos opcionales
 * Solo accesible por usuarios ADMIN y GESTOR
 * 
 * Características:
 * - Todos los campos de CreateVacancyDto son opcionales
 * - Campo adicional isActive para activar/desactivar
 * - Validaciones heredadas de CreateVacancyDto
 */
export class UpdateVacancyDto extends PartialType(CreateVacancyDto) {
  /**
   * Estado de la vacante (activa/inactiva)
   * 
   * Funcionalidad:
   * - true: Vacante visible y disponible para postulaciones
   * - false: Vacante oculta, no permite nuevas postulaciones
   * - Campo opcional para actualizaciones parciales
   * 
   * Uso alternativo:
   * Para cambiar solo el estado, usar endpoint PATCH /vacancies/:id/toggle-active
   */
  @ApiPropertyOptional({
    description: 'Estado de la vacante (activa/inactiva)',
    example: true,
    type: 'boolean',
  })
  @IsOptional()
  @IsBoolean({ message: 'isActive debe ser un valor booleano' })
  isActive?: boolean;
}