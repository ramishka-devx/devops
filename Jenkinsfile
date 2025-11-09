pipeline {
    agent any

    environment {
        REMOTE_USER    = 'ubuntu'
        REMOTE_HOST    = '13.250.115.24'
        REMOTE_APP_DIR = '/home/ubuntu/lms/devops'
    }

    stages {
        stage('Checkout') {
            steps {
                git branch: 'main', url: 'https://github.com/ramishka-devx/devops.git'
            }
        }

        stage('Backend - Install & Test') {
            steps {
                dir('backend') {
                    sh 'npm install'
                }
            }
        }

        stage('Frontend - Install & Build') {
            steps {
                dir('frontend') {
                    sh 'npm install'
                    sh 'npm run build'
                }
            }
        }

        stage('Deploy to Lightsail') {
            steps {
                sshagent (credentials: ['lightsail-ssh']) {
                    sh """
                    ssh -o StrictHostKeyChecking=no ${REMOTE_USER}@${REMOTE_HOST} '
                        cd ${REMOTE_APP_DIR} && \
                        git pull && \
                        cd backend && npm install --production && \
                        cd ../frontend && npm install && npm run build && \
                        pm2 restart lms-api || pm2 start app.js --name lms-api --update-env && \
                        pm2 restart lms-client || pm2 start "npm run preview -- --host 0.0.0.0 --port 5173" --name lms-client --update-env && \
                        pm2 save
                    '
                    """
                }
            }
        }
    }
}
