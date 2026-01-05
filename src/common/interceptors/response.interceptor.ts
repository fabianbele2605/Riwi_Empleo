import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

/**
 * Interfaz para la respuesta estandarizada de la API
 * Todas las respuestas exitosas seguirán este formato
 */
export interface Response<T> {
  success: boolean;  // Indica si la operación fue exitosa
  data: T;          // Datos de respuesta (puede ser cualquier tipo)
  message: string;  // Mensaje descriptivo de la operación
}

/**
 * Interceptor global para estandarizar respuestas de la API
 * 
 * Propósito:
 * - Unificar el formato de todas las respuestas exitosas
 * - Facilitar el manejo de respuestas en el frontend
 * - Proporcionar consistencia en la API
 * - Agregar metadatos útiles (success, message)
 * 
 * Formato de respuesta:
 * {
 *   "success": true,
 *   "data": { ... }, // Datos originales del controlador
 *   "message": "Operación exitosa"
 * }
 * 
 * Nota: Solo se aplica a respuestas exitosas (2xx)
 * Los errores son manejados por exception filters
 */
@Injectable()
export class ResponseInterceptor<T> implements NestInterceptor<T, Response<T>> {
  /**
   * Intercepta la respuesta antes de enviarla al cliente
   * @param context - Contexto de ejecución de NestJS
   * @param next - Handler para continuar con la ejecución
   * @returns Observable con la respuesta transformada
   */
  intercept(context: ExecutionContext, next: CallHandler): Observable<Response<T>> {
    return next.handle().pipe(
      map((data) => ({
        success: true,
        data,
        message: 'Operación exitosa',
      })),
    );
  }
}