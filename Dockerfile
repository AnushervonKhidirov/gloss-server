FROM node:22.21-alpine
COPY ./ /usr/app
WORKDIR /usr/app
RUN npm install