pipeline {
    agent any

    options {
        buildDiscarder(logRotator(numToKeepStr: '6', daysToKeepStr: '5'))
        timestamps()
    }

    environment {
        registry = 'qkitsoftware/7a-fs-api'
        PROJECT_NAME = "7a-fs-be"
        GIT_CREDENTIALS_ID = 'your-git-credentials-id' // Replace with your Jenkins credential ID
    }

    stages {
        stage('Build') {
            steps {
                script {
                    echo 'Building image for deployment..'
                    sh """
                    docker build -t ${registry}:latest .
                    """
                }
            }
        }

        stage('Deploy') {
            steps {
                echo 'Checking for .env file and running Docker Compose for deployment..'
                // Check for .env file and copy from example.env if not present
                sh """
                if [ ! -f .env ]; then
                  cp example.env .env
                fi

                docker compose -f ./docker-compose.stag.yml down || true
                docker compose -f ./docker-compose.stag.yml up -d
                """
            }
        }

        stage('Cleanup') {
            steps {
                script {
                    echo 'Cleaning up unused Docker images..'
                    sh 'docker image prune -f'
                }
            }
        }
    }

    post {
        success {
            echo 'Pipeline succeeded!'
            // Add success notification here
        }
        failure {
            echo 'Pipeline failed!'
            // Add failure notification here
        }
    }
}
