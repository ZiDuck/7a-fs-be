docker compose -f ./docker-compose.prod.yml pull 7a-fs-api-prod
docker compose -f ./docker-compose.prod.yml down
docker compose -f ./docker-compose.prod.yml up -d