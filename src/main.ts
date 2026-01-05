import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import cookieParser from 'cookie-parser';
import { AppModule } from './app.module';
import { 
  ResponseInterceptor, 
  LoggingInterceptor, 
  ErrorInterceptor, 
  TransformInterceptor 
} from './common/interceptors';
import { GlobalExceptionFilter } from './common/filters';

/**
 * Función principal de arranque de la aplicación
 * 
 * Configuraciones aplicadas:
 * - Cookie parser para manejo de cookies HttpOnly
 * - Validación global con class-validator
 * - Interceptor global para respuestas estandarizadas
 * - CORS para seguridad en frontend
 * - Documentación Swagger completa
 * - Configuración de puerto desde variables de entorno
 * 
 * Seguridad implementada:
 * - Cookies HttpOnly para JWT tokens
 * - Whitelist de propiedades en DTOs
 * - Rechazo de propiedades no permitidas
 * - Transformación automática de tipos
 * - CORS configurado para origen específico
 */
async function bootstrap() {
  // Crear instancia de la aplicación NestJS
  const app = await NestFactory.create(AppModule, {
    logger: ['log', 'error', 'warn', 'debug', 'verbose']
  });
  
  /**
   * Configuración de cookie parser
   * Necesario para leer cookies HttpOnly en las peticiones
   * Permite el manejo seguro de JWT tokens
   */
  app.use(cookieParser());
  
  /**
   * Configuración de validación global
   * Aplica validaciones de class-validator a todos los DTOs automáticamente
   */
  app.useGlobalPipes(
    new ValidationPipe({
      // Remover propiedades no definidas en DTOs (seguridad)
      whitelist: true,
      // Lanzar error si hay propiedades no permitidas (seguridad)
      forbidNonWhitelisted: true,
      // Transformar tipos automáticamente (string -> number, etc.)
      transform: true,
    }),
  );
  
  /**
   * Configuración de exception filters globales
   * Maneja todas las excepciones de manera consistente
   */
  app.useGlobalFilters(new GlobalExceptionFilter());
  
  /**
   * Configuración de interceptors globales
   * Orden de aplicación:
   * 1. ErrorInterceptor - Manejo de errores
   * 2. LoggingInterceptor - Registro de peticiones
   * 3. ResponseInterceptor - Formato de respuestas
   * 4. TransformInterceptor - Metadata adicional
   */
  app.useGlobalInterceptors(
    new ErrorInterceptor(),
    new LoggingInterceptor(),
    new ResponseInterceptor(),
    new TransformInterceptor()
  );
  
  /**
   * Configuración de CORS (Cross-Origin Resource Sharing)
   * Permite peticiones desde el frontend configurado
   * Incluye soporte para cookies en peticiones cross-origin
   */
  app.enableCors({
    // Origen permitido (frontend)
    origin: process.env.FRONTEND_URL || 'http://localhost:3001',
    // Permitir cookies y headers de autenticación
    credentials: true,
  });
  
  /**
   * Configuración de Swagger para documentación de API
   * Genera documentación interactiva automáticamente
   */
  const config = new DocumentBuilder()
    .setTitle('API de Empleabilidad RIWI')
    .setDescription(`
      API REST para gestión de vacantes y postulaciones de empleabilidad.
      
      ## Características principales:
      - Autenticación JWT + API Key
      - Cookies HttpOnly seguras para JWT
      - Control de acceso basado en roles (RBAC)
      - Reglas de negocio implementadas
      - Soft delete para integridad referencial
      
      ## Roles del sistema:
      - **ADMIN**: Acceso total al sistema
      - **GESTOR**: Crear/modificar vacantes, ver postulaciones
      - **CODER**: Postularse a vacantes (máx. 3 activas)
      
      ## Seguridad implementada:
      - JWT almacenado en cookies HttpOnly
      - Protección contra XSS y CSRF
      - API Key para seguridad adicional
      - Validaciones estrictas de entrada
      
      ## Credenciales de prueba:
      - Admin: admin@riwi.io / admin123
      - Gestor: gestor@riwi.io / admin123
      - API Key: riwi_api_key_2024_empleo_vacantes
      
      ## Nota sobre autenticación:
      Después del login, el JWT se almacena automáticamente en una cookie HttpOnly.
      No es necesario manejar tokens manualmente en el frontend.
    `)
    .setVersion('1.0')
    .setContact(
      'Equipo de Desarrollo RIWI',
      'https://riwi.io',
      'desarrollo@riwi.io'
    )
    .setLicense('MIT', 'https://opensource.org/licenses/MIT')
    // Configuración de autenticación JWT (para testing en Swagger)
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'JWT',
        description: 'Ingrese el token JWT obtenido del login (solo para testing en Swagger)',
        in: 'header',
      },
      'JWT-auth', // Nombre de referencia
    )
    // Configuración de API Key
    .addApiKey(
      {
        type: 'apiKey',
        name: 'x-api-key',
        in: 'header',
        description: 'API Key para seguridad adicional: riwi_api_key_2024_empleo_vacantes',
      },
      'api-key', // Nombre de referencia
    )
    // Agregar servidor de desarrollo
    .addServer('http://localhost:3000', 'Servidor de Desarrollo')
    .build();
    
  // Generar documento de Swagger
  const document = SwaggerModule.createDocument(app, config);
  
  // Configurar endpoint de documentación
  SwaggerModule.setup('api/docs', app, document, {
    swaggerOptions: {
      // Mantener autorización entre recargas
      persistAuthorization: true,
      // Mostrar modelos en la documentación
      defaultModelsExpandDepth: 1,
      // Expandir operaciones por defecto
      docExpansion: 'list',
      // Filtro de operaciones
      filter: true,
      // Mostrar extensiones de vendor
      showExtensions: true,
    },
    customSiteTitle: 'API Empleabilidad RIWI - Documentación',
    customfavIcon: 'https://riwi.io/favicon.ico',
  });
  
  // Obtener puerto de variables de entorno o usar 3000 por defecto
  const port = process.env.APP_PORT || 3000;
  
  // Iniciar servidor
  await app.listen(port);
  
  // Mostrar información de inicio en consola
  console.log('\n🎉 ===== APLICACIÓN INICIADA EXITOSAMENTE =====');
  console.log(`🚀 Servidor: http://localhost:${port}`);
  console.log(`📚 Swagger: http://localhost:${port}/api/docs`);
  console.log('🔐 Seguridad: JWT en cookies HttpOnly');
  console.log('🔑 API Key: riwi_api_key_2024_empleo_vacantes');
  console.log('📧 Admin: admin@riwi.io / admin123');
  console.log('📧 Gestor: gestor@riwi.io / admin123');
  console.log('===============================================\n');
}

// Ejecutar aplicación y manejar errores
bootstrap().catch((error) => {
  console.error('❌ Error al iniciar la aplicación:', error);
  process.exit(1);
});
