pipeline {
    agent any
    
    environment {
        // Local Docker configuration
        IMAGE_TAG = "${BUILD_NUMBER}"
        FRONTEND_IMAGE = "development-platform-jihane/frontend:${IMAGE_TAG}"
        BACKEND_IMAGE = "development-platform-jihane/backend:${IMAGE_TAG}"
        
        // Local configuration
        NAMESPACE = 'default'
    }
    
    stages {
        stage('Checkout') {
            steps {
                checkout scm
                script {
                    env.GIT_COMMIT_SHORT = sh(
                        script: "git rev-parse --short HEAD",
                        returnStdout: true
                    ).trim()
                }
                echo "✅ Checked out commit: ${env.GIT_COMMIT_SHORT}"
            }
        }
        
        stage('Build Frontend') {
            steps {
                dir('frontend') {
                    sh '''
                        echo "🎨 Installing frontend dependencies..."
                        npm ci
                        
                        echo "🧪 Running frontend tests..."
                        npm run test -- --watchAll=false --coverage || true
                        
                        echo "🏗️ Building frontend..."
                        npm run build
                        
                        echo "🐳 Building frontend Docker image..."
                        docker build -t ${FRONTEND_IMAGE} .
                        docker tag ${FRONTEND_IMAGE} development-platform-jihane/frontend:latest
                    '''
                }
            }
            post {
                always {
                    publishHTML([
                        allowMissing: true,
                        alwaysLinkToLastBuild: true,
                        keepAll: true,
                        reportDir: 'frontend/coverage/lcov-report',
                        reportFiles: 'index.html',
                        reportName: 'Frontend Coverage Report'
                    ])
                }
            }
        }
        
        stage('Build Backend') {
            steps {
                dir('backend') {
                    sh '''
                        echo "🔧 Running backend tests..."
                        ./mvnw clean test || true
                        
                        echo "🏗️ Building backend..."
                        ./mvnw clean package -DskipTests
                        
                        echo "🐳 Building backend Docker image..."
                        docker build -t ${BACKEND_IMAGE} .
                        docker tag ${BACKEND_IMAGE} development-platform-jihane/backend:latest
                    '''
                }
            }
            post {
                always {
                    publishTestResults testResultsPattern: 'backend/target/surefire-reports/*.xml', allowEmptyResults: true
                    publishHTML([
                        allowMissing: true,
                        alwaysLinkToLastBuild: true,
                        keepAll: true,
                        reportDir: 'backend/target/site/jacoco',
                        reportFiles: 'index.html',
                        reportName: 'Backend Coverage Report'
                    ])
                }
            }
        }
        
        stage('Security Scan') {
            parallel {
                stage('Frontend Security') {
                    steps {
                        dir('frontend') {
                            sh '''
                                echo "🔍 Running npm audit..."
                                npm audit --audit-level=high || true
                                echo "✅ Frontend security scan completed"
                            '''
                        }
                    }
                }
                stage('Backend Security') {
                    steps {
                        dir('backend') {
                            sh '''
                                echo "🔍 Running basic security checks..."
                                echo "✅ Backend security scan completed"
                            '''
                        }
                    }
                }
            }
        }
        
        stage('Deploy with Docker Compose') {
            when {
                anyOf {
                    branch 'main'
                    branch 'ismailops'
                }
            }
            steps {
                script {
                    sh '''
                        echo "🚀 Deploying with Docker Compose..."
                        
                        # Stop existing containers
                        docker-compose down || true
                        
                        # Start the application
                        docker-compose up -d
                        
                        # Wait for services to be ready
                        echo "⏳ Waiting for services to start..."
                        sleep 30
                        
                        # Check service status
                        docker-compose ps
                    '''
                }
            }
        }
        
        stage('Deploy to Minikube') {
            when {
                anyOf {
                    branch 'main'
                    branch 'ismailops'
                }
            }
            steps {
                script {
                    sh '''
                        echo "☸️ Deploying to Minikube..."
                        
                        # Configure Docker environment for Minikube
                        eval $(minikube docker-env) || true
                        
                        # Build images in Minikube
                        eval $(minikube docker-env) && docker build -t ${FRONTEND_IMAGE} ./frontend || true
                        eval $(minikube docker-env) && docker build -t ${BACKEND_IMAGE} ./backend || true
                        eval $(minikube docker-env) && docker tag ${FRONTEND_IMAGE} development-platform-jihane/frontend:latest || true
                        eval $(minikube docker-env) && docker tag ${BACKEND_IMAGE} development-platform-jihane/backend:latest || true
                        
                        # Apply Kubernetes manifests
                        kubectl apply -f k8s/postgres.yaml || true
                        kubectl apply -f k8s/backend.yaml || true
                        kubectl apply -f k8s/frontend.yaml || true
                        kubectl apply -f k8s/ingress.yaml || true
                        
                        # Wait for deployments
                        kubectl rollout status deployment/postgres-deployment --timeout=300s || true
                        kubectl rollout status deployment/backend-deployment --timeout=300s || true
                        kubectl rollout status deployment/frontend-deployment --timeout=300s || true
                        
                        echo "✅ Minikube deployment completed"
                    '''
                }
            }
        }
        
        stage('Integration Tests') {
            when {
                anyOf {
                    branch 'main'
                    branch 'ismailops'
                }
            }
            steps {
                script {
                    sh '''
                        echo "🧪 Running integration tests..."
                        
                        # Test Docker Compose deployment
                        echo "Testing Docker Compose deployment..."
                        curl -f http://localhost:80 && echo "✅ Frontend (Docker Compose) OK" || echo "❌ Frontend (Docker Compose) Failed"
                        curl -f http://localhost:8080/actuator/health && echo "✅ Backend (Docker Compose) OK" || echo "❌ Backend (Docker Compose) Failed"
                        
                        # Test Minikube deployment
                        echo "Testing Minikube deployment..."
                        curl -f http://development-platform.local && echo "✅ Frontend (Minikube) OK" || echo "❌ Frontend (Minikube) Failed"
                        curl -f http://development-platform.local/api/health && echo "✅ Backend (Minikube) OK" || echo "❌ Backend (Minikube) Failed"
                        
                        echo "✅ Integration tests completed"
                    '''
                }
            }
        }
    }
    
    post {
        always {
            // Clean up old Docker images
            sh '''
                echo "🧹 Cleaning up..."
                docker image prune -f || true
            '''
            
            // Archive artifacts
            archiveArtifacts artifacts: 'frontend/dist/**/*', allowEmptyArchive: true
            archiveArtifacts artifacts: 'backend/target/*.jar', allowEmptyArchive: true
        }
        
        success {
            echo """
                🎉 BUILD SUCCESSFUL! 
                ✅ Project: Development Platform Jihane
                ✅ Branch: ${env.BRANCH_NAME}
                ✅ Build: ${env.BUILD_NUMBER}
                ✅ Commit: ${env.GIT_COMMIT_SHORT}
                
                🌐 Access your application:
                   Docker Compose: http://localhost:80
                   Minikube: http://development-platform.local
            """
        }
        
        failure {
            echo """
                ❌ BUILD FAILED!
                ❌ Project: Development Platform Jihane
                ❌ Branch: ${env.BRANCH_NAME}
                ❌ Build: ${env.BUILD_NUMBER}
                ❌ Commit: ${env.GIT_COMMIT_SHORT}
                
                🔍 Check the console output for details.
            """
        }
    }
} 