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
                    docker --version
                    
                    if [ -f frontend/Dockerfile ]; then
                        docker build -t ${FRONTEND_IMAGE} frontend/
                    fi
                    
                    if [ -f backend/Dockerfile ]; then
                        docker build -t ${BACKEND_IMAGE} backend/
                    fi
                '''
            }
        }
        
        stage('Docker Login') {
            steps {
                withCredentials([usernamePassword(credentialsId: 'docker-creds', usernameVariable: 'DOCKER_USERNAME', passwordVariable: 'DOCKER_PASSWORD')]) {
                    sh '''
                        echo $DOCKER_PASSWORD | docker login -u $DOCKER_USERNAME --password-stdin
                    '''
                }
            }
        }
        
        stage('Push to Registry') {
            steps {
                sh '''
                    docker push ${FRONTEND_IMAGE}
                    docker push ${BACKEND_IMAGE}
                '''
            }
        }
    }
    
    post {
        success {
            echo "BUILD SUCCESSFUL - Branch: ${env.BRANCH_NAME}, Build: ${env.BUILD_NUMBER}"
        }
        
        failure {
            echo "BUILD FAILED - Branch: ${env.BRANCH_NAME}, Build: ${env.BUILD_NUMBER}"
        }
    }
} 