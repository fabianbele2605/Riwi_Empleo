import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';

/**
 * Exception Filter global para manejo consistente de errores
 * 
 * Funcionalidades:
 * - Captura todas las excepciones HTTP
 * - Proporciona formato estandarizado para errores
 * - Registra errores para debugging
 * - Oculta detalles sensibles en producción
 */
@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(GlobalExceptionFilter.name);

  /**
   * Maneja todas las excepciones de la aplicación
   * @param exception - Excepción capturada
   * @param host - Contexto de la aplicación
   */
  catch(exception: unknown, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    let status: number;
    let message: string;
    let error: string;

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      const exceptionResponse = exception.getResponse();
      
      if (typeof exceptionResponse === 'object' && exceptionResponse !== null) {
        const responseObj = exceptionResponse as any;
        message = responseObj.message || exception.message;
        error = responseObj.error || 'Http Exception';
      } else {
        message = exceptionResponse as string;
        error = 'Http Exception';
      }
    } else {
      status = HttpStatus.INTERNAL_SERVER_ERROR;
      message = 'Error interno del servidor';
      error = 'Internal Server Error';
    }

    // Log del error
    this.logger.error(
      `❌ ${request.method} ${request.url} - ${status} - ${message}`,
      exception instanceof Error ? exception.stack : 'No stack trace'
    );

    // Respuesta estandarizada de error
    const errorResponse = {
      success: false,
      error: error,
      message: message,
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
      method: request.method,
    };

    response.status(status).json(errorResponse);
  }
}