#!/bin/bash

# Development Platform Jihane - Frontend Rebuild Script
echo "🔧 Rebuilding Frontend with Fixed API Proxy Configuration"
echo "========================================================="

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Set minikube docker environment
echo -e "${BLUE}🐳 Setting up Minikube Docker environment...${NC}"
eval $(minikube docker-env)

# Build the frontend image
echo -e "${BLUE}🏗️  Building frontend image...${NC}"
cd frontend
docker build -t development-platform-jihane/frontend:latest .
if [ $? -ne 0 ]; then
    echo -e "${RED}❌ Frontend build failed${NC}"
    exit 1
fi
cd ..

# Delete existing frontend deployment
echo -e "${BLUE}🗑️  Deleting existing frontend deployment...${NC}"
kubectl delete deployment frontend-deployment || true

# Wait a moment for cleanup
sleep 5

# Redeploy frontend
echo -e "${BLUE}🚀 Redeploying frontend...${NC}"
kubectl apply -f k8s/frontend.yaml

# Wait for deployment to be ready
echo -e "${BLUE}⏳ Waiting for frontend deployment to be ready...${NC}"
kubectl wait --for=condition=available --timeout=300s deployment/frontend-deployment

# Check deployment status
echo -e "${BLUE}📊 Checking deployment status...${NC}"
kubectl get pods -l app=frontend

echo ""
echo -e "${GREEN}🎉 SUCCESS! Frontend has been rebuilt and redeployed!${NC}"
echo ""
echo -e "${YELLOW}📋 NEXT STEPS:${NC}"
echo -e "   1. Access your app at: http://development-platform.local"
echo -e "   2. Try registering a new user - API requests should now work!"
echo -e "   3. Check logs if needed: kubectl logs -l app=frontend"
echo ""
echo -e "${YELLOW}🔍 WHAT WAS FIXED:${NC}"
echo -e "   ✅ Added API proxy configuration to nginx-k8s.conf"
echo -e "   ✅ Updated Dockerfile to use nginx-k8s.conf"
echo -e "   ✅ API requests now properly route to backend-service:8080"
echo -e "   ✅ No more HTML responses for JSON API calls" 