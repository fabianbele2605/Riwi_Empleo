import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import type { Request } from 'express';
import { UsersService } from '../../users/users.service';

/**
 * Estrategia JWT para autenticación con Passport
 * Valida tokens JWT desde cookies HttpOnly seguras
 * 
 * Funcionamiento:
 * 1. Extrae el token JWT de la cookie 'access_token' (HttpOnly)
 * 2. Fallback: Extrae del header Authorization si no hay cookie
 * 3. Verifica la firma del token usando la clave secreta
 * 4. Decodifica el payload del token
 * 5. Ejecuta el método validate() con el payload
 * 6. El resultado se almacena en req.user para uso posterior
 * 
 * Configuración de seguridad:
 * - Prioridad: Cookie HttpOnly > Authorization header
 * - ignoreExpiration: false (verifica expiración del token)
 * - secretOrKey: Clave secreta desde variables de entorno
 * 
 * Seguridad mejorada:
 * - Cookies HttpOnly previenen acceso desde JavaScript (XSS)
 * - Tokens con expiración de 7 días
 * - Verificación automática de firma
 * - Payload contiene: id, email, role del usuario
 */
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private configService: ConfigService,
    private usersService: UsersService,
  ) {
    super({
      // Función personalizada para extraer JWT
      jwtFromRequest: ExtractJwt.fromExtractors([
        // 1. Prioridad: Extraer de cookie HttpOnly
        JwtStrategy.extractJWTFromCookie,
        // 2. Fallback: Extraer del header Authorization
        ExtractJwt.fromAuthHeaderAsBearerToken(),
      ]),
      // Verificar expiración del token
      ignoreExpiration: false,
      // Clave secreta para verificar firma del token
      secretOrKey: configService.get<string>('JWT_SECRET')!,
    } as any); // Casting para evitar problemas de tipos de TypeScript
  }

  /**
   * Extractor personalizado para JWT desde cookies
   * 
   * Seguridad:
   * - Lee cookie 'access_token' establecida como HttpOnly
   * - Previene acceso desde JavaScript del lado cliente
   * - Protección adicional contra ataques XSS
   * 
   * @param request - Objeto Request de Express
   * @returns JWT token desde cookie o null si no existe
   */
  private static extractJWTFromCookie(request: Request): string | null {
    if (request.cookies && 'access_token' in request.cookies) {
      return request.cookies.access_token;
    }
    return null;
  }

  /**
   * Método ejecutado después de validar el token JWT
   * El payload contiene la información decodificada del token
   * 
   * @param payload - Contenido decodificado del JWT token
   * @param payload.sub - ID del usuario (subject)
   * @param payload.email - Email del usuario
   * @param payload.role - Rol del usuario (admin, gestor, coder)
   * @returns Objeto usuario que se almacenará en req.user
   */
  async validate(payload: any) {
    // Retornar información del usuario para req.user
    // Esta información estará disponible en todos los endpoints protegidos
    return {
      id: payload.sub,      // ID del usuario
      email: payload.email, // Email del usuario
      role: payload.role,   // Rol del usuario
    };
  }
}