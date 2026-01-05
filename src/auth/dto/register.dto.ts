import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

/**
 * DTO para el registro de nuevos usuarios
 * Valida los datos de entrada y proporciona documentación para Swagger
 * Solo permite crear usuarios con rol CODER (asignado automáticamente)
 */
export class RegisterDto {
  /**
   * Nombre completo del usuario
   * Requerido para identificación en el sistema
   */
  @ApiProperty({
    description: 'Nombre completo del usuario',
    example: 'Juan Pérez García',
    minLength: 1,
  })
  @IsNotEmpty({ message: 'El nombre es requerido' })
  @IsString({ message: 'El nombre debe ser una cadena de texto' })
  name: string;

  /**
   * Email del usuario - debe ser único en el sistema
   * Usado como identificador para autenticación
   * Validado con formato de email estándar
   */
  @ApiProperty({
    description: 'Email del usuario (debe ser único)',
    example: 'juan.perez@email.com',
    format: 'email',
  })
  @IsEmail({}, { message: 'Debe proporcionar un email válido' })
  email: string;

  /**
   * Contraseña del usuario
   * Mínimo 6 caracteres por seguridad
   * Será hasheada con bcrypt antes de almacenar
   */
  @ApiProperty({
    description: 'Contraseña del usuario (mínimo 6 caracteres)',
    example: 'miPassword123',
    minLength: 6,
  })
  @IsNotEmpty({ message: 'La contraseña es requerida' })
  @IsString({ message: 'La contraseña debe ser una cadena de texto' })
  @MinLength(6, { message: 'La contraseña debe tener al menos 6 caracteres' })
  password: string;
}