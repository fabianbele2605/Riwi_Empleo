import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  ArrowLeft, 
  MapPin, 
  Clock, 
  DollarSign, 
  Building2,
  Calendar,
  Users,
  CheckCircle,
  Gift,
  Edit,
  Trash2,
  Share2
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useVacancyStore } from '@/stores/vacancyStore';
import { useApplicationStore } from '@/stores/applicationStore';
import { useAuthStore } from '@/stores/authStore';
import { useToast } from '@/hooks/use-toast';

const typeLabels = {
  remote: 'Remoto',
  hybrid: 'Híbrido',
  onsite: 'Presencial',
};

export default function VacancyDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const { selectedVacancy, fetchVacancyById, isLoading, deleteVacancy } = useVacancyStore();
  const { hasApplied, canApply, applyToVacancy } = useApplicationStore();
  const { user } = useAuthStore();
  
  const [isApplying, setIsApplying] = useState(false);

  useEffect(() => {
    if (id) {
      fetchVacancyById(id);
    }
  }, [id, fetchVacancyById]);

  const handleApply = async () => {
    if (!user || !id) return;
    
    setIsApplying(true);
    const success = await applyToVacancy(parseInt(id));
    setIsApplying(false);
    
    if (success) {
      toast({
        title: '¡Postulación enviada!',
        description: 'Tu postulación ha sido registrada exitosamente.',
      });
      // Refrescar la vacante para actualizar el contador
      fetchVacancyById(id);
    } else {
      toast({
        title: 'Error',
        description: 'No se pudo enviar tu postulación.',
        variant: 'destructive',
      });
    }
  };

  const handleDelete = async () => {
    if (!id) return;
    
    if (window.confirm('¿Estás seguro de eliminar esta vacante?')) {
      await deleteVacancy(id);
      toast({
        title: 'Vacante eliminada',
        description: 'La vacante ha sido eliminada correctamente.',
      });
      navigate('/dashboard/vacancies');
    }
  };

  const canManage = user?.role === 'ADMIN' || user?.role === 'GESTOR';
  const alreadyApplied = user && id ? hasApplied(id) : false;
  const userCanApply = user?.role === 'CODER' && canApply();

  if (isLoading || !selectedVacancy) {
    return (
      <div className="space-y-6">
        <div className="h-8 bg-muted rounded w-32 animate-pulse" />
        <div className="bg-card rounded-2xl p-8 animate-pulse">
          <div className="flex gap-6">
            <div className="w-20 h-20 rounded-xl bg-muted" />
            <div className="flex-1 space-y-3">
              <div className="h-8 bg-muted rounded w-3/4" />
              <div className="h-5 bg-muted rounded w-1/2" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Back Button */}
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
      >
        <ArrowLeft className="w-5 h-5" />
        Volver
      </button>

      {/* Header Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-card rounded-2xl p-6 sm:p-8 shadow-card border border-border/50"
      >
        <div className="flex flex-col sm:flex-row sm:items-start gap-6">
          <div className="w-20 h-20 rounded-xl bg-primary/10 flex items-center justify-center text-primary font-bold text-2xl shrink-0">
            {selectedVacancy.company.slice(0, 2).toUpperCase()}
          </div>
          
          <div className="flex-1">
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
              <div>
                <h1 className="text-2xl sm:text-3xl font-display font-bold text-foreground">
                  {selectedVacancy.title}
                </h1>
                <div className="flex items-center gap-2 text-muted-foreground mt-2">
                  <Building2 className="w-5 h-5" />
                  <span className="text-lg">{selectedVacancy.company}</span>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="icon">
                  <Share2 className="w-5 h-5" />
                </Button>
                
                {canManage && (
                  <>
                    <Link to={`/dashboard/vacancies/${id}/edit`}>
                      <Button variant="outline" size="icon">
                        <Edit className="w-5 h-5" />
                      </Button>
                    </Link>
                    <Button variant="destructive" size="icon" onClick={handleDelete}>
                      <Trash2 className="w-5 h-5" />
                    </Button>
                  </>
                )}
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-4 mt-6 text-muted-foreground">
              <span className="flex items-center gap-2 px-3 py-1.5 bg-muted rounded-lg">
                <MapPin className="w-4 h-4" />
                {selectedVacancy.location}
              </span>
              <span className="flex items-center gap-2 px-3 py-1.5 bg-muted rounded-lg">
                <Clock className="w-4 h-4" />
                {typeLabels[selectedVacancy.type]}
              </span>
              <span className="flex items-center gap-2 px-3 py-1.5 bg-muted rounded-lg">
                <DollarSign className="w-4 h-4" />
                {selectedVacancy.salary.range || `$${selectedVacancy.salary.min.toLocaleString()} - $${selectedVacancy.salary.max.toLocaleString()} ${selectedVacancy.salary.currency}`}
              </span>
              <span className="flex items-center gap-2 px-3 py-1.5 bg-muted rounded-lg">
                <Calendar className="w-4 h-4" />
                {new Date(selectedVacancy.createdAt).toLocaleDateString()}
              </span>
              <span className="flex items-center gap-2 px-3 py-1.5 bg-muted rounded-lg">
                <Users className="w-4 h-4" />
                {selectedVacancy.applicationsCount} postulaciones
              </span>
            </div>
          </div>
        </div>

        {/* Apply Button */}
        <div className="mt-8 pt-6 border-t border-border">
          {alreadyApplied ? (
            <Button size="lg" disabled className="w-full sm:w-auto">
              <CheckCircle className="w-5 h-5 mr-2" />
              Ya has aplicado a esta vacante
            </Button>
          ) : selectedVacancy.status === 'ACTIVE' && userCanApply ? (
            <Button size="lg" onClick={handleApply} disabled={isApplying} className="w-full sm:w-auto">
              {isApplying ? 'Enviando...' : 'Aplicar a esta vacante'}
            </Button>
          ) : selectedVacancy.status !== 'ACTIVE' ? (
            <Button size="lg" disabled className="w-full sm:w-auto">
              Vacante no disponible
            </Button>
          ) : !userCanApply && user?.role === 'CODER' ? (
            <Button size="lg" disabled className="w-full sm:w-auto">
              Límite de postulaciones alcanzado (3/3)
            </Button>
          ) : user?.role !== 'CODER' ? (
            <Button size="lg" disabled className="w-full sm:w-auto">
              Solo los CODERS pueden aplicar
            </Button>
          ) : null}
        </div>
      </motion.div>

      {/* Content */}
      <div className="grid lg:grid-cols-3 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="lg:col-span-2 space-y-6"
        >
          {/* Description */}
          <div className="bg-card rounded-2xl p-6 shadow-card border border-border/50">
            <h2 className="text-xl font-semibold text-foreground mb-4">Descripción</h2>
            <p className="text-muted-foreground leading-relaxed whitespace-pre-line">
              {selectedVacancy.description}
            </p>
          </div>

          {/* Requirements */}
          <div className="bg-card rounded-2xl p-6 shadow-card border border-border/50">
            <h2 className="text-xl font-semibold text-foreground mb-4">Requisitos</h2>
            <ul className="space-y-3">
              {selectedVacancy.requirements.map((req, index) => (
                <li key={index} className="flex items-start gap-3 text-muted-foreground">
                  <CheckCircle className="w-5 h-5 text-success shrink-0 mt-0.5" />
                  {req}
                </li>
              ))}
            </ul>
          </div>
        </motion.div>

        {/* Sidebar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="space-y-6"
        >
          {/* Benefits */}
          <div className="bg-card rounded-2xl p-6 shadow-card border border-border/50">
            <h2 className="text-xl font-semibold text-foreground mb-4 flex items-center gap-2">
              <Gift className="w-5 h-5 text-primary" />
              Beneficios
            </h2>
            <ul className="space-y-3">
              {selectedVacancy.benefits.map((benefit, index) => (
                <li key={index} className="flex items-start gap-3 text-muted-foreground">
                  <span className="w-2 h-2 rounded-full bg-primary shrink-0 mt-2" />
                  {benefit}
                </li>
              ))}
            </ul>
          </div>

          {/* Company Info */}
          <div className="bg-card rounded-2xl p-6 shadow-card border border-border/50">
            <h2 className="text-xl font-semibold text-foreground mb-4">Sobre la empresa</h2>
            <div className="flex items-center gap-4 mb-4">
              <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center text-primary font-bold text-lg">
                {selectedVacancy.company.slice(0, 2).toUpperCase()}
              </div>
              <div>
                <p className="font-semibold text-foreground">{selectedVacancy.company}</p>
                <p className="text-sm text-muted-foreground">Tecnología</p>
              </div>
            </div>
            <p className="text-sm text-muted-foreground">
              Empresa líder en el sector tecnológico con presencia en Latinoamérica.
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
