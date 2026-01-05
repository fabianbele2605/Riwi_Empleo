import { IsNumber, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

/**
 * DTO para postulación a vacantes
 * Solo usuarios con rol CODER pueden usar este endpoint
 * Implementa validaciones para las reglas de negocio
 */
export class ApplyVacancyDto {
  /**
   * ID de la vacante a la que se desea postular
   * 
   * Validaciones aplicadas:
   * - Debe ser un número válido
   * - No puede estar vacío
   * - La vacante debe existir y estar activa
   * - Debe tener cupos disponibles
   * 
   * Reglas de negocio:
   * - El usuario no puede postularse dos veces a la misma vacante
   * - El usuario no puede tener más de 3 postulaciones activas
   */
  @ApiProperty({
    description: 'ID de la vacante a la que se postula',
    example: 1,
    minimum: 1,
  })
  @IsNotEmpty({ message: 'El ID de la vacante es requerido' })
  @IsNumber({}, { message: 'El ID de la vacante debe ser un número' })
  vacancyId: number;
}