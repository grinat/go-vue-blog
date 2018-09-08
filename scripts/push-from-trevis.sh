#!/usr/bin/sh

BUILD_VERSION="travis-build-$TRAVIS_BUILD_NUMBER"

docker ps -a

docker login --username $DOCKER_U --password $DOCKER_P

# Push builded images
docker tag govueblogprod_go-vue-blog.api $DOCKER_U/go-vue-blog-api:$BUILD_VERSION
docker tag govueblogprod_go-vue-blog.node $DOCKER_U/go-vue-blog-node:$BUILD_VERSION

docker tag govueblogprod_go-vue-blog.api $DOCKER_U/go-vue-blog-api:latest
docker tag govueblogprod_go-vue-blog.node $DOCKER_U/go-vue-blog-node:latest

docker push $DOCKER_U/go-vue-blog-api:$BUILD_VERSION
docker push $DOCKER_U/go-vue-blog-node:$BUILD_VERSION

docker push $DOCKER_U/go-vue-blog-api:latest
docker push $DOCKER_U/go-vue-blog-node:latest
