pipeline {
    agent any

    options{
        buildDiscarder(logRotator(numToKeepStr: '6', daysToKeepStr: '5'))
        timestamps()
    }

    environment{
        registry = 'qkitsoftware/7a-fs-api'
        registryCredential = 'dockerhub'      
    }

    stages {
        stage('Verify') {
            steps {
                echo 'Verifying code checkout...'
                sh 'ls -la'
            }
        }

        stage('Build') {
            steps {
                script {
                    echo 'Building image for deployment..'
                    dockerImage = docker.build registry + ":$BUILD_NUMBER" 
                    echo 'Pushing image to dockerhub..'
                    docker.withRegistry( '', registryCredential ) {
                        dockerImage.push()
                        dockerImage.push('latest')
                    }
                }
            }
        }
        stage('Deploy') {
            steps {
                echo 'Deploying models..'
                echo 'Running a script to trigger pull and start a docker container'
            }
        }
    }
}