import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  Logger,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

/**
 * Interceptor de logging para registrar peticiones HTTP
 * 
 * Funcionalidades:
 * - Registra método, URL, IP y timestamp de cada petición
 * - Mide tiempo de respuesta
 * - Registra código de estado de respuesta
 * - Proporciona logs detallados para debugging y monitoreo
 */
@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  private readonly logger = new Logger(LoggingInterceptor.name);

  /**
   * Intercepta peticiones para logging completo
   * @param context - Contexto de ejecución
   * @param next - Handler de continuación
   * @returns Observable con logging aplicado
   */
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const response = context.switchToHttp().getResponse();
    
    const { method, url, ip, headers } = request;
    const userAgent = headers['user-agent'] || 'Unknown';
    const startTime = Date.now();

    // Log de petición entrante
    this.logger.log(
      `📥 ${method} ${url} - IP: ${ip} - User-Agent: ${userAgent}`
    );

    return next.handle().pipe(
      tap(() => {
        const endTime = Date.now();
        const duration = endTime - startTime;
        const statusCode = response.statusCode;
        
        // Log de respuesta con tiempo de procesamiento
        this.logger.log(
          `📤 ${method} ${url} - ${statusCode} - ${duration}ms`
        );
      })
    );
  }
}