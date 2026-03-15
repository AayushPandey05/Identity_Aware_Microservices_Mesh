FROM gcc:latest

RUN apt-get update && apt-get install -y \
    librdkafka-dev

WORKDIR /usr/src/app

COPY . .

# Only compile order_service files
RUN g++ -o order_service order_service.cpp -lrdkafka

CMD ["./order_service"]