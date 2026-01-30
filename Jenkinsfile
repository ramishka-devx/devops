pipeline {
    agent any

    environment {
        BACKEND_IMAGE = "ramishkathennakoon/devops-backend"
        FRONTEND_IMAGE = "ramishkathennakoon/devops-frontend"

        SERVER_USER = "root"
        SERVER_IP   = "64.225.85.179"
        APP_DIR     = "/opt/app"

        IMAGE_TAG = "${BUILD_NUMBER}"
    }

    stages {

        stage('Build Backend') {
            steps {
                sh '''
                docker build --no-cache \
                    -t $BACKEND_IMAGE:$IMAGE_TAG \
                    ./api
                '''
            }
        }

        stage('Build Frontend') {
            steps {
                sh '''
                docker build --no-cache \
                    -t $FRONTEND_IMAGE:$IMAGE_TAG \
                    ./client
                '''
            }
        }

        stage('Login to DockerHub') {
            steps {
                withCredentials([usernamePassword(
                    credentialsId: 'dockerhub-creds',
                    usernameVariable: 'DOCKER_USER',
                    passwordVariable: 'DOCKER_PASS'
                )]) {
                    sh '''
                    echo "$DOCKER_PASS" | docker login -u "$DOCKER_USER" --password-stdin
                    '''
                }
            }
        }

        stage('Push Images') {
            steps {
                sh '''
                docker push $BACKEND_IMAGE:$IMAGE_TAG
                docker push $FRONTEND_IMAGE:$IMAGE_TAG
                '''
            }
        }

        stage('Deploy to Server') {
            steps {
                sshagent(['server-ssh-key']) {
                    sh """
                    ssh -o StrictHostKeyChecking=no $SERVER_USER@$SERVER_IP "
                        cd $APP_DIR &&

                        export IMAGE_TAG=$IMAGE_TAG &&

                        docker pull $BACKEND_IMAGE:$IMAGE_TAG &&
                        docker pull $FRONTEND_IMAGE:$IMAGE_TAG &&

                        docker-compose down &&
                        docker rm -f db || true &&
                        docker-compose up  -d --build
                    "
                    """
                }
            }
        }
    }
}
