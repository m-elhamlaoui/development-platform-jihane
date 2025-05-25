#!/bin/bash

# Development Platform Jihane - Easy Access Script
set -e

echo "🚀 Development Platform Jihane - Application Access"
echo "=================================================="

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}📋 Setting up access to your application...${NC}"

# Check if minikube is running
if ! minikube status > /dev/null 2>&1; then
    echo -e "${RED}❌ Minikube is not running${NC}"
    echo -e "${YELLOW}Please start Minikube first with: minikube start${NC}"
    exit 1
fi

# Check if pods are running
echo -e "${BLUE}🔍 Checking pod status...${NC}"
kubectl get pods

# Kill any existing port-forwards
echo -e "${BLUE}🧹 Cleaning up existing port-forwards...${NC}"
pkill -f "port-forward.*backend-service" || true
pkill -f "minikube tunnel" || true

# Start backend port-forward
echo -e "${BLUE}🔗 Setting up backend access...${NC}"
kubectl port-forward service/backend-service 8080:8080 &
BACKEND_PID=$!

# Start minikube tunnel for frontend
echo -e "${BLUE}🌐 Starting Minikube tunnel for frontend...${NC}"
minikube tunnel &
TUNNEL_PID=$!

# Wait a moment for services to start
sleep 5

# Test backend
echo -e "${BLUE}🧪 Testing backend API...${NC}"
if curl -s http://localhost:8080/api/health > /dev/null; then
    echo -e "${GREEN}✅ Backend API is accessible at http://localhost:8080${NC}"
else
    echo -e "${RED}❌ Backend API is not accessible${NC}"
fi

# Test frontend
echo -e "${BLUE}🧪 Testing frontend...${NC}"
if curl -s http://development-platform.local > /dev/null; then
    echo -e "${GREEN}✅ Frontend is accessible at http://development-platform.local${NC}"
else
    echo -e "${RED}❌ Frontend is not accessible${NC}"
fi

echo ""
echo -e "${GREEN}🎉 SUCCESS! Your Development Platform Jihane is now accessible:${NC}"
echo ""
echo -e "${YELLOW}📱 FRONTEND (Website):${NC}"
echo -e "   🌐 http://development-platform.local"
echo ""
echo -e "${YELLOW}🔧 BACKEND (API):${NC}"
echo -e "   🌐 http://localhost:8080"
echo -e "   📋 Health Check: http://localhost:8080/api/health"
echo -e "   👤 User API: http://localhost:8080/api/signup"
echo -e "   🚀 Space API: http://localhost:8080/api/space"
echo ""
echo -e "${BLUE}💡 USAGE INSTRUCTIONS:${NC}"
echo -e "   1. Open http://development-platform.local in your browser"
echo -e "   2. The frontend will automatically connect to the backend"
echo -e "   3. You can test API endpoints directly at http://localhost:8080"
echo ""
echo -e "${YELLOW}⚠️  IMPORTANT:${NC}"
echo -e "   - Keep this terminal open to maintain the connections"
echo -e "   - Press Ctrl+C to stop all services"
echo ""

# Function to cleanup on exit
cleanup() {
    echo -e "\n${YELLOW}🧹 Cleaning up...${NC}"
    kill $BACKEND_PID 2>/dev/null || true
    kill $TUNNEL_PID 2>/dev/null || true
    pkill -f "port-forward.*backend-service" || true
    pkill -f "minikube tunnel" || true
    echo -e "${GREEN}✅ Cleanup complete${NC}"
}

# Set trap to cleanup on script exit
trap cleanup EXIT

# Wait for user to press Ctrl+C
echo -e "${GREEN}✅ All services are running! Press Ctrl+C to stop.${NC}"
wait 