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
                dir('api') {
                    sh 'npm install'
                }
            }
        }

        stage('Frontend - Install & Build') {
            steps {
                dir('client') {
                    sh 'npm install'
                    sh 'npm run build'
                }
            }
        }

        stage('Deploy to Lightsail') {
    steps {
        sshagent (credentials: ['lightsail-ssh']) {
            sh """
            ssh -o StrictHostKeyChecking=no ubuntu@13.250.115.24 '
                set -e

                cd /home/ubuntu/lms/devops
                git pull

                # Backend: api
                cd api
                npm install --production

                # Frontend: client (Vite)
                cd ../client
                npm install
                npm run build

                # Restart backend API
                pm2 restart lms-api || pm2 start app.js --name lms-api --update-env

                # Restart frontend client (port 5173)
                pm2 restart lms-client || pm2 start "npm run preview -- --host 0.0.0.0 --port 5173" --name lms-client --update-env

                # Save PM2 process list
                pm2 save
            '
            """
        }
    }
}

    }
}
