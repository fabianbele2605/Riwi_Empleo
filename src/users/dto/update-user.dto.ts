import { IsOptional, IsString, IsEmail, IsEnum } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { UserRole } from '../entities/user.entity';

/**
 * DTO para actualización de usuarios existentes
 * Solo accesible por usuarios ADMIN
 * Todos los campos son opcionales para actualizaciones parciales
 * 
 * Casos de uso:
 * - Cambiar rol de usuario (CODER -> GESTOR)
 * - Actualizar información personal
 * - Cambiar estado del usuario
 * 
 * Nota: Para cambiar contraseñas, considerar endpoint separado por seguridad
 */
export class UpdateUserDto {
  /**
   * Nombre completo del usuario
   * Campo opcional para actualizaciones parciales
   */
  @ApiPropertyOptional({
    description: 'Nombre completo del usuario',
    example: 'Juan Pérez García',
  })
  @IsOptional()
  @IsString({ message: 'El nombre debe ser una cadena de texto' })
  name?: string;

  /**
   * Email del usuario
   * Debe ser único en el sistema si se actualiza
   */
  @ApiPropertyOptional({
    description: 'Email del usuario (debe ser único)',
    example: 'juan.perez@email.com',
    format: 'email',
  })
  @IsOptional()
  @IsEmail({}, { message: 'Debe proporcionar un email válido' })
  email?: string;

  /**
   * Rol del usuario en el sistema
   * 
   * Roles disponibles:
   * - ADMIN: Acceso total al sistema
   * - GESTOR: Puede crear/modificar vacantes y ver postulaciones
   * - CODER: Puede postularse a vacantes
   * 
   * Importante: Solo ADMIN puede cambiar roles
   */
  @ApiPropertyOptional({
    description: 'Rol del usuario en el sistema',
    example: 'gestor',
    enum: UserRole,
  })
  @IsOptional()
  @IsEnum(UserRole, { message: 'El rol debe ser admin, gestor o coder' })
  role?: UserRole;

  /**
   * Estado del usuario
   * Usado para control administrativo (activo, inactivo, suspendido, etc.)
   */
  @ApiPropertyOptional({
    description: 'Estado del usuario para control administrativo',
    example: 'active',
    enum: ['active', 'inactive', 'suspended'],
  })
  @IsOptional()
  @IsString({ message: 'El estado debe ser una cadena de texto' })
  status?: string;
}