import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  UseGuards,
  ValidationPipe,
  ParseIntPipe,
  HttpCode,
  HttpStatus,
  Request
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
import { ApplicationsService } from './applications.service';
import { ApplyVacancyDto } from './dto/apply-vacancy.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { ApiKeyGuard } from '../auth/guards/api-key.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '../users/entities/user.entity';

/**
 * Controlador de postulaciones a vacantes
 * Maneja el proceso de postulación y consulta de aplicaciones
 * Implementa todas las reglas de negocio del sistema:
 * 
 * Reglas implementadas:
 * - Máximo 3 postulaciones activas por usuario CODER
 * - No postulaciones duplicadas a la misma vacante
 * - Verificación de cupos disponibles
 * - Solo usuarios CODER pueden postularse
 * - ADMIN y GESTOR pueden ver todas las postulaciones
 * 
 * Todos los endpoints requieren autenticación JWT + API Key
 */
@ApiTags('Postulaciones')
@ApiSecurity('api-key')
@ApiBearerAuth('JWT-auth')
@Controller('applications')
@UseGuards(ApiKeyGuard, JwtAuthGuard) // API Key + JWT en todos los endpoints
export class ApplicationsController {
  constructor(private readonly applicationsService: ApplicationsService) {}

  /**
   * Permite a un usuario CODER postularse a una vacante
   * Implementa todas las reglas de negocio del sistema
   * El userId se obtiene automáticamente del JWT token
   */
  @Post('apply')
  @UseGuards(RolesGuard)
  @Roles(UserRole.CODER) // Solo CODER puede postularse
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ 
    summary: 'Postularse a una vacante',
    description: 'Permite a un usuario CODER postularse a una vacante. Aplica todas las reglas de negocio.' 
  })
  @ApiBody({ 
    type: ApplyVacancyDto,
    description: 'ID de la vacante a la que se postula' 
  })
  @ApiResponse({ 
    status: 201, 
    description: 'Postulación exitosa' 
  })
  @ApiResponse({ 
    status: 400, 
    description: 'Error en reglas de negocio (ya postulado, sin cupos, límite alcanzado)' 
  })
  @ApiResponse({ 
    status: 404, 
    description: 'Vacante no encontrada o inactiva' 
  })
  @ApiResponse({ 
    status: 403, 
    description: 'Solo usuarios CODER pueden postularse' 
  })
  @ApiResponse({ 
    status: 401, 
    description: 'No autenticado' 
  })
  async apply(
    @Body(ValidationPipe) applyVacancyDto: ApplyVacancyDto,
    @Request() req: any,
  ) {
    const userId = req.user.id; // Obtener ID del usuario autenticado del JWT
    return this.applicationsService.apply(userId, applyVacancyDto);
  }

  /**
   * Obtiene todas las postulaciones del sistema
   * Solo accesible por usuarios ADMIN y GESTOR
   * Incluye información del usuario y vacante relacionados
   */
  @Get()
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.GESTOR) // Solo ADMIN y GESTOR pueden ver todas
  @ApiOperation({ 
    summary: 'Listar todas las postulaciones',
    description: 'Obtiene todas las postulaciones del sistema. Solo ADMIN y GESTOR.' 
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Lista de todas las postulaciones' 
  })
  @ApiResponse({ 
    status: 403, 
    description: 'Sin permisos para ver todas las postulaciones' 
  })
  @ApiResponse({ 
    status: 401, 
    description: 'No autenticado' 
  })
  async findAll() {
    return this.applicationsService.findAll();
  }

  /**
   * Obtiene las postulaciones del usuario autenticado
   * Solo accesible por usuarios CODER
   * Permite ver sus propias postulaciones
   */
  @Get('my-applications')
  @UseGuards(RolesGuard)
  @Roles(UserRole.CODER) // CODER puede ver sus propias postulaciones
  @ApiOperation({ 
    summary: 'Ver mis postulaciones',
    description: 'Obtiene las postulaciones del usuario autenticado. Solo CODER.' 
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Lista de postulaciones del usuario' 
  })
  @ApiResponse({ 
    status: 403, 
    description: 'Solo usuarios CODER pueden ver sus postulaciones' 
  })
  @ApiResponse({ 
    status: 401, 
    description: 'No autenticado' 
  })
  async findMyApplications(@Request() req: any) {
    const userId = req.user.id;
    return this.applicationsService.findByUser(userId);
  }

  /**
   * Obtiene las postulaciones para una vacante específica
   * Solo accesible por usuarios ADMIN y GESTOR
   * Usado para revisar candidatos de una vacante
   */
  @Get('vacancy/:vacancyId')
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.GESTOR) // Solo ADMIN y GESTOR pueden ver postulaciones por vacante
  @ApiOperation({ 
    summary: 'Ver postulaciones por vacante',
    description: 'Obtiene todas las postulaciones para una vacante específica. Solo ADMIN y GESTOR.' 
  })
  @ApiParam({ 
    name: 'vacancyId', 
    description: 'ID de la vacante', 
    example: 1 
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Lista de postulaciones para la vacante' 
  })
  @ApiResponse({ 
    status: 403, 
    description: 'Sin permisos para ver postulaciones por vacante' 
  })
  @ApiResponse({ 
    status: 401, 
    description: 'No autenticado' 
  })
  async findByVacancy(@Param('vacancyId', ParseIntPipe) vacancyId: number) {
    return this.applicationsService.findByVacancy(vacancyId);
  }

  /**
   * Elimina una postulación (soft delete)
   * Solo accesible por usuarios ADMIN
   * Mantiene integridad referencial en la base de datos
   */
  @Delete(':id')
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN) // Solo ADMIN puede eliminar postulaciones
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ 
    summary: 'Eliminar postulación',
    description: 'Elimina una postulación (soft delete). Solo ADMIN.' 
  })
  @ApiParam({ 
    name: 'id', 
    description: 'ID de la postulación a eliminar', 
    example: 1 
  })
  @ApiResponse({ 
    status: 204, 
    description: 'Postulación eliminada exitosamente' 
  })
  @ApiResponse({ 
    status: 404, 
    description: 'Postulación no encontrada' 
  })
  @ApiResponse({ 
    status: 403, 
    description: 'Sin permisos para eliminar postulaciones' 
  })
  @ApiResponse({ 
    status: 401, 
    description: 'No autenticado' 
  })
  async remove(@Param('id', ParseIntPipe) id: number) {
    await this.applicationsService.remove(id);
  }
}
