pipeline {
    agent any

    parameters {
        booleanParam(name: 'RUN_TERRAFORM', defaultValue: false, description: 'Run Terraform provisioning (VM already created manually)')
        booleanParam(name: 'RUN_ANSIBLE', defaultValue: false, description: 'Run Ansible deployment (alternative to SSH deploy)')
    }

    environment {
        BACKEND_IMAGE = "ramishkathennakoon/devops-backend"
        FRONTEND_IMAGE = "ramishkathennakoon/devops-frontend"

        SERVER_USER = "root"
        SERVER_IP   = "64.225.85.179"
        APP_DIR     = "/opt/app"

        IMAGE_TAG = "${BUILD_NUMBER}"
    }

    stages {

        stage('Terraform - Provision Infrastructure') {
            when {
                expression { params.RUN_TERRAFORM == true }
            }
            steps {
                echo "Running Terraform..."
                dir('infra') {
                    sh '''
                    terraform init
                    terraform plan -out=tfplan
                    terraform apply tfplan
                    '''
                }
            }
        }

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
                    --build-arg VITE_API_BASE_URL=http://64.225.85.179:4000 \
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

        stage('Ansible - Deploy with Configuration Management') {
            when {
                expression { params.RUN_ANSIBLE == true }
            }
            steps {
                echo "Running Ansible playbook..."
                sshagent(['server-ssh-key']) {
                    sh '''
                    cd ansible
                    ansible-playbook -i inventory \
                        -e "image_tag=$IMAGE_TAG" \
                        -e "backend_image=$BACKEND_IMAGE" \
                        -e "frontend_image=$FRONTEND_IMAGE" \
                        playbook.yml
                    '''
                }
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
