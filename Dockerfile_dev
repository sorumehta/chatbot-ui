FROM geoffreybooth/meteor-base:2.0

ENV ROOT_URL http://0.0.0.0:3000

ENV MONGO_SERVER localhost
ENV MONGO_PORT 27017
ENV MONGO_DB botfrontdb
ENV MONGO_URL=mongodb://$MONGO_SERVER:$MONGO_PORT/$MONGO_DB

WORKDIR /app
COPY . /app

RUN meteor npm install
CMD ["meteor", "run", "--production"]