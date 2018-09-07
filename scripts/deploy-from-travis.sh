#!/usr/bin/sh

CI_COMMIT_REF_NAME="master"

echo $DEPLOY_SSH_KEY_PRIVA > ssh_key.txt

sed -i "s/_77_/\n/g" ssh_key.txt
sed -i "s/_88_/ RSA PRIVATE KEY/g" ssh_key.txt

chmod 600 ssh_key.txt

# Get debug info about ssh connection and project dir
ssh -o StrictHostKeyChecking=no -i ssh_key.txt $USER_HOST_PORT "cd $PROJECT_DIR && git branch && ls"

# Git hard reset all changes and pull
ssh -o StrictHostKeyChecking=no -i ssh_key.txt $USER_HOST_PORT "cd $PROJECT_DIR && git fetch --all && git reset --hard"
ssh -o StrictHostKeyChecking=no -i ssh_key.txt $USER_HOST_PORT "cd $PROJECT_DIR && git checkout $CI_COMMIT_REF_NAME && git pull && git branch"

# Stop docker
ssh -o StrictHostKeyChecking=no -i ssh_key.txt $USER_HOST_PORT "cd $PROJECT_DIR/docker/prod && docker-compose -f docker-compose.base.yml -f docker-compose.hub.yml down"

# Pull images
ssh -o StrictHostKeyChecking=no -i ssh_key.txt $USER_HOST_PORT "docker pull $DOCKER_U/go-vue-blog-node"
ssh -o StrictHostKeyChecking=no -i ssh_key.txt $USER_HOST_PORT "docker pull $DOCKER_U/go-vue-blog-api"

# Run pulled
ssh -o StrictHostKeyChecking=no -i ssh_key.txt $USER_HOST_PORT "cd $PROJECT_DIR/docker/prod && docker-compose -f docker-compose.base.yml -f docker-compose.hub.yml up -d"

# For build on server
# Rebuild images

# ssh -o StrictHostKeyChecking=no -i ssh_key.txt $USER_HOST_PORT "cd $PROJECT_DIR/docker/prod && docker-compose -f docker-compose.base.yml -f docker-compose.build.yml build"
# Start docker

# ssh -o StrictHostKeyChecking=no -i ssh_key.txt $USER_HOST_PORT "cd $PROJECT_DIR/docker/prod && docker-compose -f docker-compose.base.yml -f docker-compose.build.yml up -d"
