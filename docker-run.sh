#!/bin/bash

# Development Platform Jihane - Docker Run Script

set -e

echo "🐳 Starting Development Platform Jihane with Docker..."

# Function to cleanup
cleanup() {
    echo "🛑 Stopping containers..."
    docker-compose down
    exit 0
}

# Trap SIGINT (Ctrl+C) to cleanup
trap cleanup SIGINT

# Check if Docker is running
if ! docker info > /dev/null 2>&1; then
    echo "❌ Docker is not running. Please start Docker first."
    exit 1
fi

# Check if docker-compose is available
if ! command -v docker-compose &> /dev/null; then
    echo "❌ docker-compose is not installed. Please install docker-compose first."
    exit 1
fi

# Load environment variables
if [ -f docker.env ]; then
    echo "📋 Loading environment variables from docker.env..."
    export $(cat docker.env | grep -v '^#' | xargs)
fi

# Build and start services
echo "🏗️  Building and starting services..."
docker-compose up --build

echo "✅ All services started successfully!"
echo ""
echo "🌐 Access points:"
echo "   Frontend: http://localhost"
echo "   Backend API: http://localhost:8080"
echo "   Database: localhost:5432"
echo "   Redis: localhost:6379"
echo "   Prometheus: http://localhost:9090"
echo "   Grafana: http://localhost:3000 (admin/admin)"
echo ""
echo "Press Ctrl+C to stop all services"

# Wait for user interrupt
wait 