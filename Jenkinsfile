pipeline {
    agent any
    
    environment {
        IMAGE_TAG = "${BUILD_NUMBER}"
        FRONTEND_IMAGE = "ismaimadani/beyondearth-frontend:${IMAGE_TAG}"
        BACKEND_IMAGE = "ismaimadani/beyondearth-backend:${IMAGE_TAG}"
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
            }
        }
        
        stage('Build Docker Images') {
            steps {
                sh '''
                    echo "Checking Docker availability..."
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
                '''
            }
        }
        
        stage('Docker Login') {
            steps {
                withCredentials([usernamePassword(credentialsId: 'docker-creds', usernameVariable: 'DOCKER_USERNAME', passwordVariable: 'DOCKER_PASSWORD')]) {
                    sh '''
                        echo "Logging into Docker registry..."
                        echo $DOCKER_PASSWORD | docker login -u $DOCKER_USERNAME --password-stdin
                        echo "Docker login successful"
                    '''
                }
            }
        }
        
        stage('Push to Registry') {
            steps {
                sh '''
                    echo "Pushing images to registry..."
                    
                    if docker images | grep -q "${FRONTEND_IMAGE}"; then
                        echo "Pushing frontend image: ${FRONTEND_IMAGE}"
                        docker push ${FRONTEND_IMAGE}
                    else
                        echo "Frontend image not found: ${FRONTEND_IMAGE}"
                    fi
                    
                    if docker images | grep -q "${BACKEND_IMAGE}"; then
                        echo "Pushing backend image: ${BACKEND_IMAGE}"
                        docker push ${BACKEND_IMAGE}
                    else
                        echo "Backend image not found: ${BACKEND_IMAGE}"
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
                echo "Branch: ${BRANCH_NAME}"
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