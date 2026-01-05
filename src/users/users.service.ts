import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { UpdateUserDto } from './dto/update-user.dto';

/**
 * Servicio para la gestión de usuarios
 * Maneja todas las operaciones CRUD relacionadas con usuarios
 * Incluye métodos específicos para autenticación y búsquedas
 */
@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  /**
   * Crea un nuevo usuario en la base de datos
   * @param userData - Datos parciales del usuario a crear
   * @returns Promise<User> - Usuario creado con ID asignado
   */
  async create(userData: Partial<User>): Promise<User> {
    const user = this.userRepository.create(userData);
    return this.userRepository.save(user);
  }

  /**
   * Busca un usuario por su email (usado para autenticación)
   * @param email - Email del usuario a buscar
   * @returns Promise<User | null> - Usuario encontrado o null
   */
  async findByEmail(email: string): Promise<User | null> {
    return this.userRepository.findOne({ where: { email } });
  }

  /**
   * Busca un usuario por su ID
   * @param id - ID del usuario a buscar
   * @returns Promise<User | null> - Usuario encontrado o null
   */
  async findById(id: number): Promise<User | null> {
    return this.userRepository.findOne({ where: { id } });
  }

  /**
   * Obtiene todos los usuarios del sistema
   * Solo accesible por usuarios con rol ADMIN
   * @returns Promise<User[]> - Lista de todos los usuarios
   */
  async findAll(): Promise<User[]> {
    return this.userRepository.find();
  }

  /**
   * Actualiza los datos de un usuario existente
   * @param id - ID del usuario a actualizar
   * @param updateUserDto - Datos a actualizar
   * @returns Promise<User | null> - Usuario actualizado o null si no existe
   */
  async update(id: number, updateUserDto: UpdateUserDto): Promise<User | null> {
    await this.userRepository.update(id, updateUserDto);
    return this.findById(id);
  }

  /**
   * Elimina un usuario usando soft delete (no eliminación física)
   * Mantiene el registro en la base de datos pero lo marca como eliminado
   * @param id - ID del usuario a eliminar
   * @returns Promise<void>
   */
  async remove(id: number): Promise<void> {
    await this.userRepository.softDelete(id);
  }
}
