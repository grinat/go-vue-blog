#!/usr/bin/sh

SERVICE_PREFIX='go-vue-blog'

chmod 0777 frontend

cd docker/prod

# Build containers and Run tests
docker-compose -f docker-compose.yml -f docker-compose.testing.yml up --abort-on-container-exit --exit-code-from $PROJECT_NAME.node.testing

docker login --username $DOCKER_U --password $DOCKER_P

docker-compose up

# Push builded images
docker tag $PROJECT_NAME-prod_$SERVICE_PREFIX.node $DOCKER_U/$SERVICE_PREFIX.node
docker tag $PROJECT_NAME-prod_$SERVICE_PREFIX.api $DOCKER_U/$SERVICE_PREFIX.api

docker push $DOCKER_U/$SERVICE_PREFIX.node
docker push $DOCKER_U/$SERVICE_PREFIX.api
