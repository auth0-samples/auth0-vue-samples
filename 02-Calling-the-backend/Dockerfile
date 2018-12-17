FROM node:10-alpine as build

RUN mkdir /app

WORKDIR /app

COPY package.json .

RUN npm install --silent

COPY . .

RUN npm run build

# ---------------

FROM node:10-alpine

RUN mkdir -p /app/dist

WORKDIR /app

COPY --from=build /app/package.json .

RUN npm install --production --silent

COPY --from=build /app/dist ./dist
COPY --from=build /app/bin ./bin
COPY --from=build /app/server.js .

EXPOSE 3000

ENV NODE_ENV production

CMD ["node", "bin/www"]