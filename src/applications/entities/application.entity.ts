import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, DeleteDateColumn, Unique, ManyToOne, JoinColumn } from "typeorm";

/**
 * Entidad Application - Representa las postulaciones de usuarios a vacantes
 * Implementa las reglas de negocio del sistema de empleabilidad
 * 
 * Reglas de negocio implementadas:
 * - Un usuario no puede postularse dos veces a la misma vacante (constraint unique)
 * - Máximo 3 postulaciones activas por usuario CODER
 * - Solo se permite postulación si hay cupos disponibles
 * - Solo usuarios CODER pueden postularse
 * 
 * Relaciones:
 * - ManyToOne con User (usuario que se postula)
 * - ManyToOne con Vacancy (vacante a la que se postula)
 */
@Unique(["userId", "vacancyId"]) // Constraint: Un usuario no puede postularse dos veces a la misma vacante
@Entity()
export class Application {
  /**
   * Identificador único de la postulación
   * Generado automáticamente por la base de datos
   */
  @PrimaryGeneratedColumn()
  id: number;

  /**
   * ID del usuario que se postula
   * Referencia a la tabla User
   * Usado en el constraint unique junto con vacancyId
   */
  @Column()
  userId: number;

  /**
   * ID de la vacante a la que se postula
   * Referencia a la tabla Vacancy
   * Usado en el constraint unique junto con userId
   */
  @Column()
  vacancyId: number;

  /**
   * Relación ManyToOne con la entidad User
   * Permite acceder a los datos del usuario que se postuló
   * Configurada con JoinColumn para especificar la clave foránea
   */
  @ManyToOne('User')
  @JoinColumn({ name: "userId" })
  user: any;

  /**
   * Relación ManyToOne con la entidad Vacancy
   * Permite acceder a los datos de la vacante
   * Configurada con JoinColumn para especificar la clave foránea
   */
  @ManyToOne('Vacancy')
  @JoinColumn({ name: "vacancyId" })
  vacancy: any;

  /**
   * Fecha y hora de creación de la postulación
   * Establecida automáticamente por TypeORM
   * Representa el momento exacto de la postulación
   */
  @CreateDateColumn()
  createdAt: Date;

  /**
   * Fecha y hora de última actualización
   * Actualizada automáticamente por TypeORM en cada modificación
   */
  @UpdateDateColumn()
  updatedAt: Date;

  /**
   * Fecha y hora de eliminación lógica (soft delete)
   * Null si el registro está activo
   * Permite mantener historial de postulaciones
   */
  @DeleteDateColumn()
  deletedAt: Date;

}
