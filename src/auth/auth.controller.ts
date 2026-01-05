import { 
  Controller, 
  Post, 
  Body, 
  UseGuards, 
  ValidationPipe,
  HttpCode,
  HttpStatus,
  Res,
  Req
} from '@nestjs/common';
import type { Response, Request } from 'express';
import { ApiTags, ApiOperation, ApiResponse, ApiSecurity, ApiBody } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { ApiKeyGuard } from './guards/api-key.guard';

/**
 * Controlador de autenticación con cookies seguras
 * Maneja el registro y login de usuarios
 * Implementa cookies HttpOnly para mayor seguridad del JWT
 * 
 * Seguridad implementada:
 * - JWT almacenado en cookie HttpOnly (no accesible desde JavaScript)
 * - Cookie con flag Secure (solo HTTPS en producción)
 * - Cookie con SameSite para prevenir CSRF
 * - Expiración automática de cookies
 * 
 * Endpoints disponibles:
 * - POST /auth/register - Registro de nuevos usuarios
 * - POST /auth/login - Autenticación de usuarios existentes
 * - POST /auth/logout - Cerrar sesión (limpiar cookie)
 */
@ApiTags('Autenticación')
@ApiSecurity('api-key')
@Controller('auth')
@UseGuards(ApiKeyGuard) // Proteger todos los endpoints con API Key
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  /**
   * Registra un nuevo usuario en el sistema
   * - Crea usuario con rol CODER por defecto
   * - Hashea la contraseña con bcrypt
   * - Establece JWT en cookie HttpOnly segura
   * - Valida que el email sea único
   */
  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ 
    summary: 'Registrar nuevo usuario',
    description: 'Crea un nuevo usuario con rol CODER y establece cookie de autenticación segura' 
  })
  @ApiBody({ 
    type: RegisterDto,
    description: 'Datos del usuario a registrar' 
  })
  @ApiResponse({ 
    status: 201, 
    description: 'Usuario registrado exitosamente. JWT establecido en cookie segura.',
    schema: {
      type: 'object',
      properties: {
        success: { type: 'boolean', example: true },
        data: {
          type: 'object',
          properties: {
            user: {
              type: 'object',
              properties: {
                id: { type: 'number', example: 1 },
                name: { type: 'string', example: 'Juan Pérez' },
                email: { type: 'string', example: 'juan@email.com' },
                role: { type: 'string', example: 'coder' }
              }
            }
          }
        },
        message: { type: 'string', example: 'Usuario registrado exitosamente' }
      }
    }
  })
  @ApiResponse({ 
    status: 409, 
    description: 'Email ya existe en el sistema' 
  })
  @ApiResponse({ 
    status: 400, 
    description: 'Datos de entrada inválidos' 
  })
  @ApiResponse({ 
    status: 401, 
    description: 'API Key inválida o faltante' 
  })
  async register(
    @Body(ValidationPipe) registerDto: RegisterDto,
    @Res({ passthrough: true }) response: Response
  ) {
    const result = await this.authService.register(registerDto);
    
    // Establecer JWT en cookie HttpOnly segura
    this.setSecureCookie(response, result.access_token);
    
    // Retornar solo datos del usuario (sin token en el body)
    return {
      user: result.user
    };
  }

  /**
   * Autentica un usuario existente
   * - Valida credenciales (email y contraseña)
   * - Compara contraseña con hash almacenado
   * - Establece JWT en cookie HttpOnly segura
   */
  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ 
    summary: 'Iniciar sesión',
    description: 'Autentica usuario y establece cookie de autenticación segura' 
  })
  @ApiBody({ 
    type: LoginDto,
    description: 'Credenciales de acceso' 
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Login exitoso. JWT establecido en cookie segura.',
    schema: {
      type: 'object',
      properties: {
        success: { type: 'boolean', example: true },
        data: {
          type: 'object',
          properties: {
            user: {
              type: 'object',
              properties: {
                id: { type: 'number', example: 1 },
                name: { type: 'string', example: 'Administrador' },
                email: { type: 'string', example: 'admin@riwi.io' },
                role: { type: 'string', example: 'admin' }
              }
            }
          }
        },
        message: { type: 'string', example: 'Login exitoso' }
      }
    }
  })
  @ApiResponse({ 
    status: 401, 
    description: 'Credenciales inválidas' 
  })
  @ApiResponse({ 
    status: 400, 
    description: 'Datos de entrada inválidos' 
  })
  async login(
    @Body(ValidationPipe) loginDto: LoginDto,
    @Res({ passthrough: true }) response: Response
  ) {
    const result = await this.authService.login(loginDto);
    
    // Establecer JWT en cookie HttpOnly segura
    this.setSecureCookie(response, result.access_token);
    
    // Retornar solo datos del usuario (sin token en el body)
    return {
      user: result.user
    };
  }

  /**
   * Cierra la sesión del usuario
   * - Limpia la cookie de autenticación
   * - Invalida el token JWT del lado del cliente
   */
  @Post('logout')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ 
    summary: 'Cerrar sesión',
    description: 'Limpia la cookie de autenticación y cierra la sesión' 
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Sesión cerrada exitosamente' 
  })
  async logout(@Res({ passthrough: true }) response: Response) {
    // Limpiar cookie de autenticación
    response.clearCookie('access_token', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      path: '/'
    });
    
    return {
      message: 'Sesión cerrada exitosamente'
    };
  }

  /**
   * Método privado para establecer cookie JWT segura
   * 
   * Configuración de seguridad:
   * - httpOnly: true - No accesible desde JavaScript (previene XSS)
   * - secure: true en producción - Solo HTTPS
   * - sameSite: 'strict' - Previene ataques CSRF
   * - maxAge: 7 días - Expiración automática
   * 
   * @param response - Objeto Response de Express
   * @param token - JWT token a almacenar
   */
  private setSecureCookie(response: Response, token: string) {
    const isProduction = process.env.NODE_ENV === 'production';
    
    response.cookie('access_token', token, {
      // Cookie HttpOnly - no accesible desde JavaScript
      httpOnly: true,
      // Secure solo en producción (requiere HTTPS)
      secure: isProduction,
      // SameSite strict para prevenir CSRF
      sameSite: 'strict',
      // Expiración de 7 días (igual que el JWT)
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 días en milisegundos
      // Path donde la cookie es válida
      path: '/'
    });
  }
}
