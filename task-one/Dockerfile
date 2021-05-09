FROM node:14.16-alpine3.13
ENV NODE_ENV=production
WORKDIR /usr/src/app
COPY package*.json .
RUN yarn
COPY . .
EXPOSE 19000
CMD ["yarn", "start"]
