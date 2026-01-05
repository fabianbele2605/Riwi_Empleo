# 📚 Documentación Completa de la API

## 🔗 Información General

- **Base URL:** `http://localhost:3000`
- **Documentación Swagger:** `http://localhost:3000/api/docs`
- **Formato de respuesta:** JSON
- **Autenticación:** JWT + API Key

## 🔐 Headers Obligatorios

Todas las peticiones deben incluir:

```http
x-api-key: riwi_api_key_2024_empleo_vacantes
Content-Type: application/json
```

## 👥 Roles y Permisos

| Rol | Descripción | Permisos |
|-----|-------------|----------|
| **ADMIN** | Administrador del sistema | Acceso total a todos los endpoints |
| **GESTOR** | Gestor de empleabilidad | Crear/modificar vacantes, ver postulaciones |
| **CODER** | Desarrollador buscando empleo | Ver vacantes, postularse (máx. 3 activas) |

## 🔐 Autenticación

### POST /auth/register
Registra un nuevo usuario en el sistema.

**Permisos:** Público  
**Rol asignado:** CODER (por defecto)

**Request:**
```json
{
  "name": "Juan Pérez",
  "email": "juan@example.com",
  "password": "password123"
}
```

**Response (201):**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": 5,
      "name": "Juan Pérez",
      "email": "juan@example.com",
      "role": "coder"
    }
  },
  "message": "Operación exitosa"
}
```

### POST /auth/login
Autentica un usuario y establece cookie HttpOnly.

**Permisos:** Público

**Request:**
```json
{
  "email": "admin@riwi.io",
  "password": "admin123"
}
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": 1,
      "name": "Administrador",
      "email": "admin@riwi.io",
      "role": "admin"
    }
  },
  "message": "Operación exitosa"
}
```

## 💼 Vacantes

### GET /vacancies
Obtiene todas las vacantes activas.

**Permisos:** Público

### POST /vacancies
Crea una nueva vacante.

**Permisos:** ADMIN, GESTOR

**Request:**
```json
{
  "title": "Desarrollador Frontend React",
  "description": "Desarrollo de interfaces de usuario modernas con React",
  "technologies": "React, TypeScript, Tailwind CSS, Next.js",
  "seniority": "Semi Senior",
  "softSkills": "Creatividad, atención al detalle, trabajo en equipo",
  "location": "Bogotá",
  "modality": "remote",
  "salaryRange": "$3,500,000 - $5,000,000 COP",
  "company": "TechCorp S.A.S",
  "maxApplicants": 8
}
```

## 📝 Postulaciones

### POST /applications/apply
Permite a un CODER postularse a una vacante.

**Permisos:** CODER

**Request:**
```json
{
  "vacancyId": 1
}
```

### GET /applications/my-applications
Obtiene las postulaciones del usuario autenticado.

**Permisos:** CODER

## 🧪 Testing con cURL

```bash
# Login como Admin
curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -H "x-api-key: riwi_api_key_2024_empleo_vacantes" \
  -d '{"email": "admin@riwi.io", "password": "admin123"}' \
  -c cookies.txt

# Crear vacante
curl -X POST http://localhost:3000/vacancies \
  -H "Content-Type: application/json" \
  -H "x-api-key: riwi_api_key_2024_empleo_vacantes" \
  -b cookies.txt \
  -d '{
    "title": "Desarrollador Full Stack",
    "description": "Desarrollo de aplicaciones web",
    "technologies": "React, Node.js, TypeScript",
    "seniority": "Semi Senior",
    "softSkills": "Trabajo en equipo",
    "location": "Medellín",
    "modality": "hybrid",
    "salaryRange": "$3,000,000 - $4,500,000",
    "company": "RIWI Tech",
    "maxApplicants": 10
  }'
```