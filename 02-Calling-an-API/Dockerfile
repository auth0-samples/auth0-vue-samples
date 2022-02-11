FROM node:16-alpine as build

RUN apk update && apk upgrade && \
  apk add --no-cache bash git openssh

RUN mkdir /app

WORKDIR /app

COPY package.json .

RUN npm install

COPY . .

RUN npm run build

# ---------------

FROM node:16-alpine

RUN mkdir -p /app/dist

WORKDIR /app

RUN npm install --production

COPY --from=build /app/dist ./dist
COPY --from=build /app/package.json .
COPY --from=build /app/web-server.js .

EXPOSE 3000

ENV NODE_ENV production

CMD ["node", "web-server.js"]
