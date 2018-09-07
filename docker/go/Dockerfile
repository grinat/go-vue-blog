FROM golang:1.9.2-alpine

RUN apk add --update tzdata git;
# Install fresh that brings reload functionality
# RUN go get github.com/pilu/fresh

RUN mkdir -p /go/src/go-vue-blog/dist

ADD ./backend /go/src/go-vue-blog/backend
ADD ./main.go /go/src/go-vue-blog

WORKDIR /go/src/go-vue-blog

RUN go get

RUN go build

EXPOSE 9050

CMD ["/go/src/go-vue-blog/go-vue-blog"]
