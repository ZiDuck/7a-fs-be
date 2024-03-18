docker compose -f ./docker-compose.stag.yml pull 7a-fs-api-stag
docker compose -f ./docker-compose.stag.yml down
docker compose -f ./docker-compose.stag.yml up -d