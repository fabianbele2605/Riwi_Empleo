import {Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, DeleteDateColumn, OneToMany } from "typeorm";

/**
 * Enum que define los roles disponibles en el sistema
 * - ADMIN: Acceso total al sistema, puede gestionar usuarios y todas las operaciones
 * - GESTOR: Puede crear/modificar vacantes y ver postulaciones
 * - CODER: Puede postularse a vacantes y ver sus propias postulaciones
 */
export enum UserRole {
    ADMIN = "admin",
    GESTOR = "gestor", 
    CODER = "coder",
}

/**
 * Entidad User - Representa los usuarios del sistema
 * Maneja la autenticación, autorización y datos personales
 * Implementa soft delete para mantener integridad referencial
 * 
 * Relaciones:
 * - OneToMany con Application (postulaciones del usuario)
 */
@Entity()
export class User {
    /**
     * Identificador único del usuario
     * Generado automáticamente por la base de datos
     */
    @PrimaryGeneratedColumn()
    id: number;

    /**
     * Nombre completo del usuario
     * Campo requerido para identificación
     */
    @Column()
    name: string;

    /**
     * Email del usuario - debe ser único en el sistema
     * Usado como identificador para autenticación
     * Validado con formato de email en el DTO
     */
    @Column({unique: true})
    email: string;

    /**
     * Contraseña hasheada con bcrypt
     * Nunca se retorna en las respuestas de la API por seguridad
     * Mínimo 6 caracteres (validado en DTO)
     */
    @Column()
    password: string;

    /**
     * Rol del usuario en el sistema
     * Determina los permisos y accesos disponibles
     * Por defecto se asigna CODER a nuevos registros
     */
   @Column({
        type: "enum",
        enum: UserRole,
        default: UserRole.CODER,
    })
    role: UserRole;

    /**
     * Estado del usuario (activo, inactivo, etc.)
     * Usado para control administrativo
     */
    @Column({ default: 'active' })
    status: string;

    /**
     * Relación OneToMany con las postulaciones del usuario
     * Un usuario puede tener múltiples postulaciones
     * Máximo 3 postulaciones activas según reglas de negocio
     */
    @OneToMany('Application', 'user')
    applications: any[];

    /**
     * Fecha y hora de creación del registro
     * Establecida automáticamente por TypeORM
     */
    @CreateDateColumn()
    created_at: Date;

    /**
     * Fecha y hora de última actualización
     * Actualizada automáticamente por TypeORM en cada modificación
     */
    @UpdateDateColumn()
    updated_at: Date;

    /**
     * Fecha y hora de eliminación lógica (soft delete)
     * Null si el registro está activo
     * Permite mantener integridad referencial
     */
    @DeleteDateColumn()
    deleted_at: Date;


}