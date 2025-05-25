#!/bin/bash

# Development Platform Jihane - Deployment Script

set -e

echo "🚀 Starting deployment of Development Platform Jihane..."

# Configuration
NAMESPACE="development-platform"
FRONTEND_IMAGE="development-platform-jihane/frontend:latest"
BACKEND_IMAGE="development-platform-jihane/backend:latest"

# Create namespace if it doesn't exist
echo "📦 Creating namespace..."
kubectl create namespace $NAMESPACE --dry-run=client -o yaml | kubectl apply -f -

# Build and push frontend image
echo "🏗️  Building frontend image..."
docker build -t $FRONTEND_IMAGE -f frontend/Dockerfile frontend/

# Build and push backend image
echo "🏗️  Building backend image..."
docker build -t $BACKEND_IMAGE -f backend/Dockerfile backend/

# Apply Kubernetes configurations
echo "⚙️  Applying Kubernetes configurations..."

# Apply secrets and configs first
kubectl apply -f k8s/secret.yaml -n $NAMESPACE
kubectl apply -f k8s/backend-config.yaml -n $NAMESPACE

# Apply applications
kubectl apply -f k8s/backend.yaml -n $NAMESPACE
kubectl apply -f k8s/frontend.yaml -n $NAMESPACE

# Apply ingress
kubectl apply -f k8s/ingress.yaml -n $NAMESPACE

# Apply monitoring (optional)
echo "📊 Applying monitoring stack..."
kubectl apply -f k8s/promotheus.yaml -n $NAMESPACE
kubectl apply -f k8s/promotheus-config.yaml -n $NAMESPACE
kubectl apply -f k8s/grafana.yaml -n $NAMESPACE

# Wait for deployments
echo "⏳ Waiting for deployments to be ready..."
kubectl wait --for=condition=available --timeout=300s deployment/frontend-deployment -n $NAMESPACE
kubectl wait --for=condition=available --timeout=300s deployment/backend-deployment -n $NAMESPACE

# Get service information
echo "✅ Deployment completed!"
echo ""
echo "📋 Service Information:"
kubectl get services -n $NAMESPACE
echo ""
echo "🌐 Access your application at: http://development-platform-jihane.local"
echo "📊 Prometheus: http://development-platform-jihane.local/prometheus"
echo "📈 Grafana: http://development-platform-jihane.local/grafana"
echo ""
echo "💡 Don't forget to add 'development-platform-jihane.local' to your /etc/hosts file pointing to your ingress IP" 