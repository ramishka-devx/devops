pipeline {
    agent any

    environment {
        DOCKERHUB_CREDENTIALS = credentials('dockerhub-creds')
        BACKEND_IMAGE = "ramishkathennakoon/devops-backend"
        FRONTEND_IMAGE = "ramishkathennakoon/devops-frontend"
    }

    stages {

        stage('Clone Repo') {
            steps {
                checkout scm
            }
        }

        stage('Build Backend Image') {
            steps {
                sh '''
                docker build -t $BACKEND_IMAGE:latest ./backend
                '''
            }
        }

        stage('Build Frontend Image') {
            steps {
                sh '''
                docker build -t $FRONTEND_IMAGE:latest ./frontend
                '''
            }
        }

        stage('Login to DockerHub') {
            steps {
                sh '''
                echo $DOCKERHUB_CREDENTIALS_PSW | docker login \
                -u $DOCKERHUB_CREDENTIALS_USR --password-stdin
                '''
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
