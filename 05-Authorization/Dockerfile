FROM node:8.7-alpine

RUN apk --no-cache add git

WORKDIR /home/app

RUN npm install -g create-react-app
ADD package.json /home/app
RUN npm install
ADD . /home/app

CMD ["npm", "start"]

EXPOSE 3000 3001
