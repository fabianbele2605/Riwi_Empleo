import { useEffect } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { 
  Code2, 
  Palette, 
  TrendingUp, 
  Headphones, 
  Calculator, 
  Stethoscope,
  GraduationCap,
  Truck,
  ArrowRight
} from "lucide-react";
import { useVacancyStore } from "@/stores/vacancyStore";

const categoryKeywords = {
  "Tecnología": ["react", "javascript", "python", "node", "typescript", "java", "php"],
  "Diseño": ["figma", "photoshop", "ui", "ux", "diseño", "gráfico"],
  "Marketing": ["marketing", "seo", "social", "content", "digital"],
  "Atención al Cliente": ["customer", "support", "atención", "servicio"],
  "Finanzas": ["finanzas", "contabilidad", "accounting", "finance"],
  "Salud": ["salud", "médico", "enfermería", "health"],
  "Educación": ["educación", "teacher", "profesor", "education"],
  "Logística": ["logística", "transporte", "supply", "warehouse"],
};

export function Categories() {
  const { vacancies, fetchVacanciesPublic } = useVacancyStore();

  useEffect(() => {
    fetchVacanciesPublic();
  }, [fetchVacanciesPublic]);

  // Calcular empleos por categoría basado en las vacantes reales
  const getJobsForCategory = (categoryName: string) => {
    const keywords = categoryKeywords[categoryName as keyof typeof categoryKeywords] || [];
    return vacancies.filter(vacancy => {
      const searchText = `${vacancy.title} ${vacancy.description} ${vacancy.requirements.join(' ')}`.toLowerCase();
      return keywords.some(keyword => searchText.includes(keyword.toLowerCase()));
    }).length;
  };

  const categories = [
    { icon: Code2, name: "Tecnología", jobs: getJobsForCategory("Tecnología"), color: "bg-primary/10 text-primary" },
    { icon: Palette, name: "Diseño", jobs: getJobsForCategory("Diseño"), color: "bg-accent/10 text-accent" },
    { icon: TrendingUp, name: "Marketing", jobs: getJobsForCategory("Marketing"), color: "bg-secondary/20 text-secondary-foreground" },
    { icon: Headphones, name: "Atención al Cliente", jobs: getJobsForCategory("Atención al Cliente"), color: "bg-success/10 text-success" },
    { icon: Calculator, name: "Finanzas", jobs: getJobsForCategory("Finanzas"), color: "bg-primary/10 text-primary" },
    { icon: Stethoscope, name: "Salud", jobs: getJobsForCategory("Salud"), color: "bg-destructive/10 text-destructive" },
    { icon: GraduationCap, name: "Educación", jobs: getJobsForCategory("Educación"), color: "bg-accent/10 text-accent" },
    { icon: Truck, name: "Logística", jobs: getJobsForCategory("Logística"), color: "bg-success/10 text-success" },
  ];

  return (
    <section className="py-20 lg:py-28 bg-muted/30">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <motion.h2
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl lg:text-4xl font-display font-bold text-foreground mb-4"
          >
            Explora por categoría
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-muted-foreground text-lg"
          >
            Encuentra oportunidades en tu área de especialización
          </motion.p>
        </div>

        {/* Categories grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 lg:gap-6">
          {categories.map((category, index) => (
            <motion.div
              key={category.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.05 }}
              className="group relative bg-card rounded-2xl p-6 shadow-card hover:shadow-card-hover transition-all duration-300 border border-border/50 hover:border-primary/20"
            >
              <Link 
                to={`/dashboard/vacancies?search=${category.name}`}
                className="block"
              >
              <div className={`w-14 h-14 rounded-xl ${category.color} flex items-center justify-center mb-4 transition-transform group-hover:scale-110`}>
                <category.icon className="w-7 h-7" />
              </div>
              
              <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors">
                {category.name}
              </h3>
              
              <p className="text-sm text-muted-foreground mt-1">
                {category.jobs > 0 ? `${category.jobs} empleos` : 'Próximamente'}
              </p>

              <ArrowRight className="absolute bottom-6 right-6 w-5 h-5 text-muted-foreground opacity-0 group-hover:opacity-100 group-hover:text-primary transition-all transform translate-x-2 group-hover:translate-x-0" />
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}