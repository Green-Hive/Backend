FROM node:20-alpine

WORKDIR /app
COPY package.json yarn.lock ./
COPY . .
RUN yarn
RUN yarn build
EXPOSE 4000
CMD ["yarn", "start"]