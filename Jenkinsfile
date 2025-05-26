pipeline {
    agent any
    
    environment {
        IMAGE_TAG = "${BUILD_NUMBER}"
        FRONTEND_IMAGE = "ismaimadani/beyondearth/frontend:${IMAGE_TAG}"
        BACKEND_IMAGE = "ismaimadani/beyondearth/backend:${IMAGE_TAG}"
        NAMESPACE = 'default'
    }
    
    stages {
        stage('Checkout') {
            when {
                branch 'main'
            }
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
            when {
                branch 'main'
            }
            steps {
                dir('frontend') {
                    sh '''
                        if command -v npm >/dev/null 2>&1; then
                            npm ci || npm install
                            npm run test -- --watchAll=false --coverage
                            npm run build
                        fi
                    '''
                }
            }
        }
        
        stage('Build Backend') {
            when {
                branch 'main'
            }
            steps {
                dir('backend') {
                    sh '''
                        if [ -f mvnw ] && command -v java >/dev/null 2>&1; then
                            ./mvnw clean test
                            ./mvnw clean package -DskipTests
                        fi
                    '''
                }
            }
        }
        
        stage('Build Docker Images') {
            when {
                branch 'main'
            }
            steps {
                script {
                    sh '''
                        if command -v docker >/dev/null 2>&1; then
                            echo "Building Docker images..."
                            
                            if [ -f frontend/Dockerfile ]; then
                                docker build -t ${FRONTEND_IMAGE} frontend/
                            fi
                            
                            if [ -f backend/Dockerfile ]; then
                                docker build -t ${BACKEND_IMAGE} backend/
                            fi
                            
                            docker images | grep ismaimadani/beyondearth
                        fi
                    '''
                }
            }
        }
        
        stage('Docker Login') {
            when {
                branch 'main'
            }
            steps {
                script {
                    withCredentials([usernamePassword(credentialsId: 'docker-creds', usernameVariable: 'DOCKER_USERNAME', passwordVariable: 'DOCKER_PASSWORD')]) {
                        sh '''
                            if command -v docker >/dev/null 2>&1; then
                                echo "Logging into Docker registry..."
                                echo $DOCKER_PASSWORD | docker login -u $DOCKER_USERNAME --password-stdin
                            fi
                        '''
                    }
                }
            }
        }
        
        stage('Push to Registry') {
            when {
                branch 'main'
            }
            steps {
                script {
                    sh '''
                        if command -v docker >/dev/null 2>&1; then
                            echo "Pushing images to registry..."
                            
                            if docker images | grep -q "${FRONTEND_IMAGE}"; then
                                docker push ${FRONTEND_IMAGE}
                            fi
                            
                            if docker images | grep -q "${BACKEND_IMAGE}"; then
                                docker push ${BACKEND_IMAGE}
                            fi
                        fi
                    '''
                }
            }
        }
    }
    
    post {
        always {
            sh '''
                echo "Build Number: ${BUILD_NUMBER}"
                echo "Git Commit: ${GIT_COMMIT_SHORT}"
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