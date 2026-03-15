FROM gcc:latest

RUN apt-get update && apt-get install -y \
    libmariadb-dev \
    libmariadb-dev-compat \
    librdkafka-dev

WORKDIR /usr/src/app

COPY . .

# Only compile user_service files
RUN g++ -o user_service create_user.cpp -lmysqlclient -lrdkafka

CMD ["./user_service"]