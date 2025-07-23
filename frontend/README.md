# Plataforma de Aprendizaje de Estructuras de Datos - Frontend

Esta es la aplicación frontend para la Plataforma de Aprendizaje de Estructuras de Datos, construida con Next.js y TypeScript.

## Características

- **Autenticación**: Autenticación basada en JWT con el backend NestJS
- **Aprendizaje de Estructuras de Datos**: Contenido teórico interactivo para varias estructuras de datos
- **Perfiles de Usuario**: Seguimiento de progreso, logros y estadísticas
- **Diseño Responsivo**: UI moderna con diseño inspirado en juegos
- **Acceso Basado en Roles**: Soporte para estudiantes, profesores y administradores

## Integración con el Backend

El frontend ha sido actualizado para trabajar con la API del backend NestJS en lugar de Supabase. El backend proporciona:

- **Endpoints de autenticación**: `/auth/register`, `/auth/login`, `/auth/logout`
- **Gestión de usuarios**: endpoints `/users/*`
- **Estructuras de datos**: endpoints `/data-structures/*`
- **Cuestionarios**: endpoints `/data-structures/*/quizzes`

## Comenzando

### Prerrequisitos

- Node.js 18+ 
- npm o pnpm
- Servidor backend ejecutándose en `http://localhost:3001`

### Instalación

1. Instalar dependencias:
```bash
npm install
# o
pnpm install
```

2. Crear archivo de entorno:
```bash
# Crear archivo .env.local
NEXT_PUBLIC_API_URL=http://localhost:3001
```

3. Ejecutar el servidor de desarrollo:
```bash
npm run dev
# o
pnpm dev
```

4. Abrir [http://localhost:3000](http://localhost:3000) en tu navegador.

## Estructura del Proyecto

```
frontend/
├── app/                    # Directorio app de Next.js
│   ├── auth/              # Páginas de autenticación
│   ├── challenges/        # Páginas de desafíos (placeholder)
│   ├── profile/           # Página de perfil de usuario
│   ├── theory/            # Página de aprendizaje teórico
│   └── page.tsx           # Dashboard principal
├── components/            # Componentes UI reutilizables
├── contexts/              # Contextos de React (auth)
├── lib/                   # Bibliotecas de utilidades
│   └── api.ts            # Cliente API para el backend
└── styles/               # Estilos globales
```

## Cliente API

El frontend utiliza un cliente API personalizado (`lib/api.ts`) para comunicarse con el backend NestJS:

- **Autenticación**: Gestión de tokens JWT
- **Obtención de datos**: Llamadas API RESTful
- **Manejo de errores**: Respuestas de error consistentes
- **Soporte TypeScript**: Seguridad de tipos completa

## Estado de las Características

### ✅ Implementado
- Autenticación de usuarios (inicio de sesión/registro)
- Gestión de perfiles de usuario
- Listado de estructuras de datos
- Visualización de contenido teórico
- Diseño UI responsivo

### 🚧 Próximamente
- Desafíos de programación interactivos
- Ejecución de código en tiempo real
- Sistema de logros
- Equipamiento/gamificación
- Integración del sistema de cuestionarios

## Desarrollo

### Agregar Nuevas Características

1. **Integración API**: Agregar nuevos métodos a `lib/api.ts`
2. **Componentes**: Crear componentes reutilizables en `components/`
3. **Páginas**: Agregar nuevas páginas en el directorio `app/`
4. **Tipos**: Definir interfaces TypeScript para nuevas estructuras de datos

### Estilos

El proyecto utiliza:
- **Tailwind CSS**: Framework CSS utility-first
- **shadcn/ui**: Biblioteca de componentes
- **Tema de juego personalizado**: Esquema de colores púrpura y dorado

### Gestión de Estado

- **React Context**: Para autenticación y estado global
- **Estado Local**: Para estado específico de componentes
- **Acciones del Servidor**: Para envíos de formularios y mutaciones de datos

## Requisitos del Backend

El frontend espera que el backend proporcione:

1. **Endpoints de autenticación** con tokens JWT
2. **Configuración CORS** para `http://localhost:3000`
3. **Gestión de usuarios** con roles (estudiante, profesor, administrador)
4. **Contenido de estructuras de datos** y metadatos
5. **Sistema de cuestionarios** para aprendizaje interactivo

## Despliegue

El frontend se puede desplegar en:
- **Vercel**: Recomendado para Next.js
- **Netlify**: Hosting alternativo
- **Docker**: Despliegue containerizado

Asegúrate de configurar la variable de entorno `NEXT_PUBLIC_API_URL` para que apunte a tu API backend.

## Contribuir

1. Haz fork del repositorio
2. Crea una rama de características
3. Haz tus cambios
4. Prueba exhaustivamente
5. Envía un pull request

## Licencia

Este proyecto es parte de la Plataforma de Aprendizaje de Estructuras de Datos. 