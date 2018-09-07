# go-vue-blog

### Prod
```
# run server at 9010
cd docker/prod
docker-compose build && docker-compose up
```

### Dev
Install vendors

```
go get
cd frontend && npm i
```

Run

```
cd docker/dev && docker-compose up
fresh
cd frontend && npm run dev
```
