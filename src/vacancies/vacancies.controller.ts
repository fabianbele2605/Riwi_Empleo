import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  ValidationPipe,
  ParseIntPipe,
  HttpCode,
  HttpStatus,
  NotFoundException
} from '@nestjs/common';
import { 
  ApiTags, 
  ApiOperation, 
  ApiResponse, 
  ApiSecurity, 
  ApiBearerAuth,
  ApiParam,
  ApiBody
} from '@nestjs/swagger';
import { VacanciesService } from './vacancies.service';
import { CreateVacancyDto } from './dto/create-vacancy.dto';
import { UpdateVacancyDto } from './dto/update-vacancy.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { ApiKeyGuard } from '../auth/guards/api-key.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '../users/entities/user.entity';

/**
 * Controlador de vacantes laborales
 * Maneja todas las operaciones CRUD de vacantes
 * Implementa control de acceso basado en roles:
 * - ADMIN: Acceso total (crear, leer, actualizar, eliminar)
 * - GESTOR: Crear, leer, actualizar, activar/desactivar
 * - CODER: Solo leer vacantes activas
 * 
 * Todos los endpoints requieren autenticación JWT + API Key
 */
@ApiTags('Vacantes')
@ApiSecurity('api-key')
@ApiBearerAuth('JWT-auth')
@Controller('vacancies')
export class VacanciesController {
  constructor(private readonly vacanciesService: VacanciesService) {}

  /**
   * Crea una nueva vacante laboral
   * Solo accesible por usuarios ADMIN y GESTOR
   * La vacante se crea activa por defecto
   */
  @Post()
  @UseGuards(ApiKeyGuard, JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.GESTOR) // Solo ADMIN y GESTOR pueden crear
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ 
    summary: 'Crear nueva vacante',
    description: 'Crea una nueva vacante laboral. Solo ADMIN y GESTOR.' 
  })
  @ApiBody({ 
    type: CreateVacancyDto,
    description: 'Datos de la vacante a crear' 
  })
  @ApiResponse({ 
    status: 201, 
    description: 'Vacante creada exitosamente' 
  })
  @ApiResponse({ 
    status: 403, 
    description: 'Sin permisos para crear vacantes' 
  })
  @ApiResponse({ 
    status: 401, 
    description: 'No autenticado' 
  })
  @ApiResponse({ 
    status: 400, 
    description: 'Datos de entrada inválidos' 
  })
  async create(@Body(ValidationPipe) createVacancyDto: CreateVacancyDto) {
    return this.vacanciesService.create(createVacancyDto);
  }

  /**
   * Obtiene todas las vacantes activas (endpoint público)
   * Accesible sin autenticación para la página principal
   * Solo muestra vacantes con isActive=true
   */
  @Get('public')
  @UseGuards() // Sin guards - completamente público
  @ApiOperation({ 
    summary: 'Listar vacantes activas (público)',
    description: 'Obtiene todas las vacantes activas para mostrar en la homepage' 
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Lista de vacantes activas' 
  })
  async findAllPublic() {
    return this.vacanciesService.findAll();
  }

  /**
   * Obtiene todas las vacantes activas
   * Accesible por todos los usuarios autenticados
   * Solo muestra vacantes con isActive=true
   */
  @Get()
  @UseGuards(ApiKeyGuard, JwtAuthGuard)
  @ApiOperation({ 
    summary: 'Listar vacantes activas',
    description: 'Obtiene todas las vacantes activas ordenadas por fecha' 
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Lista de vacantes activas' 
  })
  @ApiResponse({ 
    status: 401, 
    description: 'No autenticado' 
  })
  async findAll() {
    return this.vacanciesService.findAll();
  }

  /**
   * Obtiene una vacante específica por ID
   * Accesible por todos los usuarios autenticados
   */
  @Get(':id')
  @UseGuards(ApiKeyGuard, JwtAuthGuard)
  @ApiOperation({ 
    summary: 'Obtener vacante por ID',
    description: 'Obtiene los detalles de una vacante específica' 
  })
  @ApiParam({ 
    name: 'id', 
    description: 'ID de la vacante', 
    example: 1 
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Detalles de la vacante' 
  })
  @ApiResponse({ 
    status: 404, 
    description: 'Vacante no encontrada' 
  })
  @ApiResponse({ 
    status: 401, 
    description: 'No autenticado' 
  })
  async findOne(@Param('id', ParseIntPipe) id: number) {
    const vacancy = await this.vacanciesService.findById(id);
    if (!vacancy) {
      throw new NotFoundException('Vacancy not found');
    }
    return vacancy;
  }

  /**
   * Actualiza una vacante existente
   * Solo accesible por usuarios ADMIN y GESTOR
   */
  @Patch(':id')
  @UseGuards(ApiKeyGuard, JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.GESTOR) // Solo ADMIN y GESTOR pueden actualizar
  @ApiOperation({ 
    summary: 'Actualizar vacante',
    description: 'Actualiza los datos de una vacante existente. Solo ADMIN y GESTOR.' 
  })
  @ApiParam({ 
    name: 'id', 
    description: 'ID de la vacante a actualizar', 
    example: 1 
  })
  @ApiBody({ 
    type: UpdateVacancyDto,
    description: 'Datos a actualizar' 
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Vacante actualizada exitosamente' 
  })
  @ApiResponse({ 
    status: 404, 
    description: 'Vacante no encontrada' 
  })
  @ApiResponse({ 
    status: 403, 
    description: 'Sin permisos para actualizar vacantes' 
  })
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body(ValidationPipe) updateVacancyDto: UpdateVacancyDto,
  ) {
    return this.vacanciesService.update(id, updateVacancyDto);
  }

  /**
   * Activa o desactiva una vacante
   * Solo accesible por usuarios ADMIN y GESTOR
   * Alterna el estado isActive de la vacante
   */
  @Patch(':id/toggle-active')
  @UseGuards(ApiKeyGuard, JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.GESTOR) // Solo ADMIN y GESTOR pueden activar/desactivar
  @ApiOperation({ 
    summary: 'Activar/Desactivar vacante',
    description: 'Alterna el estado activo de una vacante. Solo ADMIN y GESTOR.' 
  })
  @ApiParam({ 
    name: 'id', 
    description: 'ID de la vacante', 
    example: 1 
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Estado de vacante actualizado' 
  })
  @ApiResponse({ 
    status: 404, 
    description: 'Vacante no encontrada' 
  })
  @ApiResponse({ 
    status: 403, 
    description: 'Sin permisos para modificar vacantes' 
  })
  async toggleActive(@Param('id', ParseIntPipe) id: number) {
    return this.vacanciesService.toggleActive(id);
  }

  /**
   * Elimina una vacante (soft delete)
   * Solo accesible por usuarios ADMIN
   * No eliminación física, mantiene integridad referencial
   */
  @Delete(':id')
  @UseGuards(ApiKeyGuard, JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN) // Solo ADMIN puede eliminar
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ 
    summary: 'Eliminar vacante',
    description: 'Elimina una vacante (soft delete). Solo ADMIN.' 
  })
  @ApiParam({ 
    name: 'id', 
    description: 'ID de la vacante a eliminar', 
    example: 1 
  })
  @ApiResponse({ 
    status: 204, 
    description: 'Vacante eliminada exitosamente' 
  })
  @ApiResponse({ 
    status: 404, 
    description: 'Vacante no encontrada' 
  })
  @ApiResponse({ 
    status: 403, 
    description: 'Sin permisos para eliminar vacantes' 
  })
  async remove(@Param('id', ParseIntPipe) id: number) {
    await this.vacanciesService.remove(id);
  }
}
