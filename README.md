# go-vue-blog
[![Travis CI status](https://travis-ci.org/grinat/go-vue-blog.svg?branch=master)](https://travis-ci.org/grinat/go-vue-blog)

### Prod
```
# run server at 9010
cd docker/prod
docker-compose build && docker-compose up
```

### Dev

Install depencies
```
go get
go get github.com/pilu/fresh
cd frontend && npm i
```

Run
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
# by default used prod server at 9010 (see avalaible env in frontend/tests/config.js)
npm install -g puppeteer
cd frontend
npm link puppeteer

npm run test
```

On docker
```
cd docker/prod
docker-compose -f docker-compose.yml -f docker-compose.testing.yml up --abort-on-container-exit  --exit-code-from go-vue-blog.node.testing
```