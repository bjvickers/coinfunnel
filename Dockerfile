# To build:
# > docker build --tag coinfunnel/server:${NODE_ENV} .
#
# To run:
# > docker run --publish 3000:3000 --env-file .env coinfunnel/server:${NODE_ENV}

FROM node:8.5.0-alpine
RUN mkdir -vp /app/src && mkdir -vp /app/config
WORKDIR /app
COPY package.json /app/
RUN npm install --production
COPY ./src /app/src
COPY ./config /app/config
CMD ["npm", "start"]
