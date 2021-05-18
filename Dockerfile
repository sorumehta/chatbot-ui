FROM geoffreybooth/meteor-base:2.0

WORKDIR /app

COPY . /app

RUN meteor npm install 

#ENV monogodb url

EXPOSE 3000

RUN chmod +x entrypoint.sh
ENTRYPOINT ["entrypoint.sh"]
CMD ["meteor", "run"]
