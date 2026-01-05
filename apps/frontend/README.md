# 🎨 Frontend - RIWI Employment API

## 🚀 Setup

**Frontend:** React + Vite + Tailwind + Shadcn/ui  
**Port:** http://localhost:3001  
**Backend API:** http://localhost:3000

## 🔧 Installation

```bash
cd frontend
npm install
npm run dev
```

## 🔐 Test Credentials

| Role | Email | Password |
|-----|-------|----------|
| **ADMIN** | admin@riwi.io | admin123 |
| **GESTOR** | gestor@riwi.io | admin123 |
| **CODER** | (free registration) | - |

## 🌐 URLs

- **Frontend:** http://localhost:3001
- **Backend API:** http://localhost:3000
- **Swagger:** http://localhost:3000/api/docs

## ✨ Features

- ✅ **Real authentication** with NestJS API
- ✅ **HttpOnly cookies** automatic
- ✅ **Role-based access control**
- ✅ **Modern UI** with Tailwind + Shadcn
- ✅ **Responsive design**
- ✅ **Global state** with Zustand
- ✅ **Validations** with React Hook Form + Zod

## 🧪 Test Flow

1. **Start Backend:** `npm run start:dev` (port 3000)
2. **Start Frontend:** `cd frontend && npm run dev` (port 3001)
3. **Open:** http://localhost:3001
4. **Login:** admin@riwi.io / admin123
5. **Test features** according to role

## 🎯 Features by Role

### ADMIN
- ✅ View all vacancies
- ✅ Create/edit/delete vacancies
- ✅ View all applications
- ✅ Manage users

### GESTOR
- ✅ View vacancies
- ✅ Create/edit vacancies
- ✅ View applications
- ✅ Activate/deactivate vacancies

### CODER
- ✅ View available vacancies
- ✅ Apply to vacancies (max. 3)
- ✅ View my applications
- ✅ Free registration

The complete system is working! 🎉