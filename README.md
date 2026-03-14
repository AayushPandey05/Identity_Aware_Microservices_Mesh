🍔 Real-Time Food Delivery Ecosystem (Microservices)
A high-performance, asynchronous backend architecture built with C++17, leveraging Event-Driven Architecture (EDA) to handle high-concurrency user operations and real-time order processing.

🏗️ System Architecture
The project implements a decoupled microservices pattern where services communicate via a distributed message broker rather than tight API dependencies.

User Service (Producer): Handles user registration, persists data to AWS RDS (MySQL), and publishes USER_CREATED events.

Order Service (Consumer): A reactive worker that listens for Kafka events to trigger business logic (e.g., auto-applying new-user discounts).

Kafka Broker (Aiven Cloud): Acts as the centralized event backbone, ensuring reliable message delivery with SSL/TLS encryption.

Containerization: Every service is isolated using Docker for consistent deployment across environments.

🛠️ Tech Stack
Languages: C++17 (Focusing on memory efficiency and low-latency).

Infrastructure: AWS RDS (Relational Database Service), Aiven Kafka (Cloud Broker).

Security: SSL/TLS Certificate Handshaking, Environment Variable Management.

DevOps: Docker, Git.

Libraries: librdkafka (Kafka Client), libmariadb (MySQL Client).

🚀 Key Engineering Highlights
1. Robust Cloud Persistence
Implemented a database-first approach using AWS RDS. Logic includes:

Duplicate entry prevention using UNIQUE constraints.

Secure cloud connectivity from within Dockerized Linux environments.

2. Event-Driven Decoupling
Shifted from a monolithic design to EDA. The User Service doesn't "know" about the Order Service; it simply broadcasts an event. This allows the system to scale horizontally and remain resilient if one service goes offline.

3. Production-Ready Security
Secret Management: Sensitive AWS/Kafka credentials are never hardcoded; they are managed via .env files (excluded from version control).

Encrypted Streams: Implemented full SSL encryption for data-in-transit between the C++ containers and the Cloud Kafka cluster.

📂 Project Structure
Plaintext
├── foodapp-backend/
│   ├── user-service/     # C++ Producer Logic & Docker Configuration
│   ├── order-service/    # C++ Consumer Logic & Event Polling
│   └── payment-service/  # (In Development)
├── Doc/                  # Architectural Diagrams & Technical Logs
├── .gitignore            # Security rules to prevent secret leaking
└── README.md             # Project Documentation
🚦 Getting Started
Prerequisites
Docker Desktop

Aiven Kafka SSL Certificates (placed in /certificates)

AWS RDS Instance

Local Setup
Clone the repository:

Bash
git clone https://github.com/AayushPandey05/Real_Time_Food_Delivery_System.git
Environment Setup:
Copy .env.example to .env and provide your specific credentials.

Bash
cp .env.example .env
Run with Docker:

Bash
# Terminal 1: Start the Listener (Order Service)
cd foodapp-backend/order-service
docker build -t order-svc .
docker run order-svc

# Terminal 2: Trigger an Event (User Service)
cd foodapp-backend/user-service
docker build -t user-svc .
docker run user-svc
📈 Future Roadmap
[ ] Payment Service: Integration of simulated transaction events.

[ ] API Gateway: Implementing Nginx for unified entry points.

[ ] Kubernetes: Orchestrating containers for auto-scaling and self-healing.

How to add this to GitHub:
Open your README.md file in VS Code.

Delete everything inside and paste this.

Save, then run:

PowerShell
git add README.md
git commit -m "Docs: Update README with professional industry-standard documentation"
git push origin main
