pipeline {
    agent any

    options {
        skipDefaultCheckout(true)  // Tắt việc checkout SCM mặc định
        buildDiscarder(logRotator(numToKeepStr: '6', daysToKeepStr: '5'))
        timestamps()
    }

    environment {
        registry = 'qkitsoftware/7a-fs-api'
        WORKSPACE_DIR = "/root/projects/7a-fs-be"  // Đường dẫn tới workspace trên máy host
    }

    stages {
        stage('Prepare Workspace') {
            steps {
                script {
                    // Kiểm tra và tạo thư mục WORKSPACE_DIR nếu chưa tồn tại
                    sh """
                    if [ ! -d "${env.WORKSPACE_DIR}" ]; then
                        mkdir -p ${env.WORKSPACE_DIR}
                    fi
                    """
                }
            }
        }

        stage('Pull Code') {
            steps {
                script {
                    // Kiểm tra nếu thư mục tồn tại thì pull code, nếu không thì clone
                    sh """
                    if [ -d "${env.WORKSPACE_DIR}/.git" ]; then
                        cd ${env.WORKSPACE_DIR}
                        git pull --rebase
                    else
                        rm -rf ${env.WORKSPACE_DIR}/*
                        git clone -b staging https://github.com/ZiDuck/7a-fs-be.git ${env.WORKSPACE_DIR}
                    fi
                    """
                }
            }
        }

        stage('Build') {
            steps {
                script {
                    echo 'Building image for deployment..'
                    sh """
                    cd ${env.WORKSPACE_DIR}
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
                cd ${env.WORKSPACE_DIR}
                if [ ! -f .env ]; then
                  cp example.env .env
                fi

                docker compose -f ./docker-compose.stag.yml down
                docker compose -f ./docker-compose.stag.yml up -d
                """
            }
        }
    }
}
