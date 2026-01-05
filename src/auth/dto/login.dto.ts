import { IsEmail, IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

/**
 * DTO para el login de usuarios existentes
 * Valida las credenciales de acceso al sistema
 * Retorna JWT token si las credenciales son válidas
 */
export class LoginDto {
  /**
   * Email del usuario registrado
   * Debe existir en el sistema y tener formato válido
   */
  @ApiProperty({
    description: 'Email del usuario registrado',
    example: 'admin@riwi.io',
    format: 'email',
  })
  @IsEmail({}, { message: 'Debe proporcionar un email válido' })
  email: string;

  /**
   * Contraseña del usuario
   * Será comparada con el hash almacenado en la base de datos
   */
  @ApiProperty({
    description: 'Contraseña del usuario',
    example: 'admin123',
  })
  @IsNotEmpty({ message: 'La contraseña es requerida' })
  @IsString({ message: 'La contraseña debe ser una cadena de texto' })
  password: string;
}