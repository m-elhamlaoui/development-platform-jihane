#!/bin/bash

# Development Platform Jihane - Backend Access Script
echo "🚀 Starting Backend Access for Development Platform Jihane"
echo "========================================================="

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Kill any existing port-forwards
echo -e "${BLUE}🧹 Cleaning up existing connections...${NC}"
pkill -f "port-forward.*backend-service" || true

# Start backend port-forward
echo -e "${BLUE}🔗 Starting backend port-forward...${NC}"
kubectl port-forward service/backend-service 8080:8080 &
BACKEND_PID=$!

# Wait for connection to establish
sleep 3

# Test the connection
echo -e "${BLUE}🧪 Testing backend connection...${NC}"
if curl -s http://localhost:8080/api/health > /dev/null; then
    echo -e "${GREEN}✅ Backend API is accessible at http://localhost:8080${NC}"
    echo -e "${GREEN}✅ Registration endpoint: http://localhost:8080/api/signup${NC}"
    echo -e "${GREEN}✅ Login endpoint: http://localhost:8080/api/login${NC}"
else
    echo -e "${RED}❌ Backend API is not accessible${NC}"
    exit 1
fi

echo ""
echo -e "${GREEN}🎉 SUCCESS! Backend is ready for your frontend!${NC}"
echo ""
echo -e "${YELLOW}📋 BACKEND ENDPOINTS:${NC}"
echo -e "   🌐 Base URL: http://localhost:8080"
echo -e "   👤 Signup: POST http://localhost:8080/api/signup"
echo -e "   🔐 Login: POST http://localhost:8080/api/login"
echo -e "   📊 Health: GET http://localhost:8080/api/health"
echo -e "   🚀 Space Data: GET http://localhost:8080/api/space/*"
echo ""
echo -e "${YELLOW}🌐 FRONTEND:${NC}"
echo -e "   📱 Website: http://development-platform.local"
echo ""
echo -e "${BLUE}💡 INSTRUCTIONS:${NC}"
echo -e "   1. Your backend is now accessible at http://localhost:8080"
echo -e "   2. Open http://development-platform.local in your browser"
echo -e "   3. Try registering a new user - it should work now!"
echo -e "   4. Keep this terminal open to maintain the connection"
echo ""

# Function to cleanup on exit
cleanup() {
    echo -e "\n${YELLOW}🧹 Stopping backend connection...${NC}"
    kill $BACKEND_PID 2>/dev/null || true
    pkill -f "port-forward.*backend-service" || true
    echo -e "${GREEN}✅ Backend connection stopped${NC}"
}

# Set trap to cleanup on script exit
trap cleanup EXIT

# Keep the script running
echo -e "${GREEN}✅ Backend is running! Press Ctrl+C to stop.${NC}"
echo -e "${BLUE}📊 Monitoring backend connection...${NC}"

# Monitor the connection
while true; do
    if ! curl -s http://localhost:8080/api/health > /dev/null; then
        echo -e "${YELLOW}⚠️  Backend connection lost, attempting to reconnect...${NC}"
        kill $BACKEND_PID 2>/dev/null || true
        kubectl port-forward service/backend-service 8080:8080 &
        BACKEND_PID=$!
        sleep 3
    fi
    sleep 10
done 