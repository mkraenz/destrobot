FROM node:alpine

# the server
COPY ./deployment/server /app
COPY ./assets /app/public/assets
COPY ./index.html /app/public/

# copy files for building the phaser game
COPY ./package.json /destrobot/
COPY ./package-lock.json /destrobot/
COPY ./tsconfig.json /destrobot/
COPY ./webpack.config.js /destrobot/
COPY ./src /destrobot/src

# build the phaser game and expose publicly
WORKDIR /destrobot
RUN npm install
RUN npm run build
RUN mv build ../app/public/build
RUN rm -r /destrobot

# install and run the server
WORKDIR /app
RUN npm install
CMD ["npm","run", "start"]
