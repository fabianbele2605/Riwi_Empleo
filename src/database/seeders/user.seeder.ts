import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User, UserRole } from '../../users/entities/user.entity';
import * as bcrypt from 'bcrypt';

/**
 * Seeder para crear usuarios administrativos del sistema
 * 
 * Propósito:
 * - Crear usuarios ADMIN y GESTOR necesarios para el funcionamiento del sistema
 * - Estos roles no pueden ser asignados mediante registro normal
 * - Solo se ejecuta si no existen usuarios ADMIN previamente
 * 
 * Usuarios creados:
 * - Administrador: Acceso total al sistema
 * - Gestor: Puede crear/modificar vacantes y ver postulaciones
 * 
 * Seguridad:
 * - Contraseñas hasheadas con bcrypt (10 rounds)
 * - Verificación de existencia antes de crear
 * - Emails únicos del dominio @riwi.io
 * 
 * Uso:
 * npm run seed
 */
@Injectable()
export class UserSeeder {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  /**
   * Ejecuta el seeding de usuarios administrativos
   * 
   * Proceso:
   * 1. Verifica si ya existe un usuario ADMIN
   * 2. Si no existe, crea usuarios ADMIN y GESTOR
   * 3. Hashea las contraseñas con bcrypt
   * 4. Guarda los usuarios en la base de datos
   * 5. Muestra las credenciales en consola
   * 
   * @returns Promise<void>
   */
  async seed() {
    // Verificar si ya existen usuarios admin para evitar duplicados
    const existingAdmin = await this.userRepository.findOne({
      where: { role: UserRole.ADMIN },
    });

    if (existingAdmin) {
      console.log('✅ Admin user already exists, skipping seed...');
      return;
    }

    // Hashear contraseña con bcrypt (10 rounds para seguridad)
    const hashedPassword = await bcrypt.hash('admin123', 10);

    // Crear usuario ADMIN con acceso total al sistema
    const adminUser = this.userRepository.create({
      name: 'Administrador',
      email: 'admin@riwi.io',
      password: hashedPassword,
      role: UserRole.ADMIN,
      status: 'active',
    });

    // Crear usuario GESTOR para manejo de vacantes
    const gestorUser = this.userRepository.create({
      name: 'Gestor de Empleabilidad',
      email: 'gestor@riwi.io',
      password: hashedPassword,
      role: UserRole.GESTOR,
      status: 'active',
    });

    // Guardar ambos usuarios en la base de datos
    await this.userRepository.save([adminUser, gestorUser]);

    // Mostrar credenciales para acceso inicial
    console.log('🌱 ===== USUARIOS ADMINISTRATIVOS CREADOS =====');
    console.log('📧 Admin: admin@riwi.io / admin123');
    console.log('📧 Gestor: gestor@riwi.io / admin123');
    console.log('🔑 API Key: riwi_api_key_2024_empleo_vacantes');
    console.log('📚 Swagger: http://localhost:3000/api/docs');
    console.log('===============================================');
  }
}