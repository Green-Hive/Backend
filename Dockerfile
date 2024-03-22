FROM node:19-alpine

WORKDIR /app

COPY package.json yarn.lock ./

## Installation des dépendances
RUN yarn build

COPY . .

EXPOSE 4000

CMD ["yarn", "start"]