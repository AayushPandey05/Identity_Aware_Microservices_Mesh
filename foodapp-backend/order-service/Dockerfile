# Step 1: Use the official GCC image
FROM gcc:latest

# Step 2: Updated for Debian Trixie compatibility
RUN apt-get update && apt-get install -y \
    libmariadb-dev \
    libmariadb-dev-compat \
    librdkafka-dev \
    libssl-dev \
    && rm -rf /var/lib/apt/lists/*

# Step 3: Set working directory
WORKDIR /usr/src/app

# Step 4: Copy the current directory (including certs and code)
COPY . .

# Step 5: Compile ONLY order_service
RUN g++ -o order_service order_service.cpp -lrdkafka

# Step 6: Command to run the service
CMD ["./order_service"]

