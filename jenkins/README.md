# Jenkins CI/CD Setup - Development Platform Jihane

This directory contains the complete Jenkins CI/CD setup for the Development Platform Jihane project.

## 🏗️ Architecture

The Jenkins setup includes:
- **Jenkins Master**: Main Jenkins instance with pre-configured plugins
- **Jenkins Agent**: Docker-based agent for running builds
- **SonarQube**: Code quality analysis
- **Nexus Repository**: Artifact management
- **Integration**: Docker, Kubernetes, and monitoring tools

## 🚀 Quick Start

### 1. Prerequisites

- Docker and Docker Compose installed
- At least 8GB RAM available
- Ports 8081, 9000, 8082 available

### 2. Start Jenkins Environment

```bash
cd jenkins
chmod +x start-jenkins.sh
./start-jenkins.sh
```

### 3. Access Services

- **Jenkins**: http://localhost:8081
- **SonarQube**: http://localhost:9000 (admin/admin)
- **Nexus**: http://localhost:8082 (admin/admin123)

## 📋 Initial Setup

### 1. Jenkins Configuration

1. **Access Jenkins** at http://localhost:8081
2. **Unlock Jenkins** using the initial admin password (displayed in startup script)
3. **Install Plugins**: Choose "Install suggested plugins" or use pre-configured setup
4. **Create Admin User**: Set up your admin credentials
5. **Configure System**: Set Jenkins URL to http://localhost:8081

### 2. Configure Credentials

Go to **Manage Jenkins > Manage Credentials** and add:

#### GitHub Credentials
- **Kind**: Username with password
- **ID**: `github-credentials`
- **Username**: Your GitHub username
- **Password**: Your GitHub personal access token

#### Docker Registry Credentials
- **Kind**: Username with password
- **ID**: `docker-registry-credentials`
- **Username**: Your Docker registry username
- **Password**: Your Docker registry password

#### Kubernetes Config
- **Kind**: Secret file
- **ID**: `kubeconfig`
- **File**: Your kubeconfig file

#### Database Password
- **Kind**: Secret text
- **ID**: `db-password`
- **Secret**: Your database password

#### JWT Secret
- **Kind**: Secret text
- **ID**: `jwt-secret`
- **Secret**: Your JWT signing secret

#### Cloudinary Credentials
- **Kind**: Username with password
- **ID**: `cloudinary-credentials`
- **Username**: Your Cloudinary API key
- **Password**: Your Cloudinary API secret

### 3. Configure Tools

Go to **Manage Jenkins > Global Tool Configuration**:

#### Node.js
- **Name**: `18`
- **Version**: NodeJS 18.x
- **Global npm packages**: `npm@latest`

#### Maven
- **Name**: `3.9`
- **Version**: 3.9.x
- **Install automatically**: ✅

#### Docker
- **Name**: `docker`
- **Install automatically**: ✅

### 4. Configure SonarQube

1. **Access SonarQube** at http://localhost:9000
2. **Login** with admin/admin
3. **Change password** when prompted
4. **Create project** for Development Platform Jihane
5. **Generate token** for Jenkins integration

#### Add SonarQube to Jenkins
1. Go to **Manage Jenkins > Configure System**
2. Find **SonarQube servers** section
3. Add server:
   - **Name**: `sonarqube`
   - **Server URL**: `http://sonarqube:9000`
   - **Server authentication token**: Add the token from SonarQube

## 🔧 Pipeline Configuration

### 1. Create Pipeline Job

1. **New Item** > **Pipeline**
2. **Name**: `development-platform-jihane`
3. **Pipeline Definition**: Pipeline script from SCM
4. **SCM**: Git
5. **Repository URL**: Your GitHub repository
6. **Credentials**: Select your GitHub credentials
7. **Branches**: `*/main` and `*/develop`
8. **Script Path**: `Jenkinsfile`

### 2. Configure Webhooks

#### GitHub Webhook
1. Go to your GitHub repository settings
2. **Webhooks** > **Add webhook**
3. **Payload URL**: `http://your-jenkins-url:8081/github-webhook/`
4. **Content type**: `application/json`
5. **Events**: Push events and Pull requests

### 3. Environment Variables

Configure these in your pipeline or Jenkins global properties:

```bash
DOCKER_REGISTRY=your-registry.com
KUBERNETES_NAMESPACE=development-platform
SONAR_PROJECT_KEY=development-platform-jihane
```

## 🔄 Pipeline Stages

The Jenkins pipeline includes these stages:

1. **Checkout**: Clone the repository
2. **Build Frontend**: Install dependencies, run tests, build React app
3. **Build Backend**: Run tests, build Spring Boot application
4. **Security Scan**: Run security scans on both frontend and backend
5. **Push Images**: Push Docker images to registry
6. **Deploy to Development**: Deploy to dev environment (develop branch)
7. **Deploy to Production**: Deploy to production (main branch, manual approval)
8. **Integration Tests**: Run integration tests after deployment

## 📊 Monitoring and Reports

### Test Reports
- **Frontend**: Coverage reports in HTML format
- **Backend**: JUnit test results and JaCoCo coverage

### Security Reports
- **npm audit**: Frontend dependency vulnerabilities
- **OWASP Dependency Check**: Backend dependency vulnerabilities
- **Trivy**: Docker image security scans

### Quality Reports
- **SonarQube**: Code quality, bugs, vulnerabilities, code smells

## 🛠️ Troubleshooting

### Common Issues

1. **Jenkins won't start**
   ```bash
   # Check Docker logs
   docker-compose logs jenkins
   
   # Restart Jenkins
   docker-compose restart jenkins
   ```

2. **Build fails with permission errors**
   ```bash
   # Fix Docker socket permissions
   sudo chmod 666 /var/run/docker.sock
   ```

3. **Kubernetes deployment fails**
   ```bash
   # Check kubeconfig
   kubectl config current-context
   
   # Verify namespace exists
   kubectl get namespaces
   ```

4. **SonarQube connection issues**
   ```bash
   # Check SonarQube logs
   docker-compose logs sonarqube
   
   # Verify network connectivity
   docker exec jenkins ping sonarqube
   ```

### Reset Jenkins

```bash
# Stop services
docker-compose down

# Remove volumes (WARNING: This deletes all data)
docker-compose down -v

# Start fresh
./start-jenkins.sh
```

## 🔐 Security Best Practices

1. **Use strong passwords** for all services
2. **Enable CSRF protection** in Jenkins
3. **Configure proper user permissions** and roles
4. **Use secrets management** for sensitive data
5. **Enable audit logging** for compliance
6. **Regular security updates** for all components

## 📈 Scaling and Production

### For Production Use:

1. **External Database**: Use external PostgreSQL for SonarQube
2. **Load Balancer**: Use nginx or cloud load balancer
3. **SSL/TLS**: Configure HTTPS for all services
4. **Backup Strategy**: Regular backups of Jenkins home and configurations
5. **High Availability**: Multiple Jenkins agents
6. **Monitoring**: Integrate with Prometheus and Grafana

### Performance Tuning:

```bash
# Increase Jenkins memory
JAVA_OPTS="-Xmx4g -XX:MaxPermSize=1g"

# Configure build executors
# Manage Jenkins > Configure System > # of executors
```

## 📚 Additional Resources

- [Jenkins Documentation](https://www.jenkins.io/doc/)
- [Pipeline Syntax](https://www.jenkins.io/doc/book/pipeline/syntax/)
- [SonarQube Integration](https://docs.sonarqube.org/latest/analysis/scan/sonarscanner-for-jenkins/)
- [Kubernetes Plugin](https://plugins.jenkins.io/kubernetes/)
- [Docker Pipeline Plugin](https://plugins.jenkins.io/docker-workflow/) 