FROM node:9-alpine

RUN mkdir -p /go/src/go-vue-blog

ADD ./frontend /go/src/go-vue-blog/frontend

WORKDIR /go/src/go-vue-blog/frontend

RUN npm i

RUN npm run build

EXPOSE 8080

CMD [ "npm", "start" ]