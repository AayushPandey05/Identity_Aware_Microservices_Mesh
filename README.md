# 🍔 Real-Time Food Delivery Backend (EDA)

A high-performance microservices architecture built with **C++17**, demonstrating
**Event-Driven Architecture (EDA)** for real-time order processing and user management.

**Access Project at: http://65.2.37.48**

---

## 🏗️ System Design

The system utilizes a decoupled producer-consumer pattern to ensure high availability
and horizontal scalability.

- **User Service (Producer)**: High-speed C++ service that persists user credentials
  to **AWS RDS (MySQL)** and broadcasts a `USER_CREATED` event to Kafka upon successful
  registration.
- **Order Service (Consumer)**: A reactive worker that polls the **Aiven Kafka** broker
  to trigger downstream business logic (e.g., automated discount application) in real-time.
- **Infrastructure**: Fully containerized using **Docker** to ensure environment parity
  between local development and cloud deployment.

---

## 🛠️ Technical Stack

| Layer | Technology |
|---|---|
| Language | C++17 |
| Database | AWS RDS (MySQL) |
| Message Broker | Aiven Kafka |
| DevOps | Docker, Git, Linux |
| Security | SSL/TLS, `.env` isolation |

---

## 🚀 Key Engineering Implementations

1. **Asynchronous Decoupling**: Services communicate via events, preventing cascading
   failures and reducing system latency.
2. **Reliable Persistence**: Strict database constraints on AWS RDS to ensure data integrity.
3. **Encrypted Data Streams**: Full SSL integration for secure communication between
   C++ containers and remote Kafka clusters.
4. **Security Standards**: Used `.gitignore` and `.env` patterns to prevent credential
   leakage in public repositories.

---

## 📂 Repository Structure
```text
├── foodapp-backend/
│   ├── user-service/     # Producer Logic & Docker Infrastructure
│   ├── order-service/    # Consumer/Listener Logic & Kafka Polling
│   └── payment-service/  # (Pipeline) Logic for transaction handling
├── Doc/                  # Architectural diagrams & verification logs
└── .gitignore            # Security rules for credential management
```

---

## 🚦 Execution Guide

### Environment Configuration
Copy `.env.example` to `.env` and populate your AWS and Kafka credentials.

### Start the Ecosystem
```bash
# Terminal 1: Run Order Listener
cd foodapp-backend/order-service
docker build -t order-svc . && docker run order-svc

# Terminal 2: Trigger User Creation
cd foodapp-backend/user-service
docker build -t user-svc . && docker run user-svc
```

---

## 📈 Future Roadmap

- [ ] **API Gateway**: Implementing Nginx for unified request routing.
- [ ] **Kubernetes**: Orchestrating containers for auto-scaling and self-healing.
- [ ] **Payment Integration**: Handling simulated financial transaction events.
