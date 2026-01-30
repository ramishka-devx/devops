pipeline {
    agent any

    environment {
        BACKEND_IMAGE = "ramishkathennakoon/devops-backend"
        FRONTEND_IMAGE = "ramishkathennakoon/devops-frontend"
        SERVER_USER = "root"
        SERVER_IP = "64.225.85.179"
        APP_DIR = "/opt/app"
    }

    stages {

        stage('Build Backend') {
            steps {
                sh 'docker build --network=host -t $BACKEND_IMAGE:latest ./api'
            }
        }

        stage('Build Frontend') {
            steps {
                sh 'docker build --network=host -t $FRONTEND_IMAGE:latest ./client'
            }
        }

        stage('Login to DockerHub') {
            steps {
                withCredentials([usernamePassword(
                    credentialsId: 'dockerhub-creds',
                    usernameVariable: 'DOCKER_USER',
                    passwordVariable: 'DOCKER_PASS'
                )]) {
                    sh 'echo $DOCKER_PASS | docker login -u $DOCKER_USER --password-stdin'
                }
            }
        }

        stage('Push Images') {
            steps {
                sh '''
                docker push $BACKEND_IMAGE:latest
                docker push $FRONTEND_IMAGE:latest
                '''
            }
        }

            stage('Deploy to Server') {
                steps {
                    sshagent(['server-ssh-key']) {
                        sh '''
            ssh -o StrictHostKeyChecking=no $SERVER_USER@$SERVER_IP << 'EOF'
            cd /root/devops-app
            docker pull ramishkathennakoon/devops-backend:latest
            docker pull ramishkathennakoon/devops-frontend:latest
            docker compose down
            docker compose up -d
            EOF
            '''
        }
    }
}

    }
}
