import { DataSource } from 'typeorm';
import { User, UserRole } from '../../users/entities/user.entity';
import { Vacancy } from '../../vacancies/entities/vacancy.entity';
import { Application } from '../../applications/entities/application.entity';
import * as bcrypt from 'bcrypt';

/**
 * Seeder para datos de demostración
 * Crea vacantes realistas y usuarios con aplicaciones
 */
export class DemoSeeder {
  constructor(private dataSource: DataSource) {}

  async run() {
    console.log('🌱 Iniciando seeder de datos demo...');

    // Crear usuarios CODER adicionales
    const coderUsers = await this.createCoderUsers();
    console.log(`✅ Creados ${coderUsers.length} usuarios CODER`);

    // Crear vacantes diversas
    const vacancies = await this.createVacancies();
    console.log(`✅ Creadas ${vacancies.length} vacantes`);

    // Crear aplicaciones aleatorias
    const applications = await this.createApplications(coderUsers, vacancies);
    console.log(`✅ Creadas ${applications.length} aplicaciones`);

    console.log('🎉 Seeder completado exitosamente');
  }

  private async createCoderUsers(): Promise<User[]> {
    const userRepository = this.dataSource.getRepository(User);
    const hashedPassword = await bcrypt.hash('123456', 10);

    const userData = [
      { name: 'Ana Martínez', email: 'ana.martinez@test.com' },
      { name: 'Carlos López', email: 'carlos.lopez@test.com' },
      { name: 'Diana Rodríguez', email: 'diana.rodriguez@test.com' },
      { name: 'Eduardo Silva', email: 'eduardo.silva@test.com' },
      { name: 'Fernanda Torres', email: 'fernanda.torres@test.com' },
      { name: 'Gabriel Herrera', email: 'gabriel.herrera@test.com' },
      { name: 'Helena Vargas', email: 'helena.vargas@test.com' },
      { name: 'Iván Morales', email: 'ivan.morales@test.com' },
      { name: 'Julia Castillo', email: 'julia.castillo@test.com' },
      { name: 'Kevin Ramírez', email: 'kevin.ramirez@test.com' },
    ];

    const users: User[] = [];
    for (const data of userData) {
      // Verificar si ya existe
      const existing = await userRepository.findOne({ where: { email: data.email } });
      if (!existing) {
        const user = userRepository.create({
          name: data.name,
          email: data.email,
          password: hashedPassword,
          role: UserRole.CODER,
        });
        users.push(await userRepository.save(user));
      }
    }

    return users;
  }

  private async createVacancies(): Promise<Vacancy[]> {
    const vacancyRepository = this.dataSource.getRepository(Vacancy);

    const vacancyData = [
      {
        title: 'Data Scientist Senior',
        description: 'Únete a nuestro equipo de ciencia de datos para desarrollar modelos de machine learning que impulsen decisiones estratégicas.',
        technologies: 'Python, Machine Learning, SQL, Pandas, Scikit-learn',
        seniority: 'Senior',
        softSkills: 'Análisis crítico, resolución de problemas, comunicación de insights',
        location: 'Bogotá',
        modality: "hybrid" as any,
        salaryRange: '$4,500,000 - $6,500,000 COP',
        company: 'DataCorp Analytics',
        maxApplicants: 6,
      },
      {
        title: 'DevOps Engineer',
        description: 'Automatiza y optimiza nuestros procesos de desarrollo y despliegue en la nube.',
        technologies: 'AWS, Docker, Kubernetes, Jenkins, Terraform',
        seniority: 'Semi Senior',
        softSkills: 'Automatización, trabajo bajo presión, colaboración',
        location: 'Medellín',
        modality: "remote" as any,
        salaryRange: '$5,500,000 - $8,000,000 COP',
        company: 'CloudTech Solutions',
        maxApplicants: 4,
      },
      {
        title: 'Mobile Developer Flutter',
        description: 'Desarrolla aplicaciones móviles innovadoras para iOS y Android usando Flutter.',
        technologies: 'Flutter, Dart, Firebase, REST APIs',
        seniority: 'Semi Senior',
        softSkills: 'Creatividad, atención al detalle, adaptabilidad',
        location: 'Cali',
        modality: "office" as any,
        salaryRange: '$4,000,000 - $6,000,000 COP',
        company: 'AppStudio Mobile',
        maxApplicants: 7,
      },
      {
        title: 'Backend Developer Node.js',
        description: 'Construye APIs robustas y escalables para aplicaciones web de alto tráfico.',
        technologies: 'Node.js, Express, MongoDB, PostgreSQL, Redis',
        seniority: 'Semi Senior',
        softSkills: 'Lógica de programación, trabajo en equipo, resolución de problemas',
        location: 'Barranquilla',
        modality: "hybrid" as any,
        salaryRange: '$3,800,000 - $5,500,000 COP',
        company: 'ServerSolutions Inc',
        maxApplicants: 10,
      },
      {
        title: 'QA Automation Engineer',
        description: 'Asegura la calidad del software mediante pruebas automatizadas y estrategias de testing.',
        technologies: 'Selenium, Cypress, Jest, Postman, TestNG',
        seniority: 'Semi Senior',
        softSkills: 'Meticulosidad, comunicación, pensamiento analítico',
        location: 'Bucaramanga',
        modality: "remote" as any,
        salaryRange: '$3,200,000 - $4,800,000 COP',
        company: 'TestLab Quality',
        maxApplicants: 5,
      },
      {
        title: 'Product Manager',
        description: 'Lidera el desarrollo de productos digitales desde la concepción hasta el lanzamiento.',
        technologies: 'Jira, Figma, Analytics, Roadmapping, Scrum',
        seniority: 'Senior',
        softSkills: 'Liderazgo, visión estratégica, comunicación efectiva',
        location: 'Bogotá',
        modality: "hybrid" as any,
        salaryRange: '$6,000,000 - $9,000,000 COP',
        company: 'InnovaCorp Digital',
        maxApplicants: 3,
      },
      {
        title: 'Cybersecurity Analyst',
        description: 'Protege la infraestructura digital mediante análisis de seguridad y prevención de amenazas.',
        technologies: 'Penetration Testing, SIEM, Firewall, Vulnerability Assessment',
        seniority: 'Semi Senior',
        softSkills: 'Análisis de riesgos, confidencialidad, atención al detalle',
        location: 'Medellín',
        modality: "office" as any,
        salaryRange: '$5,000,000 - $7,500,000 COP',
        company: 'SecureNet Defense',
        maxApplicants: 4,
      },
      {
        title: 'AI/ML Engineer',
        description: 'Desarrolla soluciones de inteligencia artificial y aprendizaje automático de vanguardia.',
        technologies: 'TensorFlow, PyTorch, Deep Learning, Computer Vision',
        seniority: 'Senior',
        softSkills: 'Investigación, innovación, pensamiento crítico',
        location: 'Bogotá',
        modality: "remote" as any,
        salaryRange: '$7,000,000 - $10,000,000 COP',
        company: 'AITech Innovations',
        maxApplicants: 2,
      },
      {
        title: 'Frontend Developer Vue.js',
        description: 'Crea interfaces de usuario modernas y responsivas con Vue.js y tecnologías frontend.',
        technologies: 'Vue.js, Nuxt.js, TypeScript, Tailwind CSS',
        seniority: 'Junior',
        softSkills: 'Creatividad, colaboración, aprendizaje continuo',
        location: 'Cartagena',
        modality: "remote" as any,
        salaryRange: '$2,800,000 - $4,200,000 COP',
        company: 'WebCraft Studio',
        maxApplicants: 8,
      },
      {
        title: 'Database Administrator',
        description: 'Administra y optimiza bases de datos para garantizar rendimiento y disponibilidad.',
        technologies: 'PostgreSQL, MySQL, MongoDB, Database Optimization',
        seniority: 'Semi Senior',
        softSkills: 'Organización, resolución de problemas, trabajo nocturno',
        location: 'Pereira',
        modality: "hybrid" as any,
        salaryRange: '$4,200,000 - $6,000,000 COP',
        company: 'DataBase Pro',
        maxApplicants: 5,
      },
    ];

    const vacancies: Vacancy[] = [];
    for (const data of vacancyData) {
      // Verificar si ya existe
      const existing = await vacancyRepository.findOne({ 
        where: { title: data.title, company: data.company } 
      });
      if (!existing) {
        const vacancy = vacancyRepository.create(data);
        vacancies.push(await vacancyRepository.save(vacancy));
      }
    }

    return vacancies;
  }

  private async createApplications(users: User[], vacancies: Vacancy[]): Promise<Application[]> {
    const applicationRepository = this.dataSource.getRepository(Application);
    const applications: Application[] = [];

    for (const user of users) {
      // Cada usuario aplica a 1-3 vacantes aleatorias
      const numApplications = Math.floor(Math.random() * 3) + 1;
      const selectedVacancies = this.shuffleArray([...vacancies]).slice(0, numApplications);

      for (const vacancy of selectedVacancies) {
        // Verificar si ya aplicó
        const existing = await applicationRepository.findOne({
          where: { userId: user.id, vacancyId: vacancy.id }
        });

        if (!existing) {
          const application = applicationRepository.create({
            userId: user.id,
            vacancyId: vacancy.id,
          });
          applications.push(await applicationRepository.save(application));
        }
      }
    }

    return applications;
  }

  private shuffleArray<T>(array: T[]): T[] {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  }
}