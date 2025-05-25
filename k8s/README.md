# Kubernetes Deployment - Development Platform Jihane

This directory contains Kubernetes manifests for deploying the Development Platform Jihane application.

## Architecture

The application consists of:
- **Frontend**: React + Vite application served by Nginx
- **Backend**: Spring Boot application (Java 21)
- **Database**: Configurable database (PostgreSQL/MySQL/Oracle)
- **Monitoring**: Prometheus + Grafana stack
- **Ingress**: Nginx Ingress Controller for routing

## Prerequisites

1. **Kubernetes Cluster**: Minikube, Docker Desktop, or cloud provider
2. **kubectl**: Kubernetes command-line tool
3. **Docker**: For building images
4. **Nginx Ingress Controller**: For routing traffic

### Install Nginx Ingress Controller

```bash
# For Minikube
minikube addons enable ingress

# For other clusters
kubectl apply -f https://raw.githubusercontent.com/kubernetes/ingress-nginx/controller-v1.8.1/deploy/static/provider/cloud/deploy.yaml
```

## Quick Start

### 1. Development Mode (Local)

```bash
# Run both frontend and backend locally
./dev.sh
```

### 2. Kubernetes Deployment

```bash
# Deploy to Kubernetes
./deploy.sh
```

### 3. Manual Deployment

```bash
# Create namespace
kubectl create namespace development-platform

# Apply configurations
kubectl apply -f k8s/ -n development-platform

# Check status
kubectl get pods -n development-platform
```

## Configuration Files

### Core Application
- `frontend.yaml` - React frontend deployment and service
- `backend.yaml` - Spring Boot backend deployment and service
- `ingress.yaml` - Ingress rules for routing traffic

### Configuration & Secrets
- `secret.yaml` - Application secrets (JWT, database credentials)
- `backend-config.yaml` - Backend configuration (database URLs, etc.)

### Monitoring
- `promotheus.yaml` - Prometheus deployment for metrics
- `promotheus-config.yaml` - Prometheus configuration
- `grafana.yaml` - Grafana deployment for dashboards

### Security & Access
- `jenkins-rbac.yaml` - RBAC configuration for CI/CD

## Environment Variables

### Frontend (React + Vite)
- `VITE_API_URL`: Backend API URL (default: "/api")

### Backend (Spring Boot)
- `SPRING_PROFILES_ACTIVE`: Active Spring profile
- `DB_URL`: Database connection URL
- `DB_USERNAME`: Database username
- `DB_PASSWORD`: Database password
- `JWT_SECRET`: JWT signing secret

## Accessing the Application

After deployment, add this to your `/etc/hosts` file:

```
<INGRESS_IP> development-platform-jihane.local
```

Then access:
- **Application**: http://development-platform-jihane.local
- **API**: http://development-platform-jihane.local/api
- **Prometheus**: http://development-platform-jihane.local/prometheus
- **Grafana**: http://development-platform-jihane.local/grafana

## Scaling

```bash
# Scale frontend
kubectl scale deployment frontend-deployment --replicas=3 -n development-platform

# Scale backend
kubectl scale deployment backend-deployment --replicas=2 -n development-platform
```

## Monitoring

### Prometheus Metrics
- Application metrics: http://development-platform-jihane.local/prometheus
- Targets: http://development-platform-jihane.local/prometheus/targets

### Grafana Dashboards
- Access: http://development-platform-jihane.local/grafana
- Default credentials: admin/admin

## Troubleshooting

### Check Pod Status
```bash
kubectl get pods -n development-platform
kubectl describe pod <pod-name> -n development-platform
```

### View Logs
```bash
kubectl logs -f deployment/frontend-deployment -n development-platform
kubectl logs -f deployment/backend-deployment -n development-platform
```

### Check Services
```bash
kubectl get services -n development-platform
kubectl get ingress -n development-platform
```

### Port Forward for Local Access
```bash
# Frontend
kubectl port-forward service/frontend-service 8080:80 -n development-platform

# Backend
kubectl port-forward service/backend-service 8081:8080 -n development-platform
```

## Security Considerations

1. **Secrets Management**: Update `secret.yaml` with proper base64-encoded values
2. **Database Security**: Use strong passwords and encrypted connections
3. **Network Policies**: Consider implementing network policies for production
4. **RBAC**: Review and customize `jenkins-rbac.yaml` for your needs

## Production Deployment

For production deployment:

1. **Use external database** instead of in-cluster database
2. **Configure TLS/SSL** certificates for HTTPS
3. **Set up proper monitoring** and alerting
4. **Implement backup strategies**
5. **Configure resource limits** and requests
6. **Use image tags** instead of `latest`
7. **Set up CI/CD pipeline** with proper testing

## CI/CD Integration

The `jenkins-rbac.yaml` file provides the necessary permissions for Jenkins to deploy to this namespace. Configure your CI/CD pipeline to:

1. Build and test the application
2. Build Docker images
3. Push images to registry
4. Update Kubernetes manifests
5. Deploy to cluster 