#!/bin/bash

# Development Platform Jihane - Jenkins Startup Script

set -e

echo "🚀 Starting Jenkins CI/CD Environment for Development Platform Jihane..."

# Check if Docker is running
if ! docker info > /dev/null 2>&1; then
    echo "❌ Docker is not running. Please start Docker first."
    exit 1
fi

# Create necessary directories
mkdir -p jenkins_config/jobs
mkdir -p jenkins_config/secrets

# Generate Jenkins agent secret if not exists
if [ ! -f jenkins_config/secrets/agent-secret ]; then
    echo "🔑 Generating Jenkins agent secret..."
    openssl rand -hex 32 > jenkins_config/secrets/agent-secret
fi

# Set environment variables
export JENKINS_AGENT_SECRET=$(cat jenkins_config/secrets/agent-secret)

echo "🏗️  Building custom Jenkins image..."
docker build -t development-platform-jenkins:latest .

echo "🐳 Starting Jenkins services..."
docker-compose up -d

echo "⏳ Waiting for Jenkins to start..."
sleep 30

# Wait for Jenkins to be ready
echo "🔍 Checking Jenkins health..."
until curl -s http://localhost:8081/login > /dev/null; do
    echo "Waiting for Jenkins to be ready..."
    sleep 10
done

# Get initial admin password
if [ -f jenkins_home/secrets/initialAdminPassword ]; then
    INITIAL_PASSWORD=$(docker exec development-platform-jenkins cat /var/jenkins_home/secrets/initialAdminPassword)
    echo "🔐 Jenkins Initial Admin Password: $INITIAL_PASSWORD"
fi

echo ""
echo "✅ Jenkins CI/CD Environment Started Successfully!"
echo ""
echo "🌐 Access Points:"
echo "   Jenkins: http://localhost:8081"
echo "   SonarQube: http://localhost:9000 (admin/admin)"
echo "   Nexus: http://localhost:8082 (admin/admin123)"
echo ""
echo "📋 Next Steps:"
echo "1. Access Jenkins at http://localhost:8081"
echo "2. Use the initial admin password above to unlock Jenkins"
echo "3. Install suggested plugins or use the pre-configured setup"
echo "4. Create your first admin user"
echo "5. Configure your pipeline for Development Platform Jihane"
echo ""
echo "🔧 Useful Commands:"
echo "   View logs: docker-compose logs -f jenkins"
echo "   Stop services: docker-compose down"
echo "   Restart Jenkins: docker-compose restart jenkins" 