import { Injectable, UnauthorizedException, ConflictException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import * as bcrypt from 'bcrypt';

/**
 * Servicio de autenticación y autorización
 * Maneja el registro de usuarios, login y generación de tokens JWT
 * Implementa hash de contraseñas con bcrypt para seguridad
 */
@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  /**
   * Registra un nuevo usuario en el sistema
   * - Verifica que el email no exista
   * - Hashea la contraseña con bcrypt
   * - Asigna rol CODER por defecto
   * - Genera token JWT automáticamente
   * @param registerDto - Datos de registro (name, email, password)
   * @returns Promise<{access_token: string, user: object}> - Token y datos del usuario
   * @throws ConflictException si el email ya existe
   */
  async register(registerDto: RegisterDto) {
    const { name, email, password } = registerDto;

    // Verificar si el usuario ya existe
    const existingUser = await this.usersService.findByEmail(email);
    if (existingUser) {
      throw new ConflictException('Email already exists');
    }

    // Hash de la contraseña con salt de 10 rounds para seguridad
    const hashedPassword = await bcrypt.hash(password, 10);

    // Crear usuario con rol CODER por defecto
    const user = await this.usersService.create({
      name,
      email,
      password: hashedPassword,
    });

    // Generar token JWT con información del usuario
    const payload = { email: user.email, sub: user.id, role: user.role };
    const token = this.jwtService.sign(payload);

    return {
      access_token: token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    };
  }

  /**
   * Autentica un usuario existente
   * - Verifica que el usuario exista
   * - Compara la contraseña con el hash almacenado
   * - Genera nuevo token JWT si las credenciales son válidas
   * @param loginDto - Credenciales de login (email, password)
   * @returns Promise<{access_token: string, user: object}> - Token y datos del usuario
   * @throws UnauthorizedException si las credenciales son inválidas
   */
  async login(loginDto: LoginDto) {
    const { email, password } = loginDto;

    // Buscar usuario por email
    const user = await this.usersService.findByEmail(email);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Verificar contraseña usando bcrypt
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Generar nuevo token JWT
    const payload = { email: user.email, sub: user.id, role: user.role };
    const token = this.jwtService.sign(payload);

    return {
      access_token: token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    };
  }
}
