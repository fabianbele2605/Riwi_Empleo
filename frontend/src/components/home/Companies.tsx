import { motion } from "framer-motion";

const companies = [
  { name: "Google", initial: "G" },
  { name: "Microsoft", initial: "M" },
  { name: "Apple", initial: "A" },
  { name: "Meta", initial: "M" },
  { name: "Amazon", initial: "A" },
  { name: "Netflix", initial: "N" },
  { name: "Spotify", initial: "S" },
  { name: "Tesla", initial: "T" },
];

export function Companies() {
  return (
    <section className="py-16 lg:py-20 border-y border-border/50 bg-card/50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center text-muted-foreground mb-8"
        >
          Empresas líderes que confían en nosotros
        </motion.p>
        
        <div className="flex flex-wrap items-center justify-center gap-8 lg:gap-16">
          {companies.map((company, index) => (
            <motion.div
              key={company.name}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.05 }}
              className="flex items-center gap-2 text-muted-foreground/60 hover:text-muted-foreground transition-colors"
            >
              <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center font-bold text-lg">
                {company.initial}
              </div>
              <span className="font-semibold text-lg hidden sm:block">{company.name}</span>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
