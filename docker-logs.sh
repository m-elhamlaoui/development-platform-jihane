#!/bin/bash

# Development Platform Jihane - Docker Logs Script

echo "📋 Development Platform Jihane - Container Logs"
echo "=============================================="

# Function to show logs for a specific service
show_logs() {
    local service=$1
    echo ""
    echo "📋 Logs for $service:"
    echo "----------------------------------------"
    docker-compose logs --tail=50 $service
}

# Check if a specific service is requested
if [ $# -eq 1 ]; then
    case $1 in
        frontend|backend|database|redis|prometheus|grafana)
            show_logs $1
            ;;
        *)
            echo "❌ Unknown service: $1"
            echo "Available services: frontend, backend, database, redis, prometheus, grafana"
            exit 1
            ;;
    esac
else
    # Show logs for all services
    echo "📋 All container logs (last 20 lines each):"
    docker-compose logs --tail=20
    
    echo ""
    echo "💡 To view logs for a specific service, run:"
    echo "   ./docker-logs.sh <service-name>"
    echo "   Available services: frontend, backend, database, redis, prometheus, grafana"
    echo ""
    echo "💡 To follow logs in real-time, run:"
    echo "   docker-compose logs -f <service-name>"
fi 