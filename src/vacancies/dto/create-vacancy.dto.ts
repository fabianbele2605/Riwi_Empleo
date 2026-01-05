import { IsNotEmpty, IsString, IsEnum, IsNumber, Min, IsOptional } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { enumModality } from '../entities/vacancy.entity';

/**
 * DTO para la creación de nuevas vacantes laborales
 * Solo accesible por usuarios con rol ADMIN o GESTOR
 * Valida todos los campos requeridos y opcionales
 */
export class CreateVacancyDto {
  /**
   * Título de la vacante laboral
   * Debe ser descriptivo y claro
   */
  @ApiProperty({
    description: 'Título de la vacante laboral',
    example: 'Desarrollador Full Stack Senior',
  })
  @IsNotEmpty({ message: 'El título es requerido' })
  @IsString({ message: 'El título debe ser una cadena de texto' })
  title: string;

  /**
   * Descripción detallada de la vacante
   * Incluye responsabilidades, requisitos y beneficios
   */
  @ApiProperty({
    description: 'Descripción detallada de la vacante',
    example: 'Buscamos un desarrollador con experiencia en React y Node.js para unirse a nuestro equipo...',
  })
  @IsNotEmpty({ message: 'La descripción es requerida' })
  @IsString({ message: 'La descripción debe ser una cadena de texto' })
  description: string;

  /**
   * Tecnologías requeridas para la vacante
   * Lista separada por comas de las tecnologías necesarias
   */
  @ApiProperty({
    description: 'Tecnologías requeridas (separadas por comas)',
    example: 'React, Node.js, PostgreSQL, Docker, AWS',
  })
  @IsNotEmpty({ message: 'Las tecnologías son requeridas' })
  @IsString({ message: 'Las tecnologías deben ser una cadena de texto' })
  technologies: string;

  /**
   * Nivel de seniority requerido
   * Indica el nivel de experiencia necesario
   */
  @ApiProperty({
    description: 'Nivel de seniority requerido',
    example: 'Senior',
    enum: ['Junior', 'Semi-Senior', 'Senior'],
  })
  @IsNotEmpty({ message: 'El seniority es requerido' })
  @IsString({ message: 'El seniority debe ser una cadena de texto' })
  seniority: string;

  /**
   * Habilidades blandas requeridas
   * Campo opcional para especificar soft skills
   */
  @ApiPropertyOptional({
    description: 'Habilidades blandas requeridas',
    example: 'Trabajo en equipo, Comunicación efectiva, Liderazgo',
  })
  @IsOptional()
  @IsString({ message: 'Las habilidades blandas deben ser una cadena de texto' })
  softSkills?: string;

  /**
   * Ubicación de la vacante
   * Debe ser una de las ciudades permitidas
   */
  @ApiProperty({
    description: 'Ubicación de la vacante',
    example: 'Medellín',
    enum: ['Medellín', 'Barranquilla', 'Bogotá', 'Cartagena'],
  })
  @IsNotEmpty({ message: 'La ubicación es requerida' })
  @IsString({ message: 'La ubicación debe ser una cadena de texto' })
  location: string;

  /**
   * Modalidad de trabajo
   * Remoto, presencial o híbrido
   */
  @ApiProperty({
    description: 'Modalidad de trabajo',
    example: 'hybrid',
    enum: enumModality,
  })
  @IsEnum(enumModality, { message: 'La modalidad debe ser remote, office o hybrid' })
  modality: enumModality;

  /**
   * Rango salarial ofrecido
   * Formato libre para flexibilidad
   */
  @ApiProperty({
    description: 'Rango salarial ofrecido',
    example: '3M - 4M COP',
  })
  @IsNotEmpty({ message: 'El rango salarial es requerido' })
  @IsString({ message: 'El rango salarial debe ser una cadena de texto' })
  salaryRange: string;

  /**
   * Nombre de la empresa que ofrece la vacante
   */
  @ApiProperty({
    description: 'Nombre de la empresa',
    example: 'RIWI',
  })
  @IsNotEmpty({ message: 'La empresa es requerida' })
  @IsString({ message: 'La empresa debe ser una cadena de texto' })
  company: string;

  /**
   * Número máximo de aspirantes permitidos
   * Debe ser mayor a 0 para permitir postulaciones
   */
  @ApiProperty({
    description: 'Número máximo de aspirantes permitidos',
    example: 10,
    minimum: 1,
  })
  @IsNumber({}, { message: 'El número máximo de aspirantes debe ser un número' })
  @Min(1, { message: 'Debe permitir al menos 1 aspirante' })
  maxApplicants: number;
}