import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FileText, Clock, CheckCircle, XCircle, Eye, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useApplicationStore } from '@/stores/applicationStore';
import { useVacancyStore } from '@/stores/vacancyStore';
import { useAuthStore } from '@/stores/authStore';

const statusConfig = {
  PENDING: { label: 'Pendiente', color: 'bg-secondary/20 text-secondary-foreground', icon: Clock },
  REVIEWING: { label: 'En revisión', color: 'bg-primary/10 text-primary', icon: Eye },
  ACCEPTED: { label: 'Aceptada', color: 'bg-success/10 text-success', icon: CheckCircle },
  REJECTED: { label: 'Rechazada', color: 'bg-destructive/10 text-destructive', icon: XCircle },
};

export default function MyApplications() {
  const { user } = useAuthStore();
  const { myApplications, isLoading, fetchMyApplications } = useApplicationStore();
  const { vacancies, fetchVacancies } = useVacancyStore();

  useEffect(() => {
    fetchMyApplications();
    fetchVacancies();
  }, [fetchMyApplications, fetchVacancies]);

  const applicationCount = myApplications.length;
  const remainingApplications = 3 - applicationCount;

  const getVacancy = (vacancyId: string) => {
    return vacancies.find((v) => v.id === vacancyId);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-display font-bold text-foreground">Mis Postulaciones</h1>
          <p className="text-muted-foreground mt-1">
            Tienes {applicationCount} de 3 postulaciones activas
          </p>
        </div>
        
        {remainingApplications > 0 && (
          <Link to="/dashboard/vacancies">
            <Button>
              <FileText className="w-4 h-4 mr-2" />
              Buscar más vacantes
            </Button>
          </Link>
        )}
      </div>

      {/* Limit Warning */}
      {remainingApplications <= 1 && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className={`flex items-center gap-3 p-4 rounded-xl ${
            remainingApplications === 0 
              ? 'bg-destructive/10 text-destructive' 
              : 'bg-secondary/20 text-secondary-foreground'
          }`}
        >
          <AlertCircle className="w-5 h-5 flex-shrink-0" />
          <p>
            {remainingApplications === 0
              ? 'Has alcanzado el límite de 3 postulaciones. Espera a recibir respuestas.'
              : `Te queda ${remainingApplications} postulación disponible.`}
          </p>
        </motion.div>
      )}

      {/* Applications List */}
      {isLoading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-card rounded-2xl p-6 animate-pulse">
              <div className="flex gap-4">
                <div className="w-14 h-14 rounded-xl bg-muted" />
                <div className="flex-1 space-y-2">
                  <div className="h-5 bg-muted rounded w-3/4" />
                  <div className="h-4 bg-muted rounded w-1/2" />
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : myApplications.length === 0 ? (
        <div className="text-center py-12 bg-card rounded-2xl shadow-card border border-border/50">
          <FileText className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-foreground">No tienes postulaciones</h3>
          <p className="text-muted-foreground mb-6">Comienza a explorar vacantes y envía tu primera postulación.</p>
          <Link to="/dashboard/vacancies">
            <Button>Explorar vacantes</Button>
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {myApplications.map((application, index) => {
            const vacancy = getVacancy(application.vacancyId);
            const status = statusConfig[application.status];
            const StatusIcon = status.icon;

            return (
              <motion.div
                key={application.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-card rounded-2xl p-6 shadow-card border border-border/50"
              >
                <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                  <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center text-primary font-bold text-lg shrink-0">
                    {vacancy?.company.slice(0, 2).toUpperCase() || 'NA'}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <h3 className="text-lg font-semibold text-foreground">
                      {vacancy?.title || 'Vacante no disponible'}
                    </h3>
                    <p className="text-muted-foreground">{vacancy?.company}</p>
                    <p className="text-sm text-muted-foreground mt-1">
                      Aplicado el {new Date(application.appliedAt).toLocaleDateString()}
                    </p>
                  </div>
                  
                  <div className="flex items-center gap-4">
                    <span className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium ${status.color}`}>
                      <StatusIcon className="w-4 h-4" />
                      {status.label}
                    </span>
                    
                    {vacancy && (
                      <Link to={`/dashboard/vacancies/${vacancy.id}`}>
                        <Button variant="outline" size="sm">
                          Ver vacante
                        </Button>
                      </Link>
                    )}
                  </div>
                </div>
                
                {application.coverLetter && (
                  <div className="mt-4 pt-4 border-t border-border">
                    <p className="text-sm text-muted-foreground">
                      <span className="font-medium">Carta de presentación:</span> {application.coverLetter}
                    </p>
                  </div>
                )}
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
}
