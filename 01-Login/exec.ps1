docker build --rm -t auth0-vue-01-login .
docker run -p 3000:3000 --env-file .env --pid=host auth0-vue-01-login