FROM geoffreybooth/meteor-base:2.0

ENV MONGO_SERVER mongo.voicebot.svc
ENV MONGO_PORT 27017
ENV MONGO_DB myappdb
ENV MONGO_URL=mongodb://$MONGO_SERVER:$MONGO_PORT/$MONGO_DB
ENV ROOT_URL http://0.0.0.0:3000
ENV APP_NAME botfrontui=mongodb://$MONGO_SERVER:$MONGO_PORT/$MONGO_DB

WORKDIR /app
COPY . /app

RUN meteor npm install
CMD ["meteor", "run", "--production"]
