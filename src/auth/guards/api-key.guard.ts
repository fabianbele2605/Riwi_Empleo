import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

/**
 * Guard para validación de API Key
 * Proporciona una capa adicional de seguridad antes de la autenticación JWT
 * 
 * Funcionamiento:
 * 1. Extrae el header 'x-api-key' de la petición
 * 2. Compara con la API Key configurada en variables de entorno
 * 3. Permite o deniega el acceso según la validación
 * 
 * Propósito de seguridad:
 * - Previene ataques automatizados
 * - Controla acceso a nivel de aplicación
 * - Permite revocación rápida de acceso cambiando la clave
 * - Complementa la autenticación JWT
 * 
 * Uso:
 * @UseGuards(ApiKeyGuard)
 * Header requerido: x-api-key: riwi_api_key_2024_empleo_vacantes
 */
@Injectable()
export class ApiKeyGuard implements CanActivate {
  constructor(private configService: ConfigService) {}

  /**
   * Valida la API Key en el header de la petición
   * @param context - Contexto de ejecución de NestJS
   * @returns boolean - true si la API Key es válida
   * @throws UnauthorizedException si la API Key es inválida o falta
   */
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    
    // Extraer API Key del header
    const apiKey = request.headers['x-api-key'];
    
    // Obtener API Key válida de variables de entorno
    const validApiKey = this.configService.get<string>('API_KEY');

    // Validar que la API Key esté presente y sea correcta
    if (!apiKey || apiKey !== validApiKey) {
      throw new UnauthorizedException('Invalid API Key');
    }

    return true;
  }
}