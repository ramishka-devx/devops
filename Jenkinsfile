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
            steps {
                withCredentials([usernamePassword(credentialsId: 'dockerhub-creds', usernameVariable: 'DOCKER_USER', passwordVariable: 'DOCKER_PASS')]) {
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
    }
}
