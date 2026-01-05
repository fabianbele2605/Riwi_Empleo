import { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Search, 
  MapPin, 
  Clock, 
  DollarSign, 
  Bookmark, 
  Building2,
  Filter,
  ArrowRight,
  Briefcase,
  X
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useVacancyStore } from '@/stores/vacancyStore';
import { useApplicationStore } from '@/stores/applicationStore';
import { useAuthStore } from '@/stores/authStore';
import { Vacancy } from '@/types';
import { useToast } from '@/hooks/use-toast';

const typeLabels = {
  remote: 'Remoto',
  hybrid: 'Híbrido',
  onsite: 'Presencial',
};

const statusColors = {
  ACTIVE: 'bg-success/10 text-success',
  INACTIVE: 'bg-muted text-muted-foreground',
  CLOSED: 'bg-destructive/10 text-destructive',
};

export default function VacancyList() {
  const [searchParams] = useSearchParams();
  const [searchTerm, setSearchTerm] = useState(searchParams.get('search') || '');
  const [typeFilter, setTypeFilter] = useState<string>(searchParams.get('type') || '');
  const [statusFilter, setStatusFilter] = useState<string>(searchParams.get('status') || '');
  const [showFilters, setShowFilters] = useState(false);
  
  const { vacancies, isLoading, fetchVacancies, getFilteredVacancies, setFilters, toggleVacancyStatus } = useVacancyStore();
  const { hasApplied, canApply, applyToVacancy } = useApplicationStore();
  const { user } = useAuthStore();
  const { toast } = useToast();

  useEffect(() => {
    fetchVacancies();
    // Actualizar filtros desde URL
    const search = searchParams.get('search');
    const type = searchParams.get('type');
    const status = searchParams.get('status');
    
    if (search) setSearchTerm(search);
    if (type) setTypeFilter(type);
    if (status) setStatusFilter(status);
  }, [fetchVacancies, searchParams]);

  useEffect(() => {
    setFilters({
      search: searchTerm,
      type: typeFilter as 'REMOTE' | 'HYBRID' | 'ONSITE' | '',
      status: statusFilter as 'ACTIVE' | 'INACTIVE' | '',
    });
  }, [searchTerm, typeFilter, statusFilter, setFilters]);

  const filteredVacancies = getFilteredVacancies();

  const handleApply = async (vacancyId: string) => {
    if (!user) return;
    
    const success = await applyToVacancy(parseInt(vacancyId));
    
    if (success) {
      toast({
        title: '¡Postulación enviada!',
        description: 'Tu postulación ha sido registrada exitosamente.',
      });
      // Refrescar vacantes para actualizar contadores
      fetchVacancies();
    } else {
      toast({
        title: 'Error',
        description: 'No se pudo enviar tu postulación. Verifica el límite.',
        variant: 'destructive',
      });
    }
  };

  const handleToggleStatus = async (id: string) => {
    await toggleVacancyStatus(id);
    toast({
      title: 'Estado actualizado',
      description: 'El estado de la vacante ha sido actualizado.',
    });
  };

  const canManageVacancies = user?.role === 'ADMIN' || user?.role === 'GESTOR';

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-display font-bold text-foreground">Vacantes</h1>
          <p className="text-muted-foreground mt-1">
            {filteredVacancies.length} vacantes encontradas
          </p>
        </div>
        
        {canManageVacancies && (
          <Link to="/dashboard/vacancies/create">
            <Button>
              <Briefcase className="w-4 h-4 mr-2" />
              Nueva Vacante
            </Button>
          </Link>
        )}
      </div>

      {/* Search and Filters */}
      <div className="bg-card rounded-2xl p-4 shadow-card border border-border/50">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Buscar por título, empresa o ubicación..."
              className="pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Button
            variant="outline"
            onClick={() => setShowFilters(!showFilters)}
            className={showFilters ? 'bg-primary text-primary-foreground' : ''}
          >
            <Filter className="w-4 h-4 mr-2" />
            Filtros
          </Button>
        </div>

        {showFilters && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mt-4 pt-4 border-t border-border flex flex-wrap gap-3"
          >
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="px-4 py-2 rounded-lg bg-muted border-0 text-foreground focus:ring-2 focus:ring-primary"
            >
              <option value="">Todos los tipos</option>
              <option value="remote">Remoto</option>
              <option value="hybrid">Híbrido</option>
              <option value="onsite">Presencial</option>
            </select>
            
            {canManageVacancies && (
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-4 py-2 rounded-lg bg-muted border-0 text-foreground focus:ring-2 focus:ring-primary"
              >
                <option value="">Todos los estados</option>
                <option value="ACTIVE">Activas</option>
                <option value="INACTIVE">Inactivas</option>
              </select>
            )}
            
            {(typeFilter || statusFilter) && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setTypeFilter('');
                  setStatusFilter('');
                }}
              >
                <X className="w-4 h-4 mr-1" />
                Limpiar
              </Button>
            )}
          </motion.div>
        )}
      </div>

      {/* Vacancy Grid */}
      {isLoading ? (
        <div className="grid sm:grid-cols-2 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="bg-card rounded-2xl p-6 animate-pulse">
              <div className="flex gap-4">
                <div className="w-14 h-14 rounded-xl bg-muted" />
                <div className="flex-1 space-y-2">
                  <div className="h-5 bg-muted rounded w-3/4" />
                  <div className="h-4 bg-muted rounded w-1/2" />
                </div>
              </div>
              <div className="mt-4 space-y-2">
                <div className="h-4 bg-muted rounded w-full" />
                <div className="h-4 bg-muted rounded w-2/3" />
              </div>
            </div>
          ))}
        </div>
      ) : filteredVacancies.length === 0 ? (
        <div className="text-center py-12">
          <Briefcase className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-foreground">No hay vacantes</h3>
          <p className="text-muted-foreground">No se encontraron vacantes con los filtros aplicados.</p>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 gap-6">
          {filteredVacancies.map((vacancy, index) => (
            <VacancyCard
              key={vacancy.id}
              vacancy={vacancy}
              index={index}
              canApply={user?.role === 'CODER' && canApply()}
              hasApplied={user ? hasApplied(vacancy.id) : false}
              canManage={canManageVacancies}
              onApply={() => handleApply(vacancy.id)}
              onToggleStatus={() => handleToggleStatus(vacancy.id)}
            />
          ))}
        </div>
      )}
    </div>
  );
}

interface VacancyCardProps {
  vacancy: Vacancy;
  index: number;
  canApply: boolean;
  hasApplied: boolean;
  canManage: boolean;
  onApply: () => void;
  onToggleStatus: () => void;
}

function VacancyCard({ 
  vacancy, 
  index, 
  canApply, 
  hasApplied, 
  canManage, 
  onApply,
  onToggleStatus 
}: VacancyCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      className="group bg-card rounded-2xl p-6 shadow-card hover:shadow-card-hover transition-all duration-300 border border-border/50 hover:border-primary/20"
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-start gap-4">
          <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center text-primary font-bold text-lg shrink-0">
            {vacancy.company.slice(0, 2).toUpperCase()}
          </div>
          
          <div className="min-w-0">
            <Link 
              to={`/dashboard/vacancies/${vacancy.id}`}
              className="text-lg font-semibold text-foreground hover:text-primary transition-colors line-clamp-1"
            >
              {vacancy.title}
            </Link>
            <div className="flex items-center gap-2 text-muted-foreground mt-1">
              <Building2 className="w-4 h-4" />
              <span className="text-sm">{vacancy.company}</span>
            </div>
          </div>
        </div>

        <button className="p-2 rounded-lg hover:bg-muted transition-colors text-muted-foreground hover:text-primary">
          <Bookmark className="w-5 h-5" />
        </button>
      </div>

      <div className="flex flex-wrap items-center gap-4 mt-4 text-sm text-muted-foreground">
        <span className="flex items-center gap-1.5">
          <MapPin className="w-4 h-4" />
          {vacancy.location}
        </span>
        <span className="flex items-center gap-1.5">
          <Clock className="w-4 h-4" />
          {typeLabels[vacancy.type]}
        </span>
        <span className="flex items-center gap-1.5">
          <DollarSign className="w-4 h-4" />
          {vacancy.salary.range || `$${vacancy.salary.min.toLocaleString()} - $${vacancy.salary.max.toLocaleString()}`}
        </span>
      </div>

      <p className="text-muted-foreground text-sm mt-4 line-clamp-2">
        {vacancy.description}
      </p>

      <div className="flex flex-wrap gap-2 mt-4">
        {vacancy.requirements.slice(0, 3).map((req) => (
          <span
            key={req}
            className="px-3 py-1 rounded-lg bg-muted text-muted-foreground text-xs font-medium"
          >
            {req}
          </span>
        ))}
        {vacancy.requirements.length > 3 && (
          <span className="px-3 py-1 rounded-lg bg-muted text-muted-foreground text-xs font-medium">
            +{vacancy.requirements.length - 3}
          </span>
        )}
      </div>

      <div className="flex items-center justify-between mt-6 pt-4 border-t border-border/50">
        <div className="flex items-center gap-2">
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColors[vacancy.status]}`}>
            {vacancy.status === 'ACTIVE' ? 'Activa' : vacancy.status === 'INACTIVE' ? 'Inactiva' : 'Cerrada'}
          </span>
          <span className="text-xs text-muted-foreground">
            {vacancy.applicationsCount} postulaciones
          </span>
        </div>

        <div className="flex items-center gap-2">
          {canManage && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onToggleStatus}
            >
              {vacancy.status === 'ACTIVE' ? 'Desactivar' : 'Activar'}
            </Button>
          )}
          
          {hasApplied ? (
            <Button size="sm" variant="secondary" disabled>
              Ya postulado
            </Button>
          ) : vacancy.status === 'ACTIVE' && canApply ? (
            <Button size="sm" onClick={onApply}>
              Aplicar
              <ArrowRight className="w-4 h-4 ml-1" />
            </Button>
          ) : (
            <Link to={`/dashboard/vacancies/${vacancy.id}`}>
              <Button size="sm" variant="outline">
                Ver detalles
              </Button>
            </Link>
          )}
        </div>
      </div>
    </motion.div>
  );
}
