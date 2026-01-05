import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

/**
 * Interceptor de errores para manejo consistente de excepciones
 * 
 * Funcionalidades:
 * - Captura y transforma errores no manejados
 * - Proporciona formato consistente para errores
 * - Registra errores para debugging
 * - Oculta detalles internos en producción
 */
@Injectable()
export class ErrorInterceptor implements NestInterceptor {
  private readonly logger = new Logger(ErrorInterceptor.name);

  /**
   * Intercepta errores para manejo consistente
   * @param context - Contexto de ejecución
   * @param next - Handler de continuación
   * @returns Observable con manejo de errores
   */
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      catchError((error) => {
        const request = context.switchToHttp().getRequest();
        const { method, url } = request;

        // Log del error
        this.logger.error(
          `❌ Error en ${method} ${url}: ${error.message}`,
          error.stack
        );

        // Si ya es una HttpException, la relanzamos
        if (error instanceof HttpException) {
          return throwError(() => error);
        }

        // Para errores no HTTP, crear una HttpException genérica
        const httpException = new HttpException(
          {
            success: false,
            message: 'Error interno del servidor',
            error: process.env.NODE_ENV === 'development' ? error.message : 'Internal Server Error',
          },
          HttpStatus.INTERNAL_SERVER_ERROR
        );

        return throwError(() => httpException);
      })
    );
  }
}