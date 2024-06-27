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
        stage('Build') {
            steps {
                script {
                    echo 'Building image for deployment..'
                    // dockerImage = docker.build registry + ":$BUILD_NUMBER" 
                    dockerImage = docker.build registry + ":latest" 
                    // echo 'Pushing image to dockerhub..'
                    // docker.withRegistry( '', registryCredential ) {
                    //     dockerImage.push()
                    //     dockerImage.push('latest')
                    // }
                }
            }
        }

        stage('Deploy') {
            steps {
                echo 'Checking for .env file and running Docker Compose for deployment..'
                // Check for .env file and copy from example.env if not present
                sh '''
                if [ ! -f .env ]; then
                  cp example.env .env
                fi

                docker compose -f ./docker-compose.stag.yml down
                docker compose -f ./docker-compose.stag.yml up -d
                '''
            }
        }
    }
}