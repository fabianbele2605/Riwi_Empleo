import { motion } from "framer-motion";

const companies = [
  { 
    name: "Google", 
    logo: "https://upload.wikimedia.org/wikipedia/commons/2/2f/Google_2015_logo.svg",
    color: "#4285F4"
  },
  { 
    name: "Microsoft", 
    logo: "https://upload.wikimedia.org/wikipedia/commons/4/44/Microsoft_logo.svg",
    color: "#00A4EF"
  },
  { 
    name: "Apple", 
    logo: "https://upload.wikimedia.org/wikipedia/commons/f/fa/Apple_logo_black.svg",
    color: "#000000"
  },
  { 
    name: "Meta", 
    logo: "https://upload.wikimedia.org/wikipedia/commons/7/7b/Meta_Platforms_Inc._logo.svg",
    color: "#1877F2"
  },
  { 
    name: "Amazon", 
    logo: "https://upload.wikimedia.org/wikipedia/commons/a/a9/Amazon_logo.svg",
    color: "#FF9900"
  },
  { 
    name: "Netflix", 
    logo: "https://upload.wikimedia.org/wikipedia/commons/0/08/Netflix_2015_logo.svg",
    color: "#E50914"
  },
  { 
    name: "Spotify", 
    logo: "https://upload.wikimedia.org/wikipedia/commons/1/19/Spotify_logo_without_text.svg",
    color: "#1DB954"
  },
  { 
    name: "Tesla", 
    logo: "https://upload.wikimedia.org/wikipedia/commons/b/bb/Tesla_T_symbol.svg",
    color: "#CC0000"
  },
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
              className="flex items-center gap-3 text-muted-foreground/60 hover:text-muted-foreground transition-all duration-300 hover:scale-105"
            >
              <div className="w-12 h-12 rounded-lg bg-background border border-border/50 flex items-center justify-center p-2 shadow-sm">
                <img 
                  src={company.logo} 
                  alt={`${company.name} logo`}
                  className="w-full h-full object-contain filter grayscale hover:grayscale-0 transition-all duration-300"
                  style={{ filter: 'grayscale(1) opacity(0.7)' }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.filter = 'grayscale(0) opacity(1)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.filter = 'grayscale(1) opacity(0.7)';
                  }}
                />
              </div>
              <span className="font-semibold text-lg hidden sm:block">{company.name}</span>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}