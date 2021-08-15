FROM node:14-alpine
WORKDIR /usr/src/app
COPY . .
RUN yarn install
EXPOSE 8080
CMD [ "node", "." ]
