#!/bin/bash

# Development Platform Jihane - Backend Rebuild Script
echo "🔧 Rebuilding Backend with Fixed CORS Configuration"
echo "===================================================="

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Set minikube docker environment
echo -e "${BLUE}🐳 Setting up Minikube Docker environment...${NC}"
eval $(minikube docker-env)

# Build the backend image
echo -e "${BLUE}🏗️  Building backend image...${NC}"
cd backend
docker build -t development-platform-jihane/backend:latest .
if [ $? -ne 0 ]; then
    echo -e "${RED}❌ Backend build failed${NC}"
    exit 1
fi
cd ..

# Delete existing backend deployment
echo -e "${BLUE}🗑️  Deleting existing backend deployment...${NC}"
kubectl delete deployment backend-deployment || true

# Wait a moment for cleanup
sleep 5

# Redeploy backend
echo -e "${BLUE}🚀 Redeploying backend...${NC}"
kubectl apply -f k8s/backend.yaml

# Wait for deployment to be ready
echo -e "${BLUE}⏳ Waiting for backend deployment to be ready...${NC}"
kubectl wait --for=condition=available --timeout=300s deployment/backend-deployment

# Check deployment status
echo -e "${BLUE}📊 Checking deployment status...${NC}"
kubectl get pods -l app=backend

echo ""
echo -e "${GREEN}🎉 SUCCESS! Backend has been rebuilt and redeployed!${NC}"
echo ""
echo -e "${YELLOW}📋 NEXT STEPS:${NC}"
echo -e "   1. Try registering a new user - CORS should now work!"
echo -e "   2. Check logs if needed: kubectl logs -l app=backend"
echo ""
echo -e "${YELLOW}🔍 WHAT WAS FIXED:${NC}"
echo -e "   ✅ Added port 8081 to global CORS configuration"
echo -e "   ✅ Added @CrossOrigin annotation to UserController"
echo -e "   ✅ Updated all controller CORS configurations"
echo -e "   ✅ CORS requests from localhost:8081 now allowed" 