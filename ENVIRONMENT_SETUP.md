# Environment Setup Guide

This guide explains how to set up environment files for the DataTodo application with proper API prefix configuration for nginx deployment.

## Overview

The application is configured to use the `/api` prefix for all backend routes, making it easy to deploy with nginx where you only need to change the domain name without modifying any other configuration.

## Quick Setup

### Windows
```bash
setup-env.bat
```

### Linux/macOS
```bash
chmod +x setup-env.sh
./setup-env.sh
```

## Manual Setup

### Backend Environment Files

#### Development (`backend/.env.development`)
```env
NODE_ENV=development
DATABASE_URL="postgresql://postgres:password@localhost:5432/datodo_dev?schema=public"
JWT_SECRET=your-super-secret-jwt-key-for-development-only
JWT_REFRESH_SECRET=your-super-secret-refresh-jwt-key-for-development-only
JWT_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=7d
FRONTEND_URL=http://localhost:3000
PORT=3001
API_PREFIX=api
SWAGGER_ENABLED=true
LOG_LEVEL=debug
```

#### Production (`backend/.env.production`)
```env
NODE_ENV=production
DATABASE_URL="postgresql://postgres:password@postgres:5432/datodo_prod?schema=public"
JWT_SECRET=your-super-secret-jwt-key-for-production-change-this
JWT_REFRESH_SECRET=your-super-secret-refresh-jwt-key-for-production-change-this
JWT_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=7d
FRONTEND_URL=https://yourdomain.com
PORT=3001
API_PREFIX=api
SWAGGER_ENABLED=false
LOG_LEVEL=info
```

### Frontend Environment Files

#### Development (`frontend/.env.development`)
```env
NODE_ENV=development
NEXT_PUBLIC_API_URL=http://localhost:3001/api
NEXT_PUBLIC_APP_NAME=DataTodo
NEXT_PUBLIC_APP_VERSION=1.0.0
NEXT_PUBLIC_ENABLE_ANALYTICS=false
NEXT_PUBLIC_ENABLE_DEBUG=true
```

#### Production (`frontend/.env.production`)
```env
NODE_ENV=production
NEXT_PUBLIC_API_URL=/api
NEXT_PUBLIC_APP_NAME=DataTodo
NEXT_PUBLIC_APP_VERSION=1.0.0
NEXT_PUBLIC_ENABLE_ANALYTICS=true
NEXT_PUBLIC_ENABLE_DEBUG=false
```

## API Configuration

### Backend
The backend is configured to use the `/api` prefix in `src/main.ts`:
```typescript
app.setGlobalPrefix(process.env.API_PREFIX || 'api');
```

All routes will be prefixed with `/api`, so:
- `/auth/login` becomes `/api/auth/login`
- `/users` becomes `/api/users`
- `/data-structures` becomes `/api/data-structures`

### Frontend
The frontend API client is configured in `lib/api.ts` to use the appropriate API URL:
- Development: `http://localhost:3001/api`
- Production: `/api` (relative path for nginx proxy)

## Nginx Configuration

The `nginx.conf.example` file provides a complete nginx configuration that:

1. **Proxies API requests**: All `/api/*` requests are forwarded to the backend
2. **Serves frontend**: All other requests serve the frontend application
3. **Handles SSL**: Includes SSL configuration for production
4. **CORS support**: Proper CORS headers for API requests
5. **Security headers**: Basic security headers included

### Key nginx configuration:
```nginx
# API routes - proxy to backend
location /api/ {
    proxy_pass http://backend:3001/api/;
    # ... proxy configuration
}

# Frontend static files and SPA routing
location / {
    root /usr/share/nginx/html;
    try_files $uri $uri/ /index.html;
}
```

## Deployment

### Development
```bash
# Backend
cd backend
npm run start:dev

# Frontend
cd frontend
npm run dev
```

### Production with Docker
```bash
# Use the production docker-compose file
docker-compose -f docker-compose.production.yml up -d
```

### Production with nginx
1. Copy `nginx.conf.example` to `nginx.conf`
2. Update the domain name in the nginx configuration
3. Set up SSL certificates
4. Update the `FRONTEND_URL` in backend production environment
5. Deploy using your preferred method

## Environment Variables Reference

### Backend Variables
- `NODE_ENV`: Environment (development/production)
- `DATABASE_URL`: PostgreSQL connection string
- `JWT_SECRET`: Secret for JWT token signing
- `JWT_REFRESH_SECRET`: Secret for refresh token signing
- `JWT_EXPIRES_IN`: Access token expiration time
- `JWT_REFRESH_EXPIRES_IN`: Refresh token expiration time
- `FRONTEND_URL`: Frontend URL for CORS configuration
- `PORT`: Backend server port
- `API_PREFIX`: API route prefix (default: 'api')
- `SWAGGER_ENABLED`: Enable/disable Swagger documentation
- `LOG_LEVEL`: Logging level

### Frontend Variables
- `NODE_ENV`: Environment (development/production)
- `NEXT_PUBLIC_API_URL`: Backend API URL
- `NEXT_PUBLIC_APP_NAME`: Application name
- `NEXT_PUBLIC_APP_VERSION`: Application version
- `NEXT_PUBLIC_ENABLE_ANALYTICS`: Enable analytics
- `NEXT_PUBLIC_ENABLE_DEBUG`: Enable debug mode

## Security Notes

1. **Change JWT secrets**: Always use strong, unique secrets for production
2. **Use HTTPS**: Always use SSL certificates in production
3. **Database security**: Use strong database passwords
4. **Environment files**: Never commit `.env` files to version control
5. **CORS configuration**: Update `FRONTEND_URL` for production domain

## Troubleshooting

### Common Issues

1. **API not accessible**: Check if the backend is running and the API_PREFIX is correct
2. **CORS errors**: Verify FRONTEND_URL matches your frontend domain
3. **Database connection**: Check DATABASE_URL and ensure database is running
4. **JWT errors**: Verify JWT secrets are set and consistent

### Debug Mode
Enable debug logging by setting `LOG_LEVEL=debug` in development environment files.
