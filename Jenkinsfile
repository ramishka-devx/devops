pipeline {
    agent any

    environment {
        REMOTE_USER    = 'ubuntu'
        REMOTE_HOST    = '13.250.115.24'
        REMOTE_APP_DIR = '/home/ubuntu/lms/devops'
        // Server base URL for API (used to set VITE_API_BASE_URL during frontend builds)
        SERVER_BASE_URL = 'http://13.250.115.24:4000'
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
                    // Set VITE_API_BASE_URL at build time so Vite will bake it into the production bundle
                    sh "VITE_API_BASE_URL=${SERVER_BASE_URL} npm run build"
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
                # Pass the server base URL to the remote build so the built frontend points to the correct API
                VITE_API_BASE_URL=${SERVER_BASE_URL} npm run build

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
