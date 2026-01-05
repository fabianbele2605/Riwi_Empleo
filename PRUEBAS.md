# 🧪 Guía de Pruebas - Sistema de Empleabilidad RIWI

## 📋 Checklist de Funcionalidades

### ✅ Backend Funcionando
- [x] Servidor corriendo en http://localhost:3000
- [x] API Key funcionando: `riwi_api_key_2024_empleo_vacantes`
- [x] Base de datos PostgreSQL conectada
- [x] Seeders ejecutados (admin@riwi.io, gestor@riwi.io)

### ✅ Frontend Funcionando  
- [x] Servidor corriendo en http://localhost:3001
- [x] Conexión con backend establecida
- [x] CORS configurado correctamente

## 🔐 Pruebas de Autenticación

### Usuarios de Prueba
| Rol | Email | Contraseña | Estado |
|-----|-------|------------|--------|
| ADMIN | admin@riwi.io | admin123 | ✅ Funciona |
| GESTOR | gestor@riwi.io | admin123 | ✅ Funciona |
| CODER | juan@test.com | password123 | ✅ Creado |

### Funcionalidades de Auth
- [x] Registro de usuarios (rol CODER por defecto)
- [x] Login con cookies HttpOnly
- [x] Logout
- [x] Protección de rutas por roles
- [x] Persistencia de sesión

## 💼 Pruebas de Vacantes

### CRUD Completo
- [x] **Listar vacantes** - GET /vacancies
- [x] **Ver detalle** - GET /vacancies/:id  
- [x] **Crear vacante** - POST /vacancies (ADMIN/GESTOR)
- [x] **Editar vacante** - PATCH /vacancies/:id (ADMIN/GESTOR)
- [x] **Activar/Desactivar** - PATCH /vacancies/:id/toggle-active (ADMIN/GESTOR)
- [x] **Eliminar vacante** - DELETE /vacancies/:id (ADMIN)

### Campos de Vacante
- [x] title (string)
- [x] description (string)
- [x] technologies (string, separado por comas)
- [x] seniority (string)
- [x] softSkills (string, separado por comas)
- [x] location (string)
- [x] modality (remote/hybrid/onsite)
- [x] salaryRange (string)
- [x] company (string)
- [x] maxApplicants (number)
- [x] isActive (boolean)

### Frontend - Vacantes
- [x] Lista de vacantes con filtros
- [x] Búsqueda por título/empresa/ubicación
- [x] Filtros por modalidad y estado
- [x] Formulario de creación (validado)
- [x] Formulario de edición (validado)
- [x] Vista detalle completa
- [x] Botones de acción según rol

## 📝 Pruebas de Aplicaciones

### Funcionalidades
- [x] **Aplicar a vacante** - POST /applications/apply (CODER)
- [x] **Mis aplicaciones** - GET /applications/my-applications (CODER)
- [x] **Todas las aplicaciones** - GET /applications (ADMIN/GESTOR)
- [x] **Aplicaciones por vacante** - GET /applications/vacancy/:id (ADMIN/GESTOR)

### Reglas de Negocio
- [x] Máximo 3 aplicaciones por CODER
- [x] No aplicar dos veces a la misma vacante
- [x] Solo aplicar a vacantes activas
- [x] Solo usuarios CODER pueden aplicar

### Frontend - Aplicaciones
- [x] Botón "Aplicar" en vacantes
- [x] Vista "Mis Aplicaciones" (CODER)
- [x] Vista "Todas las Aplicaciones" (ADMIN/GESTOR)
- [x] Contador de aplicaciones restantes
- [x] Estados de aplicación (PENDING por defecto)

## 🎨 Pruebas de UI/UX

### Componentes
- [x] Header con navegación
- [x] Sidebar del dashboard
- [x] Cards de vacantes responsivas
- [x] Formularios con validación
- [x] Toasts de notificación
- [x] Loading states
- [x] Estados vacíos

### Responsive Design
- [x] Mobile (< 768px)
- [x] Tablet (768px - 1024px)
- [x] Desktop (> 1024px)

## 🔒 Pruebas de Seguridad

### Autenticación
- [x] JWT en cookies HttpOnly
- [x] API Key obligatoria
- [x] CORS configurado
- [x] Rutas protegidas por rol

### Validación
- [x] DTOs en backend
- [x] Zod schemas en frontend
- [x] Sanitización de inputs
- [x] Manejo de errores

## 🧪 Comandos de Prueba

### Backend
```bash
# Verificar salud del servidor
curl -X GET http://localhost:3000 -H "x-api-key: riwi_api_key_2024_empleo_vacantes"

# Login como admin
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
    "title": "Test Vacancy",
    "description": "Test description for vacancy",
    "technologies": "React, Node.js",
    "seniority": "Semi Senior",
    "softSkills": "Communication, Teamwork",
    "location": "Remote",
    "modality": "remote",
    "salaryRange": "$3,000,000 - $4,000,000 COP",
    "company": "Test Company",
    "maxApplicants": 10
  }'

# Registrar usuario CODER
curl -X POST http://localhost:3000/auth/register \
  -H "Content-Type: application/json" \
  -H "x-api-key: riwi_api_key_2024_empleo_vacantes" \
  -d '{"name": "Test User", "email": "test@example.com", "password": "password123"}' \
  -c cookies_coder.txt

# Aplicar a vacante
curl -X POST http://localhost:3000/applications/apply \
  -H "Content-Type: application/json" \
  -H "x-api-key: riwi_api_key_2024_empleo_vacantes" \
  -b cookies_coder.txt \
  -d '{"vacancyId": 1}'
```

### Frontend
```bash
# Iniciar desarrollo
cd frontend && npm run dev

# Ejecutar tests (si están configurados)
npm test

# Build para producción
npm run build
```

## 🐛 Problemas Conocidos y Soluciones

### 1. CORS Issues
**Problema**: Error de CORS al hacer requests desde frontend
**Solución**: ✅ Configurado en main.ts con credentials: true

### 2. Cookies no se envían
**Problema**: JWT no se incluye en requests
**Solución**: ✅ credentials: 'include' en fetch

### 3. Roles no coinciden
**Problema**: Backend usa lowercase, frontend uppercase
**Solución**: ✅ Transformación en authStore

### 4. Campos de vacante no coinciden
**Problema**: Frontend espera 'type', backend usa 'modality'
**Solución**: ✅ Transformación en vacancyStore

## ✅ Estado Final

### Backend ✅ COMPLETO
- Autenticación JWT con cookies
- CRUD completo de vacantes
- Sistema de aplicaciones
- Validaciones y seguridad
- Seeders y base de datos

### Frontend ✅ COMPLETO
- Interfaz moderna con Tailwind + Shadcn
- Autenticación real con backend
- CRUD completo de vacantes
- Sistema de aplicaciones
- Protección de rutas por roles
- Formularios validados
- Estados de carga y error

### Integración ✅ COMPLETA
- API client configurado
- Transformación de datos
- Manejo de errores
- Estados sincronizados
- Notificaciones de usuario

## 🚀 Próximos Pasos

1. **Testing**: Agregar tests unitarios y e2e
2. **Performance**: Implementar cache y optimizaciones
3. **Features**: Notificaciones, filtros avanzados, reportes
4. **Deploy**: Configurar CI/CD y producción

---

**Estado**: ✅ SISTEMA COMPLETAMENTE FUNCIONAL
**Fecha**: 2026-01-05
**Desarrollador**: Fabián Enrique Beleño Robles