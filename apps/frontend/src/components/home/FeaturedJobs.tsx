import { useEffect } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { 
  MapPin, 
  Clock, 
  DollarSign, 
  Bookmark, 
  ArrowRight,
  Building2,
  Zap,
  Briefcase
} from "lucide-react";
import { useVacancyStore } from "@/stores/vacancyStore";
import { useApplicationStore } from "@/stores/applicationStore";
import { useAuthStore } from "@/stores/authStore";

const typeLabels = {
  remote: 'Remoto',
  hybrid: 'Híbrido', 
  onsite: 'Presencial',
};

export function FeaturedJobs() {
  const { vacancies, fetchVacanciesPublic, isLoading } = useVacancyStore();
  const { hasApplied, canApply, applyToVacancy } = useApplicationStore();
  const { user } = useAuthStore();

  useEffect(() => {
    fetchVacanciesPublic();
  }, [fetchVacanciesPublic]);

  // Obtener las primeras 4 vacantes activas
  const featuredJobs = vacancies
    .filter(job => job.status === 'ACTIVE')
    .slice(0, 4)
    .map(job => ({
      id: job.id,
      title: job.title,
      company: job.company,
      logo: job.company.slice(0, 2).toUpperCase(),
      logoColor: "bg-primary",
      location: job.location,
      type: typeLabels[job.type] || job.type,
      salary: job.salary.range || 'Salario competitivo',
      tags: job.requirements.slice(0, 3),
      featured: Math.random() > 0.5, // Aleatorio para demo
      postedAt: new Date(job.createdAt).toLocaleDateString('es-ES', {
        day: 'numeric',
        month: 'short'
      }),
      canApply: user?.role === 'CODER' && canApply() && !hasApplied(job.id),
    }));

  const handleApply = async (jobId: string) => {
    if (user?.role === 'CODER') {
      await applyToVacancy(parseInt(jobId));
    }
  };

  return (
    <section className="py-20 lg:py-28 bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-12">
          <div>
            <motion.span
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="inline-flex items-center gap-2 text-primary font-semibold mb-2"
            >
              <Zap className="w-4 h-4" />
              Oportunidades Destacadas
            </motion.span>
            <motion.h2
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-3xl lg:text-4xl font-display font-bold text-foreground"
            >
              Empleos que te pueden interesar
            </motion.h2>
          </div>
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
          >
            <Button variant="outline" asChild>
              <Link to="/dashboard/vacancies">
                Ver todos los empleos
                <ArrowRight className="w-4 h-4 ml-2" />
              </Link>
            </Button>
          </motion.div>
        </div>

        {/* Jobs grid */}
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
        ) : featuredJobs.length === 0 ? (
          <div className="text-center py-12">
            <Briefcase className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-foreground">No hay vacantes disponibles</h3>
            <p className="text-muted-foreground">Vuelve pronto para ver nuevas oportunidades.</p>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 gap-6">
          {featuredJobs.map((job, index) => (
            <motion.div
              key={job.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
            >
              <div className="group relative bg-card rounded-2xl p-6 shadow-card hover:shadow-card-hover transition-all duration-300 border border-border/50 hover:border-primary/20">
                {job.featured && (
                  <span className="absolute top-4 right-4 px-3 py-1 rounded-full bg-secondary/20 text-secondary-foreground text-xs font-semibold">
                    Destacado
                  </span>
                )}
                
                <div className="flex items-start gap-4">
                  {/* Company logo */}
                  <div className={`w-14 h-14 rounded-xl ${job.logoColor} flex items-center justify-center text-white font-bold text-lg shrink-0`}>
                    {job.logo}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <h3 className="text-lg font-semibold text-foreground group-hover:text-primary transition-colors truncate">
                      {job.title}
                    </h3>
                    <div className="flex items-center gap-2 text-muted-foreground mt-1">
                      <Building2 className="w-4 h-4" />
                      <span className="text-sm">{job.company}</span>
                    </div>
                  </div>

                  <button className="p-2 rounded-lg hover:bg-muted transition-colors text-muted-foreground hover:text-primary">
                    <Bookmark className="w-5 h-5" />
                  </button>
                </div>

                {/* Details */}
                <div className="flex flex-wrap items-center gap-4 mt-4 text-sm text-muted-foreground">
                  <span className="flex items-center gap-1.5">
                    <MapPin className="w-4 h-4" />
                    {job.location}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Clock className="w-4 h-4" />
                    {job.type}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <DollarSign className="w-4 h-4" />
                    {job.salary}
                  </span>
                </div>

                {/* Tags */}
                <div className="flex flex-wrap gap-2 mt-4">
                  {job.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-3 py-1 rounded-lg bg-muted text-muted-foreground text-sm font-medium"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                {/* Footer */}
                <div className="flex items-center justify-between mt-6 pt-4 border-t border-border/50">
                  <span className="text-sm text-muted-foreground">{job.postedAt}</span>
                  {user ? (
                    job.canApply ? (
                      <Button 
                        size="sm" 
                        onClick={() => handleApply(job.id)}
                        className="group-hover:bg-primary group-hover:text-primary-foreground transition-colors"
                      >
                        Aplicar ahora
                        <ArrowRight className="w-4 h-4 ml-1" />
                      </Button>
                    ) : (
                      <Button size="sm" variant="ghost" asChild>
                        <Link to={`/dashboard/vacancies/${job.id}`}>
                          Ver detalles
                          <ArrowRight className="w-4 h-4 ml-1" />
                        </Link>
                      </Button>
                    )
                  ) : (
                    <Button size="sm" variant="ghost" asChild>
                      <Link to="/auth/login">
                        Iniciar sesión
                        <ArrowRight className="w-4 h-4 ml-1" />
                      </Link>
                    </Button>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
        )}
      </div>
    </section>
  );
}