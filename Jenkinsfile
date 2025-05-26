pipeline {
    agent any
    
    environment {
        IMAGE_TAG = "${BUILD_NUMBER}"
        FRONTEND_IMAGE = "ismaimadani/beyondearth-frontend:${IMAGE_TAG}"
        BACKEND_IMAGE = "ismaimadani/beyondearth-backend:${IMAGE_TAG}"
        NAMESPACE = 'default'
        PATH = "/usr/local/bin:${env.PATH}"
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
        
        stage('Build Docker Images') {
            steps {
                sh '''
                    echo "Checking Docker availability..."
                    echo "PATH: $PATH"
                    
                    if command -v docker >/dev/null 2>&1; then
                        echo "Docker is available"
                        docker --version
                        
                        echo "Building Docker images..."
                        
                        if [ -f frontend/Dockerfile ]; then
                            echo "Building frontend image: ${FRONTEND_IMAGE}"
                            docker build -t ${FRONTEND_IMAGE} frontend/
                        else
                            echo "frontend/Dockerfile not found"
                        fi
                        
                        if [ -f backend/Dockerfile ]; then
                            echo "Building backend image: ${BACKEND_IMAGE}"
                            docker build -t ${BACKEND_IMAGE} backend/
                        else
                            echo "backend/Dockerfile not found"
                        fi
                        
                        echo "Listing built images:"
                        docker images | grep ismaimadani/beyondearth || echo "No images found"
                    else
                        echo "❌ Docker is not available on this Jenkins agent"
                        echo "Trying with full path..."
                        if [ -f /usr/local/bin/docker ]; then
                            echo "Found Docker at /usr/local/bin/docker"
                            /usr/local/bin/docker --version
                        else
                            echo "Docker not found at expected location"
                            exit 1
                        fi
                    fi
                '''
            }
        }
        
        stage('Docker Login') {
            steps {
                withCredentials([usernamePassword(credentialsId: 'docker-creds', usernameVariable: 'DOCKER_USERNAME', passwordVariable: 'DOCKER_PASSWORD')]) {
                    sh '''
                        if command -v docker >/dev/null 2>&1; then
                            echo "Logging into Docker registry..."
                            echo $DOCKER_PASSWORD | docker login -u $DOCKER_USERNAME --password-stdin
                            echo "Docker login successful"
                        else
                            echo "❌ Docker not available for login"
                            exit 1
                        fi
                    '''
                }
            }
        }
        
        stage('Push to Registry') {
            steps {
                sh '''
                    if command -v docker >/dev/null 2>&1; then
                        echo "Pushing images to registry..."
                        
                        echo "Available images:"
                        docker images | grep ismaimadani/beyondearth
                        
                        echo "Pushing frontend image: ${FRONTEND_IMAGE}"
                        docker push ${FRONTEND_IMAGE}
                        
                        echo "Pushing backend image: ${BACKEND_IMAGE}"
                        docker push ${BACKEND_IMAGE}
                        
                        echo "Push completed successfully!"
                    else
                        echo "❌ Docker not available for push"
                        exit 1
                    fi
                '''
            }
        }
    }
    
    post {
        always {
            sh '''
                echo "Build Number: ${BUILD_NUMBER}"
                echo "Git Commit: ${GIT_COMMIT_SHORT}"
                echo "Branch: ${BRANCH_NAME:-unknown}"
            '''
        }
        
        success {
            echo "BUILD SUCCESSFUL - Branch: ${env.BRANCH_NAME}, Build: ${env.BUILD_NUMBER}"
        }
        
        failure {
            echo "BUILD FAILED - Branch: ${env.BRANCH_NAME}, Build: ${env.BUILD_NUMBER}"
        }
    }
} 