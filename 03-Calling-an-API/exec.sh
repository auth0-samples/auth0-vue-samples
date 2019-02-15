#!/usr/bin/env bash

docker build --rm -t auth0-vue-03-api .
docker run -p 3000:3000 --pid=host auth0-vue-03-api
