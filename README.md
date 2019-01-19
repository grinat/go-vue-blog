# go-vue-blog
[![Travis CI status](https://travis-ci.org/grinat/go-vue-blog.svg?branch=master)](https://travis-ci.org/grinat/go-vue-blog)

### Desc
The first registered user becomes the admin role.

Backend on go, frontend on vue ssr, db - mongo.

### Requirements
Go 1.9.1 or higher
Node 9 or higher
Mongo 4.0.2

### Prod
Server runned at 9010

Local build:
```
docker volume create --name=go-vue-blog-mongo-data
cd docker/prod
docker-compose -f docker-compose.base.yml -f docker-compose.build.yml build
docker-compose -f docker-compose.base.yml -f docker-compose.build.yml up
```

For use builded on and pushed to docker hub:
```
docker volume create --name=go-vue-blog-mongo-data
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
docker volume create --name=go-vue-blog-mongo-data
cd docker/dev && docker-compose up

# run vue hot reload at 8080
cd frontend && npm run serve
```

### Testing
With docker
```
cd docker/prod
docker volume create --name=go-vue-blog-mongo-data
docker-compose -f docker-compose.base.yml -f docker-compose.build.yml -f docker-compose.testing.yml build
docker-compose -f docker-compose.base.yml -f docker-compose.build.yml -f docker-compose.testing.yml up --abort-on-container-exit  --exit-code-from go-vue-blog.node.testing
```

On local
```
# install puppeteer
npm install -g puppeteer
cd frontend && npm link puppeteer

# By default used prod server at 9010 (see available env in frontend/tests/config.js)
# run go prod server
docker volume create --name=go-vue-blog-mongo-data
cd docker/prod
docker-compose -f docker-compose.base.yml -f docker-compose.build.yml up

# run tests
cd frontend && npm run test
```

# Roadmap
- [x] Register/Login
- [x] Create article
- [x] List of articles
- [x] Visual editor
- [x] Static pages support(exlude static from articles list)
- [x] User profile
- [x] Sort/pagination
- [x] Upload images
- [x] Edit profile
- [ ] Refactor backend
- [ ] Comment article
- [ ] List of comments in user profile
- [ ] Send email on register
- [ ] Restore password
- [ ] Special page on main page
- [ ] Improve backed validation
