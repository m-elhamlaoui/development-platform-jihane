#!/bin/bash

# Development Platform Jihane - Minikube Deployment Script
set -e

echo "🚀 Development Platform Jihane - Minikube Management"
echo "=================================================="

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to check if minikube is running
check_minikube() {
    if ! minikube status > /dev/null 2>&1; then
        echo -e "${RED}❌ Minikube is not running${NC}"
        echo -e "${YELLOW}Starting Minikube...${NC}"
        minikube start --driver=docker --memory=3500 --cpus=2
    else
        echo -e "${GREEN}✅ Minikube is running${NC}"
    fi
}

# Function to deploy application
deploy_app() {
    echo -e "${BLUE}📋 Deploying application to Minikube...${NC}"
    
    # Configure Docker environment
    eval $(minikube docker-env)
    
    # Build images
    echo -e "${YELLOW}🔧 Building backend image...${NC}"
    docker build -t development-platform-jihane/backend:latest ./backend
    
    echo -e "${YELLOW}🎨 Building frontend image...${NC}"
    cd frontend
    docker build -f Dockerfile.k8s -t development-platform-jihane/frontend:k8s .
    cd ..
    
    # Deploy to Kubernetes
    echo -e "${YELLOW}🚀 Deploying to Kubernetes...${NC}"
    kubectl apply -f k8s/postgres.yaml
    kubectl apply -f k8s/backend.yaml
    kubectl apply -f k8s/frontend.yaml
    kubectl apply -f k8s/ingress.yaml
    
    # Update frontend to use k8s image
    kubectl set image deployment/frontend-deployment frontend=development-platform-jihane/frontend:k8s
    
    echo -e "${GREEN}✅ Deployment complete!${NC}"
}

# Function to check status
check_status() {
    echo -e "${BLUE}📊 Checking application status...${NC}"
    echo ""
    echo -e "${YELLOW}Pods:${NC}"
    kubectl get pods
    echo ""
    echo -e "${YELLOW}Services:${NC}"
    kubectl get services
    echo ""
    echo -e "${YELLOW}Ingress:${NC}"
    kubectl get ingress
}

# Function to setup access
setup_access() {
    echo -e "${BLUE}🌐 Setting up access...${NC}"
    
    # Check if domain is in hosts file
    if ! grep -q "development-platform.local" /etc/hosts; then
        echo -e "${YELLOW}Adding domain to hosts file...${NC}"
        echo "127.0.0.1 development-platform.local" | sudo tee -a /etc/hosts
    else
        echo -e "${GREEN}✅ Domain already in hosts file${NC}"
    fi
    
    echo -e "${YELLOW}⚠️  Important: You need to run 'minikube tunnel' in a separate terminal${NC}"
    echo -e "${YELLOW}   Keep that terminal open while using the application${NC}"
}

# Function to test connectivity
test_app() {
    echo -e "${BLUE}🧪 Testing application connectivity...${NC}"
    
    echo -e "${YELLOW}Testing backend health...${NC}"
    if curl -s -f http://development-platform.local/api/health > /dev/null; then
        echo -e "${GREEN}✅ Backend is accessible${NC}"
    else
        echo -e "${RED}❌ Backend not accessible${NC}"
        echo -e "${YELLOW}Make sure 'minikube tunnel' is running${NC}"
    fi
    
    echo -e "${YELLOW}Testing frontend...${NC}"
    if curl -s -f http://development-platform.local > /dev/null; then
        echo -e "${GREEN}✅ Frontend is accessible${NC}"
    else
        echo -e "${RED}❌ Frontend not accessible${NC}"
        echo -e "${YELLOW}Make sure 'minikube tunnel' is running${NC}"
    fi
}

# Function to show access info
show_access_info() {
    echo ""
    echo -e "${GREEN}🎉 Your Development Platform Jihane is ready!${NC}"
    echo -e "${BLUE}📋 Access Information:${NC}"
    echo -e "   🌐 Frontend: ${YELLOW}http://development-platform.local${NC}"
    echo -e "   🔧 Backend API: ${YELLOW}http://development-platform.local/api${NC}"
    echo -e "   🏥 Health Check: ${YELLOW}http://development-platform.local/api/health${NC}"
    echo ""
    echo -e "${BLUE}📋 Default Credentials:${NC}"
    echo -e "   📧 Email: ${YELLOW}admin@development-platform.com${NC}"
    echo -e "   🔑 Password: ${YELLOW}admin123${NC}"
    echo ""
    echo -e "${YELLOW}⚠️  Remember to keep 'minikube tunnel' running in a separate terminal!${NC}"
}

# Function to cleanup
cleanup() {
    echo -e "${BLUE}🧹 Cleaning up...${NC}"
    kubectl delete -f k8s/ --ignore-not-found=true
    echo -e "${GREEN}✅ Cleanup complete${NC}"
}

# Main menu
case "${1:-}" in
    "deploy")
        check_minikube
        deploy_app
        setup_access
        check_status
        show_access_info
        ;;
    "status")
        check_status
        ;;
    "test")
        test_app
        ;;
    "cleanup")
        cleanup
        ;;
    "tunnel")
        echo -e "${YELLOW}Starting Minikube tunnel...${NC}"
        echo -e "${RED}Keep this terminal open!${NC}"
        minikube tunnel
        ;;
    *)
        echo "Usage: $0 {deploy|status|test|cleanup|tunnel}"
        echo ""
        echo "Commands:"
        echo "  deploy  - Deploy the application to Minikube"
        echo "  status  - Check application status"
        echo "  test    - Test application connectivity"
        echo "  cleanup - Remove all deployments"
        echo "  tunnel  - Start Minikube tunnel (keep running)"
        echo ""
        echo "Quick start:"
        echo "  1. ./minikube-deploy.sh deploy"
        echo "  2. ./minikube-deploy.sh tunnel (in new terminal)"
        echo "  3. Visit http://development-platform.local"
        ;;
esac 