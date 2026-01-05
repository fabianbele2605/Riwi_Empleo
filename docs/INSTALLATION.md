# 🚀 Guía de Instalación - API Empleabilidad RIWI

## 📋 Prerrequisitos

Antes de comenzar, asegúrate de tener instalado:

- **Node.js** >= 18.0.0 ([Descargar](https://nodejs.org/))
- **Docker** y **Docker Compose** ([Descargar](https://www.docker.com/))
- **Git** ([Descargar](https://git-scm.com/))

## 🔧 Instalación Paso a Paso

### 1. Clonar el Repositorio
```bash
git clone <repository-url>
cd empleo
```

### 2. Instalar Dependencias
```bash
npm install
```

### 3. Configurar Variables de Entorno
```bash
# Copiar archivo de ejemplo
cp .env.example .env

# Editar variables (opcional para desarrollo)
nano .env
```

### 4. Levantar Base de Datos
```bash
# Iniciar PostgreSQL con Docker
docker-compose up -d

# Verificar que esté corriendo
docker ps
```

### 5. Ejecutar la Aplicación
```bash
# Modo desarrollo (recomendado)
npm run start:dev

# O modo producción
npm run build
npm run start
```

### 6. Verificar Instalación
- **API:** http://localhost:3000
- **Swagger:** http://localhost:3000/api/docs
- **Health Check:** http://localhost:3000

## ✅ Verificación Rápida

```bash
# Probar que la API responde
curl -X GET http://localhost:3000 \
  -H "x-api-key: riwi_api_key_2024_empleo_vacantes"

# Respuesta esperada:
# {"success":true,"data":"Hello World!","message":"Operación exitosa"}
```

## 🧪 Ejecutar Pruebas

```bash
# Pruebas unitarias
npm run test

# Pruebas con cobertura
npm run test:cov

# Pruebas específicas
npm test -- --testPathPatterns="unit.spec.ts"
```

## 🐳 Docker (Opcional)

### Solo Base de Datos (Recomendado para desarrollo)
```bash
docker-compose up -d
npm run start:dev
```

### Aplicación Completa
```bash
# Construir imagen
docker build -t empleo-api .

# Ejecutar con docker-compose
docker-compose -f docker-compose.prod.yml up -d
```

## 🔧 Troubleshooting

### Error: Puerto 3000 en uso
```bash
# Encontrar proceso usando el puerto
lsof -i :3000

# Matar proceso
kill -9 <PID>

# O usar otro puerto
export APP_PORT=3001
npm run start:dev
```

### Error: No se puede conectar a PostgreSQL
```bash
# Verificar que Docker esté corriendo
docker ps

# Reiniciar contenedores
docker-compose down
docker-compose up -d

# Ver logs de la base de datos
docker-compose logs postgres
```

### Error: Dependencias no instaladas
```bash
# Limpiar cache de npm
npm cache clean --force

# Reinstalar dependencias
rm -rf node_modules package-lock.json
npm install
```

## 📊 Scripts Disponibles

| Comando | Descripción |
|---------|-------------|
| `npm run start` | Ejecutar en producción |
| `npm run start:dev` | Ejecutar en desarrollo con watch |
| `npm run start:debug` | Ejecutar en modo debug |
| `npm run build` | Compilar TypeScript |
| `npm run test` | Ejecutar pruebas unitarias |
| `npm run test:e2e` | Ejecutar pruebas end-to-end |
| `npm run test:cov` | Ejecutar pruebas con cobertura |

## 🔐 Credenciales por Defecto

Los seeders crean automáticamente estos usuarios:

| Rol | Email | Contraseña |
|-----|-------|------------|
| **ADMIN** | admin@riwi.io | admin123 |
| **GESTOR** | gestor@riwi.io | admin123 |

## 🌐 URLs Importantes

- **API Base:** http://localhost:3000
- **Swagger UI:** http://localhost:3000/api/docs
- **Health Check:** http://localhost:3000

## 📝 Próximos Pasos

1. **Probar la API** usando Swagger UI
2. **Crear usuarios** de prueba
3. **Crear vacantes** de ejemplo
4. **Probar postulaciones**
5. **Integrar frontend** (puerto 3001)

## 🆘 Soporte

Si encuentras problemas:

1. Revisa los logs: `docker-compose logs`
2. Verifica las variables de entorno
3. Asegúrate de que Docker esté corriendo
4. Consulta la documentación en `/docs`

¡Listo para desarrollar! 🎉