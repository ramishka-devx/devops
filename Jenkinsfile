pipeline {
    agent any

    environment {
        BACKEND_IMAGE = "ramishkathennakoon/devops-backend"
        FRONTEND_IMAGE = "ramishkathennakoon/devops-frontend"
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
            environment {
                DOCKER_CREDS = credentials('dockerhub-creds')
            }
            steps {
                sh 'echo $DOCKER_CREDS_PSW | docker login -u $DOCKER_CREDS_USR --password-stdin'
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
    }
}
