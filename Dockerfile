FROM node:18.16.1-alpine

RUN apk add bash

ENV LANG=ko_KR.UTF-8 \
    LANGUAGE=ko_KR.UTF-8

RUN apk --no-cache add tzdata && \
    cp /usr/share/zoneinfo/Asia/Seoul /etc/localtime && \
    echo "Asia/Seoul" > /etc/timezone

EXPOSE 3000


WORKDIR /usr/src/app
COPY package.json /usr/src/app/
RUN npm install
COPY . .

CMD npm start