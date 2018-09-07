#!/usr/bin/sh

chmod 0777 frontend

cd docker/prod

# Build containers and Run tests
docker-compose -f docker-compose.base.yml -f docker-compose.build.yml -f docker-compose.testing.yml up --abort-on-container-exit --exit-code-from go-vue-blog.node.testing || exit 1
