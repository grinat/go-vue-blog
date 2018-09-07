# go-vue-blog
[![Travis CI status](https://travis-ci.org/grinat/go-vue-blog.svg?branch=master)](https://travis-ci.org/grinat/go-vue-blog)

### Prod
Server runned at 9010

Local build:
```
cd docker/prod
docker-compose -f docker-compose.base.yml -f docker-compose.build.yml build
docker-compose -f docker-compose.base.yml -f docker-compose.build.yml up
```

For use builded on and pushed to docker hub:
```
cd docker/prod
docker pull grinat0/go-vue-blog-api
docker pull grinat0/go-vue-blog-node
docker-compose -f docker-compose.base.yml -f docker-compose.hub.yml up
```

### Dev

Install dependencies:
```
go get
go get github.com/pilu/fresh
cd frontend && npm i
```

Run:
```
# run go hot reload at 9050
fresh

# run mongo at 9051 and static server at 9052
cd docker/dev && docker-compose up

# run vue hot reload at 8080
cd frontend && npm run serve
```

### Testing
On local
```
# install puppeteer
npm install -g puppeteer
cd frontend && npm link puppeteer

# By default used prod server at 9010 (see available env in frontend/tests/config.js)
# run prod server
cd docker/prod && docker-compose -f docker-compose.base.yml -f docker-compose.build.yml up
# run tests
cd frontend && npm run test
```

On docker
```
cd docker/prod
docker-compose -f docker-compose.base.yml -f docker-compose.build.yml -f docker-compose.testing.yml build
docker-compose -f docker-compose.base.yml -f docker-compose.build.yml -f docker-compose.testing.yml up --abort-on-container-exit  --exit-code-from go-vue-blog.node.testing
```