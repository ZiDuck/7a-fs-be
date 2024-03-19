FROM node:18-alpine AS builder

# Create app directory
WORKDIR /app

COPY package*.json yarn.lock ./
RUN yarn

COPY . .
RUN yarn build

FROM node:18-alpine

RUN apk add --no-cache postgresql-client 

WORKDIR /app

COPY --from=builder /app/package*.json /app/yarn.lock ./

RUN yarn --only=production --frozen-lockfile

COPY --from=builder /app/dist ./dist

EXPOSE 3000

CMD npx typeorm migration:run -d dist/migration.config.js && yarn start:prod