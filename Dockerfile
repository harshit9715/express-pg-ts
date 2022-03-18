FROM node:12-alpine AS builder

RUN mkdir -p /usr/app
WORKDIR /usr/app
COPY package.json tsconfig.json wait.sh ./
COPY src ./src
ADD https://github.com/ufoscout/docker-compose-wait/releases/download/2.2.1/wait /wait
RUN npm install 
RUN npm run build


FROM node:12-alpine
WORKDIR /usr/app

COPY package*.json wait.sh ./
RUN chmod +x wait.sh

RUN npm install --only=prod
COPY --from=builder /usr/app/dist /usr/app/dist

RUN wget https://s3.amazonaws.com/rds-downloads/rds-ca-2019-root.pem

RUN mv rds-ca-2019-root.pem dist/src/dbconfig/cert.pem

EXPOSE 4000
CMD npm start