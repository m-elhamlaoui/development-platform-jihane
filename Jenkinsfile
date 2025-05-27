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
                    if command -v docker >/dev/null 2>&1; then
                        docker --version
                        
                        if [ -f frontend/Dockerfile ]; then
                            docker build -t ${FRONTEND_IMAGE} frontend/
                        fi
                        
                        if [ -f backend/Dockerfile ]; then
                            docker build -t ${BACKEND_IMAGE} backend/
                        fi
                    else
                        if [ -f /usr/local/bin/docker ]; then
                            /usr/local/bin/docker --version
                            
                            if [ -f frontend/Dockerfile ]; then
                                /usr/local/bin/docker build -t ${FRONTEND_IMAGE} frontend/
                            fi
                            
                            if [ -f backend/Dockerfile ]; then
                                /usr/local/bin/docker build -t ${BACKEND_IMAGE} backend/
                            fi
                        else
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
                            echo $DOCKER_PASSWORD | docker login -u $DOCKER_USERNAME --password-stdin
                        else
                            if [ -f /usr/local/bin/docker ]; then
                                echo $DOCKER_PASSWORD | /usr/local/bin/docker login -u $DOCKER_USERNAME --password-stdin
                            else
                                exit 1
                            fi
                        fi
                    '''
                }
            }
        }
        
        stage('Push to Registry') {
            steps {
                sh '''
                    if command -v docker >/dev/null 2>&1; then
                        docker push ${FRONTEND_IMAGE}
                        docker push ${BACKEND_IMAGE}
                    else
                        if [ -f /usr/local/bin/docker ]; then
                            /usr/local/bin/docker push ${FRONTEND_IMAGE}
                            /usr/local/bin/docker push ${BACKEND_IMAGE}
                        else
                            exit 1
                        fi
                    fi
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