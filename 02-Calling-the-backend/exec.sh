docker build --rm -t auth0-vue-02-backend .
docker run -p 3000:3000 --env-file .env --pid=host auth0-vue-02-backend
