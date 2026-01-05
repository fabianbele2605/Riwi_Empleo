import { SetMetadata } from '@nestjs/common';
import { UserRole } from '../../users/entities/user.entity';

/**
 * Decorador personalizado para especificar roles requeridos en endpoints
 * 
 * Funcionamiento:
 * - Establece metadatos con los roles permitidos para un endpoint
 * - Usado en conjunto con RolesGuard para control de acceso
 * - Permite múltiples roles en un mismo endpoint
 * 
 * Ejemplos de uso:
 * 
 * // Solo ADMIN puede acceder
 * @Roles(UserRole.ADMIN)
 * 
 * // ADMIN y GESTOR pueden acceder
 * @Roles(UserRole.ADMIN, UserRole.GESTOR)
 * 
 * // Solo CODER puede acceder
 * @Roles(UserRole.CODER)
 * 
 * Implementación:
 * - Usa SetMetadata de NestJS para almacenar roles
 * - La clave 'roles' es leída por RolesGuard
 * - Acepta múltiples roles como parámetros
 * 
 * Seguridad:
 * - Debe usarse junto con JwtAuthGuard y RolesGuard
 * - El orden de guards es importante: JwtAuthGuard primero
 * 
 * @param roles - Uno o más roles que pueden acceder al endpoint
 * @returns Decorador de metadatos para NestJS
 */
export const Roles = (...roles: UserRole[]) => SetMetadata('roles', roles);