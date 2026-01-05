import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Briefcase, 
  FileText, 
  Users, 
  TrendingUp,
  ArrowUpRight,
  ArrowDownRight,
  Eye
} from 'lucide-react';
import { useAuthStore } from '@/stores/authStore';
import { useVacancyStore } from '@/stores/vacancyStore';
import { useApplicationStore } from '@/stores/applicationStore';

const StatCard = ({ 
  title, 
  value, 
  change, 
  changeType, 
  icon: Icon, 
  color 
}: {
  title: string;
  value: string | number;
  change: string;
  changeType: 'up' | 'down';
  icon: React.ElementType;
  color: string;
}) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className="bg-card rounded-2xl p-6 shadow-card border border-border/50"
  >
    <div className="flex items-start justify-between">
      <div>
        <p className="text-sm text-muted-foreground mb-1">{title}</p>
        <p className="text-3xl font-display font-bold text-foreground">{value}</p>
        <div className={`flex items-center gap-1 mt-2 text-sm ${changeType === 'up' ? 'text-success' : 'text-destructive'}`}>
          {changeType === 'up' ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownRight className="w-4 h-4" />}
          <span>{change}</span>
          <span className="text-muted-foreground">vs. mes anterior</span>
        </div>
      </div>
      <div className={`w-12 h-12 rounded-xl ${color} flex items-center justify-center`}>
        <Icon className="w-6 h-6 text-primary-foreground" />
      </div>
    </div>
  </motion.div>
);

export default function Dashboard() {
  const { user } = useAuthStore();
  const { vacancies, fetchVacancies } = useVacancyStore();
  const { applications, fetchApplications, getApplicationCount } = useApplicationStore();

  useEffect(() => {
    fetchVacancies();
    fetchApplications();
  }, [fetchVacancies, fetchApplications]);

  const activeVacancies = vacancies.filter(v => v.status === 'ACTIVE').length;
  const totalApplications = applications.length;
  const myApplications = user ? getApplicationCount(user.id) : 0;

  const stats = [
    {
      title: 'Vacantes Activas',
      value: activeVacancies,
      change: '+12%',
      changeType: 'up' as const,
      icon: Briefcase,
      color: 'bg-primary',
    },
    {
      title: 'Total Postulaciones',
      value: totalApplications,
      change: '+8%',
      changeType: 'up' as const,
      icon: FileText,
      color: 'bg-accent',
    },
    {
      title: 'Candidatos Nuevos',
      value: '234',
      change: '+25%',
      changeType: 'up' as const,
      icon: Users,
      color: 'bg-success',
    },
    {
      title: 'Tasa de Conversión',
      value: '12.5%',
      change: '-2%',
      changeType: 'down' as const,
      icon: TrendingUp,
      color: 'bg-secondary',
    },
  ];

  const coderStats = [
    {
      title: 'Mis Postulaciones',
      value: myApplications,
      change: '+1',
      changeType: 'up' as const,
      icon: FileText,
      color: 'bg-primary',
    },
    {
      title: 'Vacantes Disponibles',
      value: activeVacancies,
      change: '+5',
      changeType: 'up' as const,
      icon: Briefcase,
      color: 'bg-accent',
    },
    {
      title: 'Vistas de Perfil',
      value: '47',
      change: '+15%',
      changeType: 'up' as const,
      icon: Eye,
      color: 'bg-success',
    },
    {
      title: 'Límite Postulaciones',
      value: `${myApplications}/3`,
      change: myApplications < 3 ? 'Disponible' : 'Límite',
      changeType: myApplications < 3 ? 'up' as const : 'down' as const,
      icon: TrendingUp,
      color: 'bg-secondary',
    },
  ];

  const displayStats = user?.role === 'CODER' ? coderStats : stats;

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div>
        <motion.h1
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-3xl font-display font-bold text-foreground"
        >
          ¡Hola, {user?.name?.split(' ')[0]}! 👋
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-muted-foreground mt-1"
        >
          {user?.role === 'CODER' 
            ? 'Aquí tienes un resumen de tu actividad'
            : 'Aquí tienes un resumen del rendimiento de la plataforma'}
        </motion.p>
      </div>

      {/* Stats Grid */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {displayStats.map((stat, index) => (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <StatCard {...stat} />
          </motion.div>
        ))}
      </div>

      {/* Recent Activity */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Recent Vacancies */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-card rounded-2xl p-6 shadow-card border border-border/50"
        >
          <h2 className="text-lg font-semibold text-foreground mb-4">Vacantes Recientes</h2>
          <div className="space-y-4">
            {vacancies.slice(0, 4).map((vacancy) => (
              <div key={vacancy.id} className="flex items-center gap-4 p-3 rounded-xl hover:bg-muted/50 transition-colors">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Briefcase className="w-5 h-5 text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-foreground truncate">{vacancy.title}</p>
                  <p className="text-sm text-muted-foreground">{vacancy.company}</p>
                </div>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  vacancy.status === 'ACTIVE' 
                    ? 'bg-success/10 text-success' 
                    : 'bg-muted text-muted-foreground'
                }`}>
                  {vacancy.status === 'ACTIVE' ? 'Activa' : 'Inactiva'}
                </span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Recent Applications */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-card rounded-2xl p-6 shadow-card border border-border/50"
        >
          <h2 className="text-lg font-semibold text-foreground mb-4">Actividad Reciente</h2>
          <div className="space-y-4">
            {[
              { action: 'Nueva postulación', detail: 'Senior Frontend Developer', time: 'Hace 2 horas', type: 'application' },
              { action: 'Vacante publicada', detail: 'Backend Developer Node.js', time: 'Hace 5 horas', type: 'vacancy' },
              { action: 'Perfil actualizado', detail: 'Carlos Mendez', time: 'Hace 1 día', type: 'profile' },
              { action: 'Postulación aceptada', detail: 'Full Stack Developer', time: 'Hace 2 días', type: 'accepted' },
            ].map((activity, index) => (
              <div key={index} className="flex items-center gap-4 p-3 rounded-xl hover:bg-muted/50 transition-colors">
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                  activity.type === 'application' ? 'bg-accent/10' :
                  activity.type === 'vacancy' ? 'bg-primary/10' :
                  activity.type === 'accepted' ? 'bg-success/10' :
                  'bg-secondary/10'
                }`}>
                  <FileText className={`w-5 h-5 ${
                    activity.type === 'application' ? 'text-accent' :
                    activity.type === 'vacancy' ? 'text-primary' :
                    activity.type === 'accepted' ? 'text-success' :
                    'text-secondary-foreground'
                  }`} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-foreground">{activity.action}</p>
                  <p className="text-sm text-muted-foreground truncate">{activity.detail}</p>
                </div>
                <span className="text-xs text-muted-foreground whitespace-nowrap">{activity.time}</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
