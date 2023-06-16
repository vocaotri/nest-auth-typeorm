FROM node:18

WORKDIR /usr/app

COPY . .

RUN npm i

CMD ["npm", "run", "start:dev"]