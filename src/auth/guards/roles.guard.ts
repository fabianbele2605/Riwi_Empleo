import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { UserRole } from '../../users/entities/user.entity';

/**
 * Guard para control de acceso basado en roles (RBAC)
 * Verifica que el usuario autenticado tenga uno de los roles requeridos
 * 
 * Funcionamiento:
 * 1. Obtiene los roles requeridos del decorador @Roles()
 * 2. Extrae el rol del usuario del JWT token (req.user.role)
 * 3. Verifica si el usuario tiene al menos uno de los roles requeridos
 * 4. Permite o deniega el acceso según la verificación
 * 
 * Uso:
 * @UseGuards(JwtAuthGuard, RolesGuard)
 * @Roles(UserRole.ADMIN, UserRole.GESTOR)
 * 
 * Nota: Debe usarse DESPUÉS de JwtAuthGuard para tener acceso a req.user
 */
@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  /**
   * Determina si la petición actual puede proceder
   * @param context - Contexto de ejecución de NestJS
   * @returns boolean - true si tiene permisos, false si no
   */
  canActivate(context: ExecutionContext): boolean {
    // Obtener roles requeridos del decorador @Roles()
    const requiredRoles = this.reflector.getAllAndOverride<UserRole[]>('roles', [
      context.getHandler(), // Método del controlador
      context.getClass(),   // Clase del controlador
    ]);

    // Si no hay roles requeridos, permitir acceso
    if (!requiredRoles) {
      return true;
    }

    // Obtener usuario del JWT token (establecido por JwtAuthGuard)
    const { user } = context.switchToHttp().getRequest();
    
    // Verificar si el usuario tiene al menos uno de los roles requeridos
    return requiredRoles.some((role) => user.role === role);
  }
}