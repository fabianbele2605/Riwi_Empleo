import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

/**
 * Interceptor de transformación para agregar metadata a las respuestas
 * 
 * Funcionalidades:
 * - Agrega timestamp a todas las respuestas
 * - Incluye información de la petición
 * - Proporciona metadata útil para el frontend
 * - Mantiene trazabilidad de las operaciones
 */
@Injectable()
export class TransformInterceptor implements NestInterceptor {
  /**
   * Intercepta respuestas para agregar metadata
   * @param context - Contexto de ejecución
   * @param next - Handler de continuación
   * @returns Observable con metadata agregada
   */
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const { method, url } = request;

    return next.handle().pipe(
      map((data) => {
        // Si la respuesta ya tiene el formato estandarizado, agregar metadata
        if (data && typeof data === 'object' && 'success' in data) {
          return {
            ...data,
            timestamp: new Date().toISOString(),
            path: url,
            method: method,
          };
        }

        // Si no tiene el formato estandarizado, mantener los datos originales
        return data;
      })
    );
  }
}