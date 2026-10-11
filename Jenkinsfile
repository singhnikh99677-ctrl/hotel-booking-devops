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

                sleep time: 15, unit: 'SECONDS'

                bat 'docker-compose -p jenkins-hotel-test -f docker-compose.yml -f docker-compose.jenkins.yml ps'

                script {
                    int attempts = 0
                    boolean healthy = false

                    while (attempts < 5) {
                        int status = bat(
                            returnStatus: true,
                            script: 'curl.exe --fail http://localhost:5001/api/health'
                        )

                        if (status == 0) {
                            healthy = true
                            echo 'Backend health check passed.'
                            break
                        }

                        attempts++

                        if (attempts < 5) {
                            echo "Health check failed. Retrying in 5 seconds. Attempt ${attempts + 1} of 5."
                            sleep time: 5, unit: 'SECONDS'
                        }
                    }

                    if (!healthy) {
                        error('Backend health check failed after 5 attempts.')
                    }
                }
            }
        }
    }

    post {
        always {
            bat 'docker-compose -p jenkins-hotel-test -f docker-compose.yml -f docker-compose.jenkins.yml down --remove-orphans || exit /b 0'

            echo 'Pipeline completed. Check console output for test, Docker build and Compose validation results.'
        }
    }
}