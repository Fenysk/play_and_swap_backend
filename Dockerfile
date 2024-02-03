FROM node:18.18.0

WORKDIR /usr/src/app

COPY . .

RUN npm install

EXPOSE ${NEST_PORT}

CMD [ "npm", "run", "start:dev" ]
