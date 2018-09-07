#!/usr/bin/sh

SERVICE_PREFIX='go-vue-blog'

chmod 0777 frontend

cd docker/prod

# Build containers and Run tests
docker-compose -f docker-compose.yml -f docker-compose.testing.yml up --abort-on-container-exit --exit-code-from $PROJECT_NAME.node.testing
