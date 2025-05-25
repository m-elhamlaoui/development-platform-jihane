#!/bin/bash

# Development Platform Jihane - Monitoring Stack Deployment Script
echo "🚀 Deploying Monitoring Stack for Development Platform Jihane"
echo "============================================================="

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Function to check if command succeeded
check_status() {
    if [ $? -eq 0 ]; then
        echo -e "${GREEN}✅ $1 successful${NC}"
    else
        echo -e "${RED}❌ $1 failed${NC}"
        exit 1
    fi
}

# Check if kubectl is available
if ! command -v kubectl &> /dev/null; then
    echo -e "${RED}❌ kubectl is not installed or not in PATH${NC}"
    exit 1
fi

# Check if Minikube is running
if ! kubectl cluster-info &> /dev/null; then
    echo -e "${RED}❌ Kubernetes cluster is not accessible. Is Minikube running?${NC}"
    echo -e "${YELLOW}💡 Try: minikube start${NC}"
    exit 1
fi

echo -e "${BLUE}🔍 Checking Kubernetes cluster status...${NC}"
kubectl cluster-info
check_status "Cluster connectivity check"

echo ""
echo -e "${BLUE}📦 Deploying monitoring components...${NC}"

# Deploy secrets first
echo -e "${BLUE}🔐 Deploying secrets...${NC}"
kubectl apply -f k8s/secret.yaml
check_status "Secrets deployment"

# Deploy Prometheus configuration
echo -e "${BLUE}📊 Deploying Prometheus configuration...${NC}"
kubectl apply -f k8s/prometheus-config.yaml
check_status "Prometheus configuration deployment"

# Deploy Prometheus
echo -e "${BLUE}📊 Deploying Prometheus...${NC}"
kubectl apply -f k8s/prometheus.yaml
check_status "Prometheus deployment"

# Deploy Grafana
echo -e "${BLUE}📈 Deploying Grafana...${NC}"
kubectl apply -f k8s/grafana.yaml
check_status "Grafana deployment"

echo ""
echo -e "${BLUE}⏳ Waiting for deployments to be ready...${NC}"

# Wait for Prometheus to be ready
echo -e "${BLUE}📊 Waiting for Prometheus...${NC}"
kubectl wait --for=condition=available --timeout=300s deployment/prometheus-deployment
check_status "Prometheus readiness"

# Wait for Grafana to be ready
echo -e "${BLUE}📈 Waiting for Grafana...${NC}"
kubectl wait --for=condition=available --timeout=300s deployment/grafana-deployment
check_status "Grafana readiness"

echo ""
echo -e "${GREEN}🎉 Monitoring stack deployed successfully!${NC}"
echo ""
echo -e "${YELLOW}📋 MONITORING ENDPOINTS:${NC}"
echo -e "   📊 Prometheus: http://development-platform.local/prometheus"
echo -e "   📈 Grafana: http://development-platform.local/grafana"
echo ""
echo -e "${YELLOW}🔐 GRAFANA CREDENTIALS:${NC}"
echo -e "   👤 Username: admin"
echo -e "   🔑 Password: admin"
echo ""
echo -e "${YELLOW}🔧 USEFUL COMMANDS:${NC}"
echo -e "   📊 Check Prometheus: kubectl get pods -l app=prometheus"
echo -e "   📈 Check Grafana: kubectl get pods -l app=grafana"
echo -e "   🔍 View logs: kubectl logs -f deployment/prometheus-deployment"
echo -e "   🔍 View logs: kubectl logs -f deployment/grafana-deployment"
echo ""
echo -e "${BLUE}🌐 PORT FORWARDING (if ingress not working):${NC}"
echo -e "   📊 Prometheus: kubectl port-forward service/prometheus-service 9090:9090"
echo -e "   📈 Grafana: kubectl port-forward service/grafana-service 3000:3000"
echo ""
echo -e "${GREEN}✅ Monitoring stack is ready!${NC}" 