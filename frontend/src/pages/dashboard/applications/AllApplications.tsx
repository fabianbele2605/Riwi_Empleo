import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { FileText, Clock, CheckCircle, XCircle, Eye, Search, Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useApplicationStore } from '@/stores/applicationStore';
import { useVacancyStore } from '@/stores/vacancyStore';
import { ApplicationStatus } from '@/types';
import { useToast } from '@/hooks/use-toast';

const statusConfig = {
  PENDING: { label: 'Pendiente', color: 'bg-secondary/20 text-secondary-foreground', icon: Clock },
  REVIEWING: { label: 'En revisión', color: 'bg-primary/10 text-primary', icon: Eye },
  ACCEPTED: { label: 'Aceptada', color: 'bg-success/10 text-success', icon: CheckCircle },
  REJECTED: { label: 'Rechazada', color: 'bg-destructive/10 text-destructive', icon: XCircle },
};

export default function AllApplications() {
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [searchTerm, setSearchTerm] = useState('');
  
  const { applications, isLoading, fetchApplications, updateApplicationStatus } = useApplicationStore();
  const { vacancies, fetchVacancies } = useVacancyStore();
  const { toast } = useToast();

  useEffect(() => {
    fetchApplications();
    fetchVacancies();
  }, [fetchApplications, fetchVacancies]);

  const getVacancy = (vacancyId: string) => {
    return vacancies.find((v) => v.id === vacancyId);
  };

  const filteredApplications = applications.filter((app) => {
    if (statusFilter && app.status !== statusFilter) return false;
    
    if (searchTerm) {
      const vacancy = getVacancy(app.vacancyId);
      const searchLower = searchTerm.toLowerCase();
      if (
        !vacancy?.title.toLowerCase().includes(searchLower) &&
        !vacancy?.company.toLowerCase().includes(searchLower)
      ) {
        return false;
      }
    }
    
    return true;
  });

  const handleUpdateStatus = async (id: string, newStatus: ApplicationStatus) => {
    await updateApplicationStatus(id, newStatus);
    toast({
      title: 'Estado actualizado',
      description: `La postulación ha sido marcada como ${statusConfig[newStatus].label.toLowerCase()}.`,
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-display font-bold text-foreground">Todas las Postulaciones</h1>
        <p className="text-muted-foreground mt-1">
          {applications.length} postulaciones en total
        </p>
      </div>

      {/* Filters */}
      <div className="bg-card rounded-2xl p-4 shadow-card border border-border/50">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Buscar por vacante o empresa..."
              className="pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2 rounded-lg bg-muted border-0 text-foreground focus:ring-2 focus:ring-primary"
          >
            <option value="">Todos los estados</option>
            <option value="PENDING">Pendientes</option>
            <option value="REVIEWING">En revisión</option>
            <option value="ACCEPTED">Aceptadas</option>
            <option value="REJECTED">Rechazadas</option>
          </select>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {Object.entries(statusConfig).map(([key, config]) => {
          const count = applications.filter((a) => a.status === key).length;
          const Icon = config.icon;
          
          return (
            <motion.div
              key={key}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-card rounded-xl p-4 shadow-card border border-border/50"
            >
              <div className={`w-10 h-10 rounded-lg ${config.color} flex items-center justify-center mb-3`}>
                <Icon className="w-5 h-5" />
              </div>
              <p className="text-2xl font-bold text-foreground">{count}</p>
              <p className="text-sm text-muted-foreground">{config.label}</p>
            </motion.div>
          );
        })}
      </div>

      {/* Applications Table */}
      {isLoading ? (
        <div className="bg-card rounded-2xl p-6 animate-pulse">
          <div className="space-y-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="flex gap-4">
                <div className="w-12 h-12 rounded-lg bg-muted" />
                <div className="flex-1 space-y-2">
                  <div className="h-5 bg-muted rounded w-1/2" />
                  <div className="h-4 bg-muted rounded w-1/3" />
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : filteredApplications.length === 0 ? (
        <div className="text-center py-12 bg-card rounded-2xl shadow-card border border-border/50">
          <FileText className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-foreground">No hay postulaciones</h3>
          <p className="text-muted-foreground">No se encontraron postulaciones con los filtros aplicados.</p>
        </div>
      ) : (
        <div className="bg-card rounded-2xl shadow-card border border-border/50 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-muted/50">
                <tr>
                  <th className="text-left px-6 py-4 text-sm font-semibold text-foreground">Candidato</th>
                  <th className="text-left px-6 py-4 text-sm font-semibold text-foreground">Vacante</th>
                  <th className="text-left px-6 py-4 text-sm font-semibold text-foreground">Fecha</th>
                  <th className="text-left px-6 py-4 text-sm font-semibold text-foreground">Estado</th>
                  <th className="text-right px-6 py-4 text-sm font-semibold text-foreground">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filteredApplications.map((application) => {
                  const vacancy = getVacancy(application.vacancyId);
                  const status = statusConfig[application.status];
                  const StatusIcon = status.icon;

                  return (
                    <tr key={application.id} className="hover:bg-muted/30 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-semibold">
                            C{application.userId.slice(-1)}
                          </div>
                          <div>
                            <p className="font-medium text-foreground">Candidato #{application.userId}</p>
                            <p className="text-sm text-muted-foreground">coder@ejemplo.com</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <p className="font-medium text-foreground">{vacancy?.title || 'N/A'}</p>
                        <p className="text-sm text-muted-foreground">{vacancy?.company}</p>
                      </td>
                      <td className="px-6 py-4 text-muted-foreground">
                        {new Date(application.appliedAt).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium ${status.color}`}>
                          <StatusIcon className="w-3.5 h-3.5" />
                          {status.label}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-end gap-2">
                          {application.status === 'PENDING' && (
                            <>
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => handleUpdateStatus(application.id, 'REVIEWING')}
                              >
                                Revisar
                              </Button>
                            </>
                          )}
                          {application.status === 'REVIEWING' && (
                            <>
                              <Button
                                size="sm"
                                variant="ghost"
                                className="text-success hover:text-success"
                                onClick={() => handleUpdateStatus(application.id, 'ACCEPTED')}
                              >
                                Aceptar
                              </Button>
                              <Button
                                size="sm"
                                variant="ghost"
                                className="text-destructive hover:text-destructive"
                                onClick={() => handleUpdateStatus(application.id, 'REJECTED')}
                              >
                                Rechazar
                              </Button>
                            </>
                          )}
                          {(application.status === 'ACCEPTED' || application.status === 'REJECTED') && (
                            <span className="text-sm text-muted-foreground">Finalizado</span>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
