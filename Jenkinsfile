pipeline {
    agent any

    environment {
        APP_NAME = 'hotel-booking'
        BACKEND_IMAGE = 'hotel-backend:1.0'
    }

    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Show Versions') {
            steps {
                bat 'java -version'
                bat 'docker --version'
                bat 'node --version'
                bat 'npm --version'
            }
        }

        stage('Install Dependencies') {
            steps {
                bat 'cd backend && npm ci'
            }
        }

        stage('Automated Tests') {
            steps {
                bat 'cd backend && npm test'
            }
        }

        stage('Security Validation') {
            steps {
                bat 'cd backend && npm audit --audit-level=high || exit /b 0'
            }
        }

        stage('Docker Build') {
            steps {
                bat 'docker build -t %BACKEND_IMAGE% ./backend'
            }
        }

        stage('Docker Compose Test') {
    steps {
        bat 'docker-compose -p jenkins-hotel-test -f docker-compose.yml -f docker-compose.jenkins.yml up -d'
        bat 'timeout /t 15 /nobreak'
        bat 'docker-compose -p jenkins-hotel-test -f docker-compose.yml -f docker-compose.jenkins.yml ps'
        bat 'curl --fail http://localhost:5001/api/health'
    }
}

        stage('Kubernetes Validate') {
            steps {
                bat 'kubectl apply --dry-run=client -f k8s/namespace.yaml'
                bat 'kubectl apply --dry-run=client -f k8s/mysql.yaml'
                bat 'kubectl apply --dry-run=client -f k8s/backend.yaml'
                bat 'kubectl apply --dry-run=client -f k8s/frontend.yaml'
            }
        }
    }

    post {
    always {
        bat 'docker-compose -p jenkins-hotel-test -f docker-compose.yml -f docker-compose.jenkins.yml down --remove-orphans || exit /b 0'
        echo 'Pipeline completed. Check console output for tests, Docker and Kubernetes validation.'
    }
}
