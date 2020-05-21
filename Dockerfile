FROM node:alpine

# the server
COPY ./deployment/server /app
COPY ./assets /app/public/assets
COPY ./index.html /app/public/

# copy files for building the phaser game
COPY ./package.json /a-tiny-city-builder/
COPY ./package-lock.json /a-tiny-city-builder/
COPY ./tsconfig.json /a-tiny-city-builder/
COPY ./webpack.config.js /a-tiny-city-builder/
COPY ./src /a-tiny-city-builder/src

# build the phaser game and expose publicly
WORKDIR /a-tiny-city-builder
RUN npm install
RUN npm run build
RUN mv build ../app/public/build
RUN rm -r /a-tiny-city-builder

# install and run the server
WORKDIR /app
RUN npm install
CMD ["npm","run", "start"]
