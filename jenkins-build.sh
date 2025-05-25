#!/bin/bash

# Jenkins Build Script for Development Platform Jihane
# This script helps you create and trigger a Jenkins build

set -e

echo "🚀 Development Platform Jihane - Jenkins Build Setup"
echo "=================================================="

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Jenkins configuration
JENKINS_URL="http://localhost:8081"
JOB_NAME="development-platform-jihane-build"

echo -e "${BLUE}📋 Step 1: Checking Jenkins availability...${NC}"
if curl -s -f "$JENKINS_URL" > /dev/null; then
    echo -e "${GREEN}✅ Jenkins is running at $JENKINS_URL${NC}"
else
    echo -e "${RED}❌ Jenkins is not accessible at $JENKINS_URL${NC}"
    echo "Please make sure Jenkins is running with: cd jenkins && docker-compose up -d"
    exit 1
fi

echo -e "${BLUE}📋 Step 2: Checking if job exists...${NC}"
JOB_EXISTS=$(curl -s -o /dev/null -w "%{http_code}" "$JENKINS_URL/job/$JOB_NAME/")

if [ "$JOB_EXISTS" = "200" ]; then
    echo -e "${GREEN}✅ Job '$JOB_NAME' already exists${NC}"
    
    echo -e "${BLUE}📋 Step 3: Triggering build...${NC}"
    BUILD_RESPONSE=$(curl -s -X POST "$JENKINS_URL/job/$JOB_NAME/build" -w "%{http_code}")
    
    if [[ "$BUILD_RESPONSE" == *"201"* ]]; then
        echo -e "${GREEN}✅ Build triggered successfully!${NC}"
        echo -e "${YELLOW}🔗 View build progress: $JENKINS_URL/job/$JOB_NAME/${NC}"
        
        # Wait a moment and get the latest build number
        sleep 3
        LATEST_BUILD=$(curl -s "$JENKINS_URL/job/$JOB_NAME/api/json" | grep -o '"lastBuild":{"number":[0-9]*' | grep -o '[0-9]*')
        
        if [ ! -z "$LATEST_BUILD" ]; then
            echo -e "${YELLOW}📊 Latest build: #$LATEST_BUILD${NC}"
            echo -e "${YELLOW}🔗 Build console: $JENKINS_URL/job/$JOB_NAME/$LATEST_BUILD/console${NC}"
            
            # Monitor build status
            echo -e "${BLUE}📋 Monitoring build progress...${NC}"
            while true; do
                BUILD_STATUS=$(curl -s "$JENKINS_URL/job/$JOB_NAME/$LATEST_BUILD/api/json" | grep -o '"building":[^,]*' | cut -d':' -f2)
                
                if [ "$BUILD_STATUS" = "false" ]; then
                    RESULT=$(curl -s "$JENKINS_URL/job/$JOB_NAME/$LATEST_BUILD/api/json" | grep -o '"result":"[^"]*"' | cut -d'"' -f4)
                    
                    if [ "$RESULT" = "SUCCESS" ]; then
                        echo -e "${GREEN}🎉 BUILD SUCCESSFUL!${NC}"
                        echo -e "${GREEN}✅ Your application should now be running:${NC}"
                        echo -e "   🌐 Frontend: http://localhost:80"
                        echo -e "   🔧 Backend: http://localhost:8080"
                        echo -e "   📊 Prometheus: http://localhost:9090"
                        echo -e "   📈 Grafana: http://localhost:3000"
                    else
                        echo -e "${RED}❌ BUILD FAILED with result: $RESULT${NC}"
                        echo -e "${YELLOW}🔗 Check console output: $JENKINS_URL/job/$JOB_NAME/$LATEST_BUILD/console${NC}"
                    fi
                    break
                else
                    echo -e "${YELLOW}⏳ Build #$LATEST_BUILD is still running...${NC}"
                    sleep 10
                fi
            done
        fi
    else
        echo -e "${RED}❌ Failed to trigger build${NC}"
        exit 1
    fi
else
    echo -e "${YELLOW}⚠️  Job '$JOB_NAME' does not exist${NC}"
    echo -e "${BLUE}📋 Creating Jenkins job...${NC}"
    
    # Create job configuration XML
    cat > job-config.xml << 'EOF'
<?xml version='1.1' encoding='UTF-8'?>
<flow-definition plugin="workflow-job@2.40">
  <actions/>
  <description>Development Platform Jihane - Complete CI/CD Pipeline</description>
  <keepDependencies>false</keepDependencies>
  <properties>
    <hudson.plugins.jira.JiraProjectProperty plugin="jira@3.7"/>
    <hudson.plugins.buildblocker.BuildBlockerProperty plugin="build-blocker-plugin@1.7.8">
      <useBuildBlocker>false</useBuildBlocker>
      <blockLevel>GLOBAL</blockLevel>
      <scanQueueFor>DISABLED</scanQueueFor>
      <blockingJobs></blockingJobs>
    </hudson.plugins.buildblocker.BuildBlockerProperty>
    <hudson.model.ParametersDefinitionProperty>
      <parameterDefinitions>
        <hudson.model.StringParameterDefinition>
          <name>WORKSPACE_PATH</name>
          <description>Path to the project workspace</description>
          <defaultValue>/Users/ismailelmadani/Desktop/development-platform-jihane</defaultValue>
          <trim>false</trim>
        </hudson.model.StringParameterDefinition>
      </parameterDefinitions>
    </hudson.model.ParametersDefinitionProperty>
  </properties>
  <definition class="org.jenkinsci.plugins.workflow.cps.CpsFlowDefinition" plugin="workflow-cps@2.92">
    <script>
pipeline {
    agent any
    
    environment {
        FRONTEND_IMAGE = "development-platform-jihane/frontend:${BUILD_NUMBER}"
        BACKEND_IMAGE = "development-platform-jihane/backend:${BUILD_NUMBER}"
        WORKSPACE_PATH = "${params.WORKSPACE_PATH}"
    }
    
    stages {
        stage('Checkout') {
            steps {
                script {
                    echo "🔄 Setting up workspace..."
                    sh """
                        cd ${WORKSPACE_PATH}
                        pwd && ls -la
                    """
                }
            }
        }
        
        stage('Build Frontend') {
            steps {
                script {
                    echo "🎨 Building React Frontend..."
                    sh """
                        cd ${WORKSPACE_PATH}/frontend
                        npm ci
                        npm run build
                        docker build -t \${FRONTEND_IMAGE} .
                        docker tag \${FRONTEND_IMAGE} development-platform-jihane/frontend:latest
                    """
                }
            }
        }
        
        stage('Build Backend') {
            steps {
                script {
                    echo "🔧 Building Spring Boot Backend..."
                    sh """
                        cd ${WORKSPACE_PATH}/backend
                        ./mvnw clean package -DskipTests
                        docker build -t \${BACKEND_IMAGE} .
                        docker tag \${BACKEND_IMAGE} development-platform-jihane/backend:latest
                    """
                }
            }
        }
        
        stage('Deploy') {
            steps {
                script {
                    echo "🚀 Deploying with Docker Compose..."
                    sh """
                        cd ${WORKSPACE_PATH}
                        docker-compose down || true
                        docker-compose up -d
                        sleep 30
                        docker-compose ps
                    """
                }
            }
        }
        
        stage('Test') {
            steps {
                script {
                    echo "🧪 Running Integration Tests..."
                    sh """
                        curl -f http://localhost:80 && echo "✅ Frontend OK"
                        curl -f http://localhost:8080/actuator/health && echo "✅ Backend OK"
                    """
                }
            }
        }
    }
    
    post {
        success {
            echo "✅ BUILD SUCCESSFUL! Application is running at http://localhost:80"
        }
        failure {
            echo "❌ BUILD FAILED! Check the console output for details."
        }
    }
}
    </script>
    <sandbox>true</sandbox>
  </definition>
  <triggers/>
  <disabled>false</disabled>
</flow-definition>
EOF

    # Create the job
    curl -s -X POST "$JENKINS_URL/createItem?name=$JOB_NAME" \
         -H "Content-Type: application/xml" \
         --data-binary @job-config.xml > /dev/null
    
    if [ $? -eq 0 ]; then
        echo -e "${GREEN}✅ Job created successfully!${NC}"
        rm job-config.xml
        
        # Now trigger the build
        echo -e "${BLUE}📋 Triggering first build...${NC}"
        sleep 2
        curl -s -X POST "$JENKINS_URL/job/$JOB_NAME/build" > /dev/null
        echo -e "${GREEN}✅ Build triggered!${NC}"
        echo -e "${YELLOW}🔗 View progress: $JENKINS_URL/job/$JOB_NAME/${NC}"
    else
        echo -e "${RED}❌ Failed to create job${NC}"
        rm job-config.xml
        exit 1
    fi
fi

echo ""
echo -e "${GREEN}🎉 Jenkins build setup complete!${NC}"
echo -e "${BLUE}📋 Next steps:${NC}"
echo -e "   1. Visit: $JENKINS_URL/job/$JOB_NAME/"
echo -e "   2. Monitor the build progress"
echo -e "   3. Once complete, access your app at http://localhost:80"
echo "" 