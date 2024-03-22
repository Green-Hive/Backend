FROM node:21.7.1-alpine

WORKDIR /app
COPY package.json yarn.lock ./
RUN yarn
COPY . .
RUN yarn build
EXPOSE 4000
CMD ["yarn", "start"]