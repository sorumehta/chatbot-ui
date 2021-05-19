FROM node:carbon-stretch

ENV METEOR_ALLOW_SUPERUSER=true
ENV ROOT_URL="http://localhost:3000"

RUN curl "https://install.meteor.com/" | sh

COPY . /usr/src/app
WORKDIR /usr/src/app

RUN chmod -R 700 /usr/src/app/.meteor/local
RUN meteor npm install


#ENV monogodb url

EXPOSE 3000

RUN chmod +x entrypoint.sh
ENTRYPOINT ["entrypoint.sh"]
CMD ["meteor", "run","--production"]
