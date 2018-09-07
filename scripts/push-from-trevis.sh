#!/usr/bin/sh

docker ps -a

docker login --username $DOCKER_U --password $DOCKER_P

# Push builded images
docker tag go-vue-blog-prod_go-vue-blog.api $DOCKER_U/go-vue-blog-api
docker tag go-vue-blog-prod_go-vue-blog.node $DOCKER_U/go-vue-blog-node

docker push $DOCKER_U/go-vue-blog-api
docker push $DOCKER_U/go-vue-blog-node