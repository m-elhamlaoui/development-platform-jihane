# Docker Setup - Development Platform Jihane

This guide explains how to run the Development Platform Jihane application using Docker and Docker Compose.

## Prerequisites

1. **Docker**: Install Docker Desktop or Docker Engine
2. **Docker Compose**: Usually included with Docker Desktop

### Install Docker

- **macOS**: Download Docker Desktop from [docker.com](https://www.docker.com/products/docker-desktop)
- **Windows**: Download Docker Desktop from [docker.com](https://www.docker.com/products/docker-desktop)
- **Linux**: Follow the installation guide for your distribution

## Quick Start

### 1. Clone and Navigate
```bash
git clone <your-repo>
cd development-platform-jihane
```

### 2. Configure Environment
```bash
# Copy and edit the environment file
cp docker.env .env
# Edit .env with your actual values (optional for development)
```

### 3. Run the Application
```bash
# Start all services
./docker-run.sh

# Or manually with docker-compose
docker-compose up --build
```

### 4. Access the Application
- **Frontend**: http://localhost
- **Backend API**: http://localhost:8080
- **Database**: localhost:5432
- **Redis**: localhost:6379
- **Prometheus**: http://localhost:9090
- **Grafana**: http://localhost:3000 (admin/admin)

## Services Overview

### Core Application
- **Frontend**: React + Vite application served by Nginx (Port 80)
- **Backend**: Spring Boot application (Port 8080)
- **Database**: PostgreSQL 15 (Port 5432)

### Additional Services
- **Redis**: Caching and session storage (Port 6379)
- **Prometheus**: Metrics collection (Port 9090)
- **Grafana**: Monitoring dashboards (Port 3000)

## Docker Commands

### Start Services
```bash
# Start all services in foreground
./docker-run.sh

# Start all services in background
docker-compose up -d --build

# Start specific service
docker-compose up backend
```

### Stop Services
```bash
# Stop all services
./docker-stop.sh

# Or manually
docker-compose down

# Stop and remove volumes (reset data)
docker-compose down -v
```

### View Logs
```bash
# View all logs
./docker-logs.sh

# View specific service logs
./docker-logs.sh backend
./docker-logs.sh frontend

# Follow logs in real-time
docker-compose logs -f backend
```

### Manage Containers
```bash
# List running containers
docker-compose ps

# Execute command in container
docker-compose exec backend bash
docker-compose exec database psql -U dev_user -d development_platform

# Restart specific service
docker-compose restart backend
```

## Configuration

### Environment Variables

Edit `docker.env` or create `.env` file:

```bash
# Database
POSTGRES_DB=development_platform
POSTGRES_USER=dev_user
POSTGRES_PASSWORD=dev_password

# Backend
JWT_SECRET=your-super-secret-jwt-key
SPRING_PROFILES_ACTIVE=docker

# Cloudinary (optional)
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret
```

### Database Access

```bash
# Connect to database
docker-compose exec database psql -U dev_user -d development_platform

# Or from host (if psql is installed)
psql -h localhost -p 5432 -U dev_user -d development_platform
```

### Default Credentials

- **Database**: dev_user / dev_password
- **Grafana**: admin / admin
- **Default App User**: admin / admin123

## Development Workflow

### 1. Code Changes

For **frontend** changes:
```bash
# Rebuild only frontend
docker-compose up --build frontend

# Or rebuild and restart
docker-compose restart frontend
```

For **backend** changes:
```bash
# Rebuild only backend
docker-compose up --build backend

# Or rebuild and restart
docker-compose restart backend
```

### 2. Database Changes

```bash
# Reset database (removes all data)
docker-compose down -v
docker-compose up database

# Or connect and run SQL manually
docker-compose exec database psql -U dev_user -d development_platform
```

### 3. View Application Logs

```bash
# Backend logs
docker-compose logs -f backend

# Frontend logs (nginx)
docker-compose logs -f frontend

# Database logs
docker-compose logs -f database
```

## Troubleshooting

### Common Issues

1. **Port Already in Use**
   ```bash
   # Check what's using the port
   lsof -i :8080
   
   # Kill the process or change port in docker-compose.yml
   ```

2. **Database Connection Issues**
   ```bash
   # Check database is running
   docker-compose ps database
   
   # Check database logs
   docker-compose logs database
   ```

3. **Frontend Not Loading**
   ```bash
   # Check nginx logs
   docker-compose logs frontend
   
   # Rebuild frontend
   docker-compose up --build frontend
   ```

4. **Backend API Errors**
   ```bash
   # Check backend logs
   docker-compose logs backend
   
   # Check if database is accessible
   docker-compose exec backend ping database
   ```

### Reset Everything

```bash
# Stop all containers and remove volumes
docker-compose down -v

# Remove all images
docker-compose down --rmi all

# Remove all containers and networks
docker system prune -f

# Start fresh
docker-compose up --build
```

### Performance Issues

```bash
# Check resource usage
docker stats

# Limit resources in docker-compose.yml
services:
  backend:
    deploy:
      resources:
        limits:
          memory: 1G
          cpus: '0.5'
```

## Production Considerations

For production deployment:

1. **Use specific image tags** instead of `latest`
2. **Set proper environment variables** in production
3. **Use external database** instead of containerized one
4. **Configure SSL/TLS** certificates
5. **Set up proper logging** and monitoring
6. **Use secrets management** for sensitive data
7. **Configure resource limits** and health checks

## Monitoring

### Prometheus Metrics
- Application metrics: http://localhost:9090
- Targets: http://localhost:9090/targets

### Grafana Dashboards
- Access: http://localhost:3000
- Default login: admin/admin
- Import dashboards for Spring Boot, PostgreSQL, and Nginx

### Health Checks
```bash
# Check application health
curl http://localhost:8080/actuator/health

# Check frontend
curl http://localhost/

# Check all services
docker-compose ps
``` 