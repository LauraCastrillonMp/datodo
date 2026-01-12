# Datodo - Plataforma de Aprendizaje de Estructuras de Datos

¡Bienvenido a **Datodo**!  
Una plataforma interactiva y gamificada para aprender estructuras de datos desde cero, con simulaciones visuales, cuestionarios y seguimiento de progreso.

---

## Tabla de Contenidos

- [Descripción](#descripción)
- [Características](#características)
- [Capturas de Pantalla](#capturas-de-pantalla)
- [Arquitectura](#arquitectura)
- [Tecnologías](#tecnologías)
- [Instalación y Configuración](#instalación-y-configuración)
  - [Requisitos Previos](#requisitos-previos)
  - [Backend](#backend)
  - [Frontend](#frontend)
- [Uso](#uso)
- [Estructura del Proyecto](#estructura-del-proyecto)
- [Contribuir](#contribuir)
- [Licencia](#licencia)

---

## Descripción

Datodo es una plataforma educativa que combina teoría, práctica y gamificación para que estudiantes y desarrolladores dominen las estructuras de datos de manera divertida y efectiva. Incluye simuladores visuales, cuestionarios, seguimiento de progreso y un sistema de logros.

---

## Características

- **Autenticación segura:** Registro, login, refresh y roles (estudiante, profesor, admin) usando JWT.
- **Visualización interactiva:** Simuladores visuales para estructuras de datos (listas, árboles, grafos, etc).
- **Gamificación:** Sistema de logros, niveles, XP y seguimiento de progreso.
- **Cuestionarios y desafíos:** Preguntas interactivas y desafíos prácticos.
- **Panel de administración:** Gestión de contenidos, estructuras y cuestionarios para profesores y admins.
- **UI moderna y responsiva:** Basada en Tailwind CSS y componentes reutilizables.
- **Notificaciones y feedback:** Sistema de notificaciones y toasts para mejorar la experiencia de usuario.

---

## Arquitectura

El proyecto está dividido en dos partes principales:

- **Backend:** API REST construida con NestJS y Prisma ORM, conectada a una base de datos MySQL.
- **Frontend:** Aplicación web construida con Next.js y React, usando Tailwind CSS para estilos.

La comunicación entre frontend y backend se realiza mediante HTTP (REST API) y autenticación JWT.

```
datodo/
│
├── backend/   # API, lógica de negocio, base de datos
└── frontend/  # Aplicación web, UI, lógica de cliente
```

---

## Tecnologías

- **Frontend:** Next.js, React, TypeScript, Tailwind CSS, shadcn/ui
- **Backend:** NestJS, Prisma ORM, MySQL
- **Autenticación:** JWT (Access y Refresh tokens)
- **DevOps:** Docker, Vercel/Netlify (deploy)
- **Calidad:** ESLint, Prettier

---

## Instalación y Configuración

### Requisitos Previos

- Node.js >= 18.x
- npm o pnpm
- MySQL >= 8.x
- Docker (opcional, para desarrollo local)
- Git

### Backend

1. Clona el repositorio y entra a la carpeta `backend`:
    ```bash
    git clone https://github.com/tuusuario/datodo.git
    cd datodo/backend
    ```

2. Instala dependencias:
    ```bash
    npm install
    ```

3. Copia el archivo de entorno y configura tus variables:
    ```bash
    cp .env.example .env
    # Edita .env con tus credenciales de MySQL y JWT_SECRET
    ```

4. Ejecuta las migraciones y siembra la base de datos:
    ```bash
    npx prisma migrate dev
    npx prisma db seed
    ```

5. Inicia el servidor de desarrollo:
    ```bash
    npm run start:dev
    ```
    El backend estará disponible en [http://localhost:3001](http://localhost:3001) (o el puerto configurado).

### Frontend

1. En una terminal separada, entra a la carpeta `frontend`:
    ```bash
    cd ../frontend
    ```

2. Instala dependencias:
    ```bash
    npm install
    ```

3. Copia el archivo de entorno y configura la URL del backend:
    ```bash
    cp .env.example .env.local
    # Edita .env.local y pon la URL del backend, por ejemplo:
    # NEXT_PUBLIC_API_URL=http://localhost:3001
    ```

4. Inicia el servidor de desarrollo:
    ```bash
    npm run dev
    ```
    La app estará disponible en [http://localhost:3000](http://localhost:3000).

---

## Uso

1. Regístrate como estudiante, profesor o admin.
2. Explora las estructuras de datos, visualiza simulaciones y completa cuestionarios.
3. Gana XP, desbloquea logros y sigue tu progreso en el perfil.
4. Los profesores pueden crear y editar contenido y cuestionarios desde el panel de administración.

---

## Estructura del Proyecto

```
datodo/
│
├── backend/
│   ├── src/
│   │   ├── auth/           # Módulo de autenticación y roles
│   │   ├── data-structures # Lógica de estructuras de datos y simuladores
│   │   ├── users/          # Gestión de usuarios
│   │   └── prisma/         # Servicio de acceso a base de datos
│   └── prisma/             # Esquema y migraciones de base de datos
│
└── frontend/
    ├── app/                # Rutas y páginas Next.js
    ├── components/         # Componentes reutilizables de UI
    ├── contexts/           # Contextos globales (auth, notificaciones)
    ├── hooks/              # Custom hooks
    ├── lib/                # Utilidades y lógica compartida
    └── public/             # Imágenes y recursos estáticos
```

---

## Contribuir

¡Las contribuciones son bienvenidas!

1. Haz fork del repositorio.
2. Crea una rama de características (`feature/nueva-funcionalidad`).
3. Realiza tus cambios y pruebas.
4. Envía un pull request describiendo tus cambios.

Por favor, sigue las buenas prácticas de código y asegúrate de que los tests pasen antes de enviar tu PR.

---

## Licencia

Este proyecto es parte de la Plataforma de Aprendizaje de Estructuras de Datos.  
Licencia: MIT

---

> ¿Dudas o sugerencias? ¡Abre un issue o contáctanos!
