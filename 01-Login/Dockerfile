FROM node:16-alpine as build

RUN apk update && apk upgrade && \
  apk add --no-cache bash git openssh

RUN apk --no-cache --virtual build-dependencies add \
  python3=3.7

RUN mkdir /app

WORKDIR /app

COPY package.json .
COPY auth0-auth0-vue-1.0.0-alpha.1.tgz .


RUN npm install

COPY . .

RUN npm run build

# ---------------

FROM node:16-alpine

RUN mkdir -p /app/dist

WORKDIR /app

COPY --from=build /app/dist ./dist
COPY --from=build /app/package.json .
COPY --from=build /app/auth0-auth0-vue-1.0.0-alpha.1.tgz .
COPY --from=build /app/web-server.js .

ENV NODE_ENV production

RUN npm install --production

EXPOSE 3000

CMD ["node", "web-server.js"]
