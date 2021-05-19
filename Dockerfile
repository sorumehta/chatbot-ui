FROM node:carbon-stretch

ENV METEOR_ALLOW_SUPERUSER=true
ENV ROOT_URL http://localhost:3000
ENV APP_NAME botfrontui
ENV APP_SOURCE_FOLDER /opt/src
ENV APP_BUNDLE_FOLDER /opt/bundle
ENV SCRIPTS_FOLDER /docker
ENV MONGO_URL localhost
ENV MONGO_PORT 27017
ENV MONGO_DB myappdb

# Install Meteor
RUN curl https://install.meteor.com/?release=$METEOR_VERSION --output /tmp/install-meteor.sh && \
	# Replace tar with bsdtar in the install script; https://github.com/jshimko/meteor-launchpad/issues/39 and https://github.com/intel/lkp-tests/pull/51
	sed --in-place "s/tar -xzf.*/bsdtar -xf \"\$TARBALL_FILE\" -C \"\$INSTALL_TMPDIR\"/g" /tmp/install-meteor.sh && \
	# Install Meteor
	printf "\n[-] Installing Meteor $METEOR_VERSION...\n\n" && \
	sh /tmp/install-meteor.sh

# Fix permissions warning; https://github.com/meteor/meteor/issues/7959
ENV METEOR_ALLOW_SUPERUSER true


# Copy entrypoint and dependencies
COPY ./docker $SCRIPTS_FOLDER/

# Install Docker entrypoint dependencies; npm ci was added in npm 5.7.0, and therefore available only to Meteor 1.7+
RUN cd $SCRIPTS_FOLDER && \
	if bash -c "if [[ ${METEOR_VERSION} == 1.6* ]]; then exit 0; else exit 1; fi"; then \
		meteor npm install; \
	else \
		meteor npm ci; \
	fi


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

CMD ["node", "main.js"]
