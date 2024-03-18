FROM node:18-alpine AS builder

# Create app directory
WORKDIR /app

COPY package.json ./
COPY yarn.lock ./

# Install app dependencies
RUN yarn

COPY . .

RUN yarn build

FROM node:18-alpine

RUN apk add --no-cache postgresql-client 

WORKDIR /app

COPY package.json ./
COPY yarn.lock ./

RUN yarn --only=production

COPY --from=builder /app/dist ./dist

EXPOSE 3000

# CMD [ "yarn", "start:prod" ]
CMD npx typeorm migration:run -d dist/migration.config.js && yarn start:prod