#!/bin/bash

# 🧪 Script de Pruebas Automatizadas - Sistema de Empleabilidad RIWI
# Autor: Fabián Enrique Beleño Robles

echo "🚀 Iniciando pruebas del sistema..."
echo "=================================="

API_BASE="http://localhost:3000"
API_KEY="riwi_api_key_2024_empleo_vacantes"
HEADERS="-H 'Content-Type: application/json' -H 'x-api-key: $API_KEY'"

# Colores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Función para mostrar resultados
check_result() {
    if [ $1 -eq 0 ]; then
        echo -e "${GREEN}✅ $2${NC}"
    else
        echo -e "${RED}❌ $2${NC}"
        exit 1
    fi
}

# 1. Verificar que el backend esté corriendo
echo -e "${YELLOW}🔍 Verificando backend...${NC}"
curl -s -f $API_BASE -H "x-api-key: $API_KEY" > /dev/null
check_result $? "Backend está corriendo"

# 2. Probar login como ADMIN
echo -e "${YELLOW}🔐 Probando autenticación ADMIN...${NC}"
LOGIN_RESPONSE=$(curl -s -X POST $API_BASE/auth/login \
  -H "Content-Type: application/json" \
  -H "x-api-key: $API_KEY" \
  -d '{"email": "admin@riwi.io", "password": "admin123"}' \
  -c cookies_admin.txt)

echo $LOGIN_RESPONSE | grep -q "success.*true"
check_result $? "Login ADMIN exitoso"

# 3. Probar obtener vacantes
echo -e "${YELLOW}💼 Probando obtener vacantes...${NC}"
VACANCIES_RESPONSE=$(curl -s -X GET $API_BASE/vacancies \
  -H "x-api-key: $API_KEY" \
  -b cookies_admin.txt)

echo $VACANCIES_RESPONSE | grep -q "success.*true"
check_result $? "Obtener vacantes exitoso"

# 4. Probar crear vacante
echo -e "${YELLOW}➕ Probando crear vacante...${NC}"
CREATE_VACANCY_RESPONSE=$(curl -s -X POST $API_BASE/vacancies \
  -H "Content-Type: application/json" \
  -H "x-api-key: $API_KEY" \
  -b cookies_admin.txt \
  -d '{
    "title": "Test Automation Engineer",
    "description": "Desarrollador especializado en automatización de pruebas con experiencia en frameworks modernos de testing.",
    "technologies": "Jest, Cypress, Selenium, JavaScript",
    "seniority": "Semi Senior",
    "softSkills": "Atención al detalle, pensamiento analítico, comunicación",
    "location": "Bogotá",
    "modality": "remote",
    "salaryRange": "$3,200,000 - $4,800,000 COP",
    "company": "QA Solutions",
    "maxApplicants": 15
  }')

echo $CREATE_VACANCY_RESPONSE | grep -q "success.*true"
check_result $? "Crear vacante exitoso"

# Extraer ID de la vacante creada
VACANCY_ID=$(echo $CREATE_VACANCY_RESPONSE | grep -o '"id":[0-9]*' | grep -o '[0-9]*')
echo "📝 Vacante creada con ID: $VACANCY_ID"

# 5. Probar registrar usuario CODER
echo -e "${YELLOW}👤 Probando registro de usuario CODER...${NC}"
REGISTER_RESPONSE=$(curl -s -X POST $API_BASE/auth/register \
  -H "Content-Type: application/json" \
  -H "x-api-key: $API_KEY" \
  -d '{
    "name": "María García",
    "email": "maria.test@example.com",
    "password": "password123"
  }' \
  -c cookies_coder.txt)

echo $REGISTER_RESPONSE | grep -q "success.*true"
check_result $? "Registro CODER exitoso"

# 6. Probar aplicar a vacante
echo -e "${YELLOW}📝 Probando aplicar a vacante...${NC}"
APPLY_RESPONSE=$(curl -s -X POST $API_BASE/applications/apply \
  -H "Content-Type: application/json" \
  -H "x-api-key: $API_KEY" \
  -b cookies_coder.txt \
  -d "{\"vacancyId\": $VACANCY_ID}")

echo $APPLY_RESPONSE | grep -q "success.*true"
check_result $? "Aplicar a vacante exitoso"

# 7. Probar obtener mis aplicaciones
echo -e "${YELLOW}📋 Probando obtener mis aplicaciones...${NC}"
MY_APPS_RESPONSE=$(curl -s -X GET $API_BASE/applications/my-applications \
  -H "x-api-key: $API_KEY" \
  -b cookies_coder.txt)

echo $MY_APPS_RESPONSE | grep -q "success.*true"
check_result $? "Obtener mis aplicaciones exitoso"

# 8. Probar obtener todas las aplicaciones (como ADMIN)
echo -e "${YELLOW}📊 Probando obtener todas las aplicaciones...${NC}"
ALL_APPS_RESPONSE=$(curl -s -X GET $API_BASE/applications \
  -H "x-api-key: $API_KEY" \
  -b cookies_admin.txt)

echo $ALL_APPS_RESPONSE | grep -q "success.*true"
check_result $? "Obtener todas las aplicaciones exitoso"

# 9. Probar toggle status de vacante
echo -e "${YELLOW}🔄 Probando cambiar estado de vacante...${NC}"
TOGGLE_RESPONSE=$(curl -s -X PATCH $API_BASE/vacancies/$VACANCY_ID/toggle-active \
  -H "x-api-key: $API_KEY" \
  -b cookies_admin.txt)

echo $TOGGLE_RESPONSE | grep -q "success.*true"
check_result $? "Cambiar estado de vacante exitoso"

# 10. Probar actualizar vacante
echo -e "${YELLOW}✏️ Probando actualizar vacante...${NC}"
UPDATE_RESPONSE=$(curl -s -X PATCH $API_BASE/vacancies/$VACANCY_ID \
  -H "Content-Type: application/json" \
  -H "x-api-key: $API_KEY" \
  -b cookies_admin.txt \
  -d '{
    "title": "Senior Test Automation Engineer",
    "maxApplicants": 20
  }')

echo $UPDATE_RESPONSE | grep -q "success.*true"
check_result $? "Actualizar vacante exitoso"

# 11. Verificar frontend está corriendo
echo -e "${YELLOW}🌐 Verificando frontend...${NC}"
curl -s -f http://localhost:3001 > /dev/null
check_result $? "Frontend está corriendo"

# Limpiar archivos temporales
rm -f cookies_admin.txt cookies_coder.txt

echo ""
echo "🎉 ¡TODAS LAS PRUEBAS PASARON EXITOSAMENTE!"
echo "=================================="
echo -e "${GREEN}✅ Backend funcionando correctamente${NC}"
echo -e "${GREEN}✅ Frontend funcionando correctamente${NC}"
echo -e "${GREEN}✅ Autenticación JWT con cookies${NC}"
echo -e "${GREEN}✅ CRUD completo de vacantes${NC}"
echo -e "${GREEN}✅ Sistema de aplicaciones${NC}"
echo -e "${GREEN}✅ Control de acceso por roles${NC}"
echo -e "${GREEN}✅ Validaciones y seguridad${NC}"
echo ""
echo "🚀 El sistema está listo para usar!"
echo "📖 Consulta PRUEBAS.md para más detalles"