# 🚀 RIWI Employment API

**Developed by:** Fabián Enrique Beleño Robles  
**Technologies:** NestJS + TypeScript + PostgreSQL + Docker  
**Version:** 1.0.0

## 📋 Description

Complete REST API for job vacancy management and employment applications. Robust system with JWT authentication, role-based access control and implemented business rules.

## ✨ Key Features

- 🔐 **JWT Authentication** with secure HttpOnly cookies
- 👥 **Role-based access control** (ADMIN, GESTOR, CODER)
- 💼 **Complete job vacancy management**
- 📝 **Application system** with limits and validations
- 🛡️ **Advanced security** (API Key, CORS, validations)
- 📊 **Global interceptors** for logging and standardized responses
- 🧪 **Unit tests** with +40% coverage
- 📚 **Complete Swagger documentation**

## 🛠️ Tech Stack

| Technology | Version | Purpose |
|------------|---------|---------|
| **NestJS** | ^10.0.0 | Backend framework |
| **TypeScript** | ^5.1.3 | Typed language |
| **PostgreSQL** | ^15.0 | Database |
| **TypeORM** | ^0.3.17 | Database ORM |
| **JWT** | ^9.0.2 | Authentication |
| **bcrypt** | ^5.1.1 | Password hashing |
| **Docker** | ^24.0 | Containerization |
| **Jest** | ^29.5.0 | Testing |

## 🎨 Frontend Included

**Frontend Stack:**
- **React** + **Vite** + **TypeScript**
- **Tailwind CSS** + **Shadcn/ui**
- **Zustand** (global state)
- **React Hook Form** + **Zod** (validations)
- **React Router** (navigation)

**Features:**
- ✅ **Modern and elegant UI**
- ✅ **Responsive design**
- ✅ **Dark mode**
- ✅ **Real authentication** with API
- ✅ **Role-based access control**
- ✅ **Validated forms**

### Start Frontend
```bash
cd frontend
npm install
npm run dev
# Frontend: http://localhost:3001
```

## 🚀 Installation and Setup

### Prerequisites
- Node.js >= 18.0.0
- Docker and Docker Compose
- Git

### 1. Clone repository
```bash
git clone <repository-url>
cd empleo
```

### 2. Install dependencies
```bash
npm install
```

### 3. Configure environment variables
```bash
cp .env.example .env
```

### 4. Start database with Docker
```bash
docker-compose up -d
```

### 5. Run migrations and seeders
```bash
npm run build
npm run start:dev
# Seeders run automatically
```

### 6. Verify installation
- **API:** http://localhost:3000
- **Swagger:** http://localhost:3000/api/docs
- **Database:** localhost:5432

## 🔧 Environment Variables

```env
# Database
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=postgres
DB_DATABASE=empleo_db

# JWT
JWT_SECRET=your_super_secure_jwt_secret_here
JWT_EXPIRES_IN=7d

# API
APP_PORT=3000
FRONTEND_URL=http://localhost:3001

# API Key
API_KEY=riwi_api_key_2024_empleo_vacantes
```

## 📚 API Documentation

### 🔗 Important URLs
- **API Base:** http://localhost:3000
- **Swagger UI:** http://localhost:3000/api/docs
- **Health Check:** http://localhost:3000

### 🔐 Authentication

#### Required Headers
```http
x-api-key: riwi_api_key_2024_empleo_vacantes
Content-Type: application/json
```

#### Test Credentials
| Role | Email | Password | Permissions |
|-----|-------|----------|-------------|
| **ADMIN** | admin@riwi.io | admin123 | Full access |
| **GESTOR** | gestor@riwi.io | admin123 | Vacancy management |
| **CODER** | (free registration) | - | Applications (max. 3) |

### 📋 Main Endpoints

#### 🔐 Authentication
```http
POST /auth/register     # User registration
POST /auth/login        # Login
POST /auth/logout       # Logout
```

#### 💼 Vacancies
```http
GET    /vacancies           # List active vacancies
POST   /vacancies           # Create vacancy (ADMIN/GESTOR)
GET    /vacancies/:id       # View vacancy details
PATCH  /vacancies/:id       # Update vacancy (ADMIN/GESTOR)
PATCH  /vacancies/:id/toggle-active  # Activate/deactivate (ADMIN/GESTOR)
DELETE /vacancies/:id       # Delete vacancy (ADMIN)
```

#### 📝 Applications
```http
POST /applications/apply              # Apply to vacancy (CODER)
GET  /applications                    # View all (ADMIN/GESTOR)
GET  /applications/my-applications    # My applications (CODER)
GET  /applications/vacancy/:vacancyId # Applications by vacancy (ADMIN/GESTOR)
DELETE /applications/:id              # Delete application (ADMIN)
```

#### 👥 Users
```http
GET    /users       # List users (ADMIN)
GET    /users/:id   # View user (ADMIN)
PATCH  /users/:id   # Update user (ADMIN)
DELETE /users/:id   # Delete user (ADMIN)
```

### 📊 Usage Examples

#### User Registration
```bash
curl -X POST http://localhost:3000/auth/register \
  -H "Content-Type: application/json" \
  -H "x-api-key: riwi_api_key_2024_empleo_vacantes" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "password": "password123"
  }'
```

#### Login
```bash
curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -H "x-api-key: riwi_api_key_2024_empleo_vacantes" \
  -d '{
    "email": "admin@riwi.io",
    "password": "admin123"
  }' \
  -c cookies.txt
```

#### Create Vacancy
```bash
curl -X POST http://localhost:3000/vacancies \
  -H "Content-Type: application/json" \
  -H "x-api-key: riwi_api_key_2024_empleo_vacantes" \
  -b cookies.txt \
  -d '{
    "title": "Full Stack Developer",
    "description": "Modern web application development",
    "technologies": "React, Node.js, TypeScript",
    "seniority": "Semi Senior",
    "softSkills": "Teamwork, communication",
    "location": "Medellín",
    "modality": "hybrid",
    "salaryRange": "$3,000,000 - $4,500,000",
    "company": "RIWI Tech",
    "maxApplicants": 10
  }'
```

#### Apply to Vacancy
```bash
curl -X POST http://localhost:3000/applications/apply \
  -H "Content-Type: application/json" \
  -H "x-api-key: riwi_api_key_2024_empleo_vacantes" \
  -b cookies.txt \
  -d '{"vacancyId": 1}'
```

## 🏗️ Project Architecture

```
src/
├── auth/                    # Authentication module
│   ├── controllers/         # Auth controllers
│   ├── services/           # Auth business logic
│   ├── guards/             # Security guards
│   ├── strategies/         # JWT strategies
│   └── dto/                # Validation DTOs
├── users/                  # Users module
├── vacancies/              # Vacancies module
├── applications/           # Applications module
├── common/                 # Shared code
│   ├── interceptors/       # Global interceptors
│   ├── filters/           # Exception filters
│   └── decorators/        # Custom decorators
├── database/              # Database configuration
│   └── seeders/          # Initial data
└── main.ts               # Entry point
```

## 🔒 Implemented Security

- ✅ **JWT in HttpOnly cookies** - Prevents XSS attacks
- ✅ **Mandatory API Key** - Additional security layer
- ✅ **Configured CORS** - Control allowed origins
- ✅ **Strict validation** - DTOs with class-validator
- ✅ **Password hashing** - bcrypt with salt rounds
- ✅ **Soft delete** - Referential integrity
- ✅ **Role-based guards** - Granular access control

## 📊 Business Rules

### 👥 Roles and Permissions
- **ADMIN**: Full system access
- **GESTOR**: Create/modify vacancies, view applications
- **CODER**: Apply to vacancies (maximum 3 active)

### 💼 Vacancies
- Only ADMIN and GESTOR can create/modify vacancies
- Vacancies have maximum applicant quota
- Only active vacancies are publicly visible

### 📝 Applications
- A CODER cannot apply twice to the same vacancy
- Maximum 3 active applications per CODER
- No applications allowed when quota is full
- Only authenticated users can apply

## 🧪 Testing

### Run Tests
```bash
# Unit tests
npm run test

# Specific tests
npm test -- --testPathPatterns="unit.spec.ts"

# Code coverage
npm run test:cov
```

### Current Coverage
- **General coverage:** 42.47%
- **VacanciesService:** 92.3% ✅
- **ApplicationsService:** 100% ✅
- **Main services:** +42% (meets requirement)

## 🚀 Available Scripts

```bash
npm run start          # Production
npm run start:dev      # Development with watch
npm run start:debug    # Debug mode
npm run build          # Compile TypeScript
npm run test           # Unit tests
npm run test:e2e       # End-to-end tests
npm run test:cov       # Code coverage
```

## 🐳 Docker

### Development
```bash
docker-compose up -d    # Database only
npm run start:dev       # API locally
```

### Production
```bash
docker-compose -f docker-compose.prod.yml up -d
```

## 🔧 Troubleshooting

### Common Issues

#### Database connection error
```bash
# Verify Docker is running
docker ps

# Restart containers
docker-compose down
docker-compose up -d
```

#### Authentication error
- Verify `x-api-key` header is present
- Confirm cookies are being sent correctly
- Check JWT hasn't expired

#### Permission error
- Verify authenticated user's role
- Confirm endpoint allows current role
- Review authorization guards

## 📈 Future Improvements

- [ ] Advanced vacancy filters
- [ ] Email notifications
- [ ] Dashboard with metrics
- [ ] Reports API
- [ ] External service integration
- [ ] Redis cache
- [ ] Rate limiting
- [ ] Structured logs

## 🤝 Contributing

1. Fork the project
2. Create feature branch (`git checkout -b feature/new-feature`)
3. Commit changes (`git commit -am 'Add new feature'`)
4. Push to branch (`git push origin feature/new-feature`)
5. Create Pull Request

## 📄 License

This project is under the MIT License. See `LICENSE` file for more details.

## 👨💻 Author

**Fabián Beleño**
- Email: fabianrobles321@outlook.com
- LinkedIn: [https://www.linkedin.com/in/fabian-enrique-bele%C3%B1o-robles-696960261/]
- GitHub: [https://github.com/fabianbele2605]

---

⭐ **If you like this project, give it a star!** ⭐