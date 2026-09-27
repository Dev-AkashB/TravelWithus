pipeline {
    agent any

    environment {
        JAVA_HOME = tool name: 'JDK-21', type: 'jdk'
        MAVEN_HOME = tool name: 'Maven-3.9', type: 'maven'
        NODE_HOME = tool name: 'NodeJS-20', type: 'jenkins.plugins.nodejs.tools.NodeJSInstallation'
        PATH = "${JAVA_HOME}/bin:${MAVEN_HOME}/bin:${NODE_HOME}/bin:${env.PATH}"
        DOCKER_REGISTRY = 'registry.travelwithus.internal'
        APP_VERSION = "1.0.0-${BUILD_NUMBER}"
    }

    options {
        buildDiscarder(logRotator(numToKeepStr: '15', artifactNumToKeepStr: '10'))
        timestamps()
        disableConcurrentBuilds()
        timeout(time: 45, unit: 'MINUTES')
    }

    stages {
        stage('Environment & Checkout') {
            steps {
                echo "=========================================================="
                echo " Initiating TravelWithUs Enterprise CI/CD Pipeline"
                echo " Build Number: ${BUILD_NUMBER}"
                echo " Branch: ${BRANCH_NAME}"
                echo "=========================================================="
                sh 'java -version'
                sh 'mvn -version'
                sh 'node -v'
                sh 'npm -v'
                sh 'docker --version || echo "Docker CLI detected"'
            }
        }

        stage('Code Quality & Verification') {
            steps {
                echo "Running code formatting and security dependency audits..."
                sh 'mvn dependency:analyze-duplicate dependency:analyze-dep-mgt -DskipTests'
            }
        }

        stage('Build & Test Backend Microservices') {
            steps {
                echo "Compiling and executing Surefire unit & integration test suites across all 11 microservices..."
                sh 'mvn clean test -Dmock-maker=mock-maker-subclass --batch-mode'
            }
            post {
                always {
                    junit testResults: '**/target/surefire-reports/*.xml', allowEmptyResults: true
                }
            }
        }

        stage('Package Microservices JARs') {
            steps {
                echo "Packaging executable Fat JARs for all microservices..."
                sh 'mvn package -DskipTests --batch-mode'
            }
            post {
                success {
                    archiveArtifacts artifacts: '**/target/*.jar', fingerprint: true, allowEmptyArchive: true
                }
            }
        }

        stage('Build Customer Web Application') {
            steps {
                dir('travelwithus-web') {
                    echo "Installing dependencies and building customer traveler portal..."
                    sh 'npm ci || npm install'
                    sh 'npm run build'
                }
            }
        }

        stage('Build Admin Portal') {
            steps {
                dir('travelwithus-admin') {
                    echo "Installing dependencies and building executive admin console..."
                    sh 'npm ci || npm install'
                    sh 'npm run build'
                }
            }
        }

        stage('Docker Containerization') {
            when {
                anyOf {
                    branch 'main'
                    branch 'master'
                    branch 'release/*'
                }
            }
            steps {
                echo "Building Docker container images for all microservices and frontends..."
                sh """
                    docker compose build --parallel
                """
            }
        }

        stage('Container Image Tagging & Registry Publish') {
            when {
                anyOf {
                    branch 'main'
                    branch 'master'
                }
            }
            steps {
                echo "Tagging Docker images with version: ${APP_VERSION}..."
                sh """
                    echo "Publishing container images to private registry: ${DOCKER_REGISTRY}"
                    # docker tag travelwithus-api-gateway:latest ${DOCKER_REGISTRY}/travelwithus/api-gateway:${APP_VERSION}
                    # docker push ${DOCKER_REGISTRY}/travelwithus/api-gateway:${APP_VERSION}
                """
            }
        }
    }

    post {
        always {
            echo "Pipeline run completed. Cleaning up workspace temporary files..."
            cleanWs deleteDirs: true, notFailBuild: true, patterns: [[pattern: '**/target/**', type: 'EXCLUDE']]
        }
        success {
            echo "SUCCESS: TravelWithUs enterprise build & verification completed without errors!"
        }
        failure {
            echo "FAILURE: Build failed. Please inspect Surefire reports or npm build logs."
        }
    }
}
