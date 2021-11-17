FROM node:10-alpine as build

RUN apk update && apk upgrade && \
  apk add --no-cache bash git openssh

RUN mkdir /app

WORKDIR /app

COPY package.json .

RUN npm install

COPY . .

RUN npm run build

# ---------------

FROM node:12

RUN mkdir -p /app/dist

WORKDIR /app

COPY --from=build /app/package.json .

RUN npm install --production

COPY --from=build /app/dist ./dist
COPY --from=build /app/bin ./bin
COPY --from=build /app/auth_config.json .
COPY --from=build /app/web-server.js .

EXPOSE 3000

ENV NODE_ENV production

CMD ["node", "bin/www"]
