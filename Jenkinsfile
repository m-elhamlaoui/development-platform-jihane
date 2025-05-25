pipeline {
    agent any
    
    environment {
        // Docker configuration
        DOCKER_REGISTRY = 'your-registry.com'  // Change to your Docker registry
        IMAGE_TAG = "${BUILD_NUMBER}"
        FRONTEND_IMAGE = "${DOCKER_REGISTRY}/development-platform-jihane/frontend:${IMAGE_TAG}"
        BACKEND_IMAGE = "${DOCKER_REGISTRY}/development-platform-jihane/backend:${IMAGE_TAG}"
        
        // Kubernetes configuration
        KUBECONFIG = credentials('kubeconfig')
        NAMESPACE = 'development-platform'
        
        // Application configuration
        DB_PASSWORD = credentials('db-password')
        JWT_SECRET = credentials('jwt-secret')
        CLOUDINARY_CREDENTIALS = credentials('cloudinary-credentials')
    }
    
    tools {
        nodejs '18'  // Make sure Node.js 18 is configured in Jenkins
        maven '3.9'  // Make sure Maven 3.9 is configured in Jenkins
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
            }
        }
        
        stage('Build Frontend') {
            steps {
                dir('frontend') {
                    sh '''
                        echo "Installing frontend dependencies..."
                        npm ci
                        
                        echo "Running frontend tests..."
                        npm run test -- --watchAll=false --coverage
                        
                        echo "Building frontend..."
                        npm run build
                        
                        echo "Building frontend Docker image..."
                        docker build -t ${FRONTEND_IMAGE} .
                        docker tag ${FRONTEND_IMAGE} ${DOCKER_REGISTRY}/development-platform-jihane/frontend:latest
                    '''
                }
            }
            post {
                always {
                    publishHTML([
                        allowMissing: false,
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
                        echo "Running backend tests..."
                        ./mvnw clean test
                        
                        echo "Building backend..."
                        ./mvnw clean package -DskipTests
                        
                        echo "Building backend Docker image..."
                        docker build -t ${BACKEND_IMAGE} .
                        docker tag ${BACKEND_IMAGE} ${DOCKER_REGISTRY}/development-platform-jihane/backend:latest
                    '''
                }
            }
            post {
                always {
                    publishTestResults testResultsPattern: 'backend/target/surefire-reports/*.xml'
                    publishHTML([
                        allowMissing: false,
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
                                echo "Running npm audit..."
                                npm audit --audit-level=high || true
                                
                                echo "Scanning frontend Docker image..."
                                docker run --rm -v /var/run/docker.sock:/var/run/docker.sock \
                                    aquasec/trivy image --exit-code 0 --severity HIGH,CRITICAL \
                                    ${FRONTEND_IMAGE} || true
                            '''
                        }
                    }
                }
                stage('Backend Security') {
                    steps {
                        dir('backend') {
                            sh '''
                                echo "Running OWASP dependency check..."
                                ./mvnw org.owasp:dependency-check-maven:check || true
                                
                                echo "Scanning backend Docker image..."
                                docker run --rm -v /var/run/docker.sock:/var/run/docker.sock \
                                    aquasec/trivy image --exit-code 0 --severity HIGH,CRITICAL \
                                    ${BACKEND_IMAGE} || true
                            '''
                        }
                    }
                }
            }
        }
        
        stage('Push Images') {
            when {
                anyOf {
                    branch 'main'
                    branch 'develop'
                }
            }
            steps {
                script {
                    docker.withRegistry("https://${DOCKER_REGISTRY}", 'docker-registry-credentials') {
                        sh '''
                            docker push ${FRONTEND_IMAGE}
                            docker push ${BACKEND_IMAGE}
                            docker push ${DOCKER_REGISTRY}/development-platform-jihane/frontend:latest
                            docker push ${DOCKER_REGISTRY}/development-platform-jihane/backend:latest
                        '''
                    }
                }
            }
        }
        
        stage('Deploy to Development') {
            when {
                branch 'develop'
            }
            steps {
                script {
                    sh '''
                        echo "Deploying to development environment..."
                        
                        # Update image tags in Kubernetes manifests
                        sed -i "s|development-platform-jihane/frontend:latest|${FRONTEND_IMAGE}|g" k8s/frontend.yaml
                        sed -i "s|development-platform-jihane/backend:latest|${BACKEND_IMAGE}|g" k8s/backend.yaml
                        
                        # Apply Kubernetes manifests
                        kubectl apply -f k8s/secret.yaml -n ${NAMESPACE}-dev
                        kubectl apply -f k8s/backend-config.yaml -n ${NAMESPACE}-dev
                        kubectl apply -f k8s/backend.yaml -n ${NAMESPACE}-dev
                        kubectl apply -f k8s/frontend.yaml -n ${NAMESPACE}-dev
                        kubectl apply -f k8s/ingress.yaml -n ${NAMESPACE}-dev
                        
                        # Wait for deployment
                        kubectl rollout status deployment/frontend-deployment -n ${NAMESPACE}-dev --timeout=300s
                        kubectl rollout status deployment/backend-deployment -n ${NAMESPACE}-dev --timeout=300s
                    '''
                }
            }
        }
        
        stage('Deploy to Production') {
            when {
                branch 'main'
            }
            steps {
                script {
                    input message: 'Deploy to production?', ok: 'Deploy'
                    
                    sh '''
                        echo "Deploying to production environment..."
                        
                        # Update image tags in Kubernetes manifests
                        sed -i "s|development-platform-jihane/frontend:latest|${FRONTEND_IMAGE}|g" k8s/frontend.yaml
                        sed -i "s|development-platform-jihane/backend:latest|${BACKEND_IMAGE}|g" k8s/backend.yaml
                        
                        # Apply Kubernetes manifests
                        kubectl apply -f k8s/secret.yaml -n ${NAMESPACE}
                        kubectl apply -f k8s/backend-config.yaml -n ${NAMESPACE}
                        kubectl apply -f k8s/backend.yaml -n ${NAMESPACE}
                        kubectl apply -f k8s/frontend.yaml -n ${NAMESPACE}
                        kubectl apply -f k8s/ingress.yaml -n ${NAMESPACE}
                        
                        # Wait for deployment
                        kubectl rollout status deployment/frontend-deployment -n ${NAMESPACE} --timeout=300s
                        kubectl rollout status deployment/backend-deployment -n ${NAMESPACE} --timeout=300s
                    '''
                }
            }
        }
        
        stage('Integration Tests') {
            when {
                anyOf {
                    branch 'main'
                    branch 'develop'
                }
            }
            steps {
                script {
                    def namespace = env.BRANCH_NAME == 'main' ? env.NAMESPACE : "${env.NAMESPACE}-dev"
                    sh """
                        echo "Running integration tests..."
                        
                        # Get service URLs
                        FRONTEND_URL=\$(kubectl get ingress -n ${namespace} -o jsonpath='{.items[0].spec.rules[0].host}')
                        BACKEND_URL=\$(kubectl get service backend-service -n ${namespace} -o jsonpath='{.spec.clusterIP}'):8080
                        
                        # Run basic health checks
                        kubectl run test-pod --image=curlimages/curl --rm -i --restart=Never -n ${namespace} -- \
                            curl -f http://\${BACKEND_URL}/actuator/health
                        
                        echo "Integration tests completed successfully!"
                    """
                }
            }
        }
    }
    
    post {
        always {
            // Clean up Docker images
            sh '''
                docker rmi ${FRONTEND_IMAGE} || true
                docker rmi ${BACKEND_IMAGE} || true
                docker system prune -f || true
            '''
            
            // Archive artifacts
            archiveArtifacts artifacts: 'frontend/dist/**/*', allowEmptyArchive: true
            archiveArtifacts artifacts: 'backend/target/*.jar', allowEmptyArchive: true
        }
        
        success {
            script {
                def namespace = env.BRANCH_NAME == 'main' ? env.NAMESPACE : "${env.NAMESPACE}-dev"
                def environment = env.BRANCH_NAME == 'main' ? 'Production' : 'Development'
                
                slackSend(
                    channel: '#deployments',
                    color: 'good',
                    message: """
                        ✅ *Deployment Successful*
                        *Project:* Development Platform Jihane
                        *Environment:* ${environment}
                        *Branch:* ${env.BRANCH_NAME}
                        *Build:* ${env.BUILD_NUMBER}
                        *Commit:* ${env.GIT_COMMIT_SHORT}
                    """
                )
            }
        }
        
        failure {
            slackSend(
                channel: '#deployments',
                color: 'danger',
                message: """
                    ❌ *Deployment Failed*
                    *Project:* Development Platform Jihane
                    *Branch:* ${env.BRANCH_NAME}
                    *Build:* ${env.BUILD_NUMBER}
                    *Commit:* ${env.GIT_COMMIT_SHORT}
                    *Stage:* ${env.STAGE_NAME}
                """
            )
        }
    }
} 