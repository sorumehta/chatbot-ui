FROM geoffreybooth/meteor-base:2.0

ENV ROOT_URL http://localhost:3000
ENV APP_NAME botfrontui
#ENV APP_SOURCE_FOLDER /opt/src
#ENV APP_BUNDLE_FOLDER /opt/bundle
#ENV SCRIPTS_FOLDER /docker
ENV MONGO_SERVER localhost
ENV MONGO_PORT 27017
ENV MONGO_DB myappdb
ENV MONGO_URL=mongodb://$MONGO_SERVER:$MONGO_PORT/$MONGO_DB

COPY ./package*.json $APP_SOURCE_FOLDER/
COPY ./postinstall.sh $APP_SOURCE_FOLDER/

ARG ARG_NODE_ENV=production
ENV NODE_ENV $ARG_NODE_ENV
ENV DISABLE_CLIENT_STATS 1
# Increase Node memory for build
ENV TOOL_NODE_FLAGS --max-old-space-size=4096

RUN bash $SCRIPTS_FOLDER/build-app-npm-dependencies.sh

COPY . $APP_SOURCE_FOLDER/

RUN bash $SCRIPTS_FOLDER/build-meteor-bundle.sh

RUN bash $SCRIPTS_FOLDER/build-meteor-npm-dependencies.sh

RUN chgrp -R 0 $SCRIPTS_FOLDER && chmod -R g=u $SCRIPTS_FOLDER

ENTRYPOINT ["/docker/entrypoint.sh"]

CMD ["node", "main.js"]
