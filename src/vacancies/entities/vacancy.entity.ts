import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, DeleteDateColumn, OneToMany } from "typeorm";

/**
 * Enum que define las modalidades de trabajo disponibles
 * - remote: Trabajo 100% remoto
 * - office: Trabajo presencial en oficina
 * - hybrid: Modalidad híbrida (remoto + presencial)
 */
export enum enumModality {
    remote = "remote",
    office = "office",
    hybrid = "hybrid"
}

/**
 * Entidad Vacancy - Representa las vacantes laborales del sistema
 * Contiene toda la información necesaria para las ofertas de empleo
 * Implementa soft delete y control de estado activo/inactivo
 * 
 * Relaciones:
 * - OneToMany con Application (postulaciones a esta vacante)
 */
@Entity()
export class Vacancy {
    /**
     * Identificador único de la vacante
     * Generado automáticamente por la base de datos
     */
    @PrimaryGeneratedColumn()
    id: number;

    /**
     * Título de la vacante laboral
     * Ejemplo: "Desarrollador Full Stack Senior"
     */
    @Column()
    title: string;

    /**
     * Descripción detallada de la vacante
     * Incluye responsabilidades, requisitos y beneficios
     */
    @Column()
    description: string;

    /**
     * Tecnologías requeridas para la vacante
     * Ejemplo: "React, Node.js, PostgreSQL, Docker"
     * TODO: Considerar relación con entidad Technology separada
     */
    @Column()
    technologies: string;

    /**
     * Nivel de seniority requerido
     * Ejemplo: "Junior", "Semi-Senior", "Senior"
     */
    @Column()
    seniority: string;

    /**
     * Habilidades blandas requeridas
     * Ejemplo: "Trabajo en equipo, Comunicación efectiva"
     */
    @Column()
    softSkills: string;

    /**
     * Ubicación de la vacante
     * Valores permitidos: Medellín, Barranquilla, Bogotá, Cartagena
     */
    @Column()
    location: string;

    /**
     * Modalidad de trabajo
     * Usa enum para garantizar valores válidos
     * Por defecto es "office" (presencial)
     */
    @Column({
        type: "enum",
        enum: enumModality,
        default: enumModality.office,
    })
    modality: enumModality;

    /**
     * Rango salarial ofrecido
     * Formato sugerido: "2M - 3M COP"
     * Almacenado como string para flexibilidad
     */
    @Column()
    salaryRange: string;

    /**
     * Nombre de la empresa que ofrece la vacante
     * Ejemplo: "RIWI", "TechCorp S.A.S"
     */
    @Column()
    company: string;

    /**
     * Número máximo de aspirantes permitidos
     * Regla de negocio: No se permiten postulaciones cuando se alcanza este límite
     * Debe ser mayor a 0 (validado en DTO)
     */
    @Column()
    maxApplicants: number;

    /**
     * Relación OneToMany con las postulaciones a esta vacante
     * Una vacante puede tener múltiples postulaciones
     * Limitado por maxApplicants
     */
    @OneToMany('Application', 'vacancy')
    applications: any[];

    /**
     * Fecha y hora de creación de la vacante
     * Establecida automáticamente por TypeORM
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
     * Permite mantener historial de vacantes
     */
    @DeleteDateColumn()
    deletedAt: Date;

    /**
     * Estado de la vacante (activa/inactiva)
     * - true: Vacante visible y disponible para postulaciones
     * - false: Vacante oculta, no permite nuevas postulaciones
     * Por defecto es true para nuevas vacantes
     */
    @Column({ default: true })
    isActive: boolean;

}