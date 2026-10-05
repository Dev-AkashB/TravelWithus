# TravelWithUs - Enterprise Real-Time Travel Booking Platform

TravelWithUs is a production-grade, distributed travel booking and management platform built with **Java 21**, **Spring Boot 3.3.5**, **Spring Cloud 2023.0.3**, **MySQL**, **Redis**, **Apache Kafka**, and dual **React 18** frontends (`travelwithus-web` and `travelwithus-admin`).

The architecture follows enterprise standards: Microservices, Eureka Service Discovery, Spring Cloud Config Native Server, Spring Cloud Gateway with reactive JWT authentication and rate limiting, OpenFeign inter-service RPC with circuit-safe fallbacks, Kafka event-driven notifications, and STOMP WebSocket real-time updates.

---

## 🏛️ System Architecture

```text
                                  +-----------------------------+
                                  |   Customer Traveler Web     |
                                  |   (React + Vite, Port 3000) |
                                  +--------------+--------------+
                                                 |
                                  +--------------+--------------+
                                  |   Executive Admin Console   |
                                  |   (React + Vite, Port 3001) |
                                  +--------------+--------------+
                                                 |
                                                 v
                     +-------------------------------------------------------+
                     |             API Gateway (Port 8080)                   |
                     |  - Reactive JWT Token Validation (HMAC-SHA256)        |
                     |  - Role-Based Access Control (RBAC: USER/ADMIN)       |
                     |  - Request Tracing (X-Request-Id)                     |
                     |  - Redis Rate Limiting & Route Proxying               |
                     |  - WebSocket Handshake Proxying (/ws)                 |
                     +---------------------------+---------------------------+
                                                 |
         +-------------------+-------------------+-------------------+-------------------+
         |                   |                   |                   |                   |
         v                   v                   v                   v                   v
+-----------------+ +-----------------+ +-----------------+ +-----------------+ +-----------------+
|  Auth Service   | |  User Service   | |Destination Serv | | Package Service | |  Hotel Service  |
|   (Port 8081)   | |   (Port 8082)   | |   (Port 8083)   | |   (Port 8084)   | |   (Port 8085)   |
|   BCrypt, JWT   | | Profiles, Favs  | | Geo Discovery   | | Tour Itineraries| | Rooms & Lodging |
+-----------------+ +-----------------+ +-----------------+ +-----------------+ +-----------------+
         |                   |                   |                   |                   |
         +-------------------+-------------------+-------------------+-------------------+
                             |                   |                   |
                             v                   v                   v
                    +-----------------+ +-----------------+ +-----------------+
                    | Booking Service | | Payment Service | |  Review Service |
                    |   (Port 8086)   | |   (Port 8087)   | |   (Port 8089)   |
                    | State Machine   | | Stripe/Razorpay | | Verified Review |
                    | Inventory Locks | | Idempotent Txns | | Moderation Queue|
                    +--------+--------+ +--------+--------+ +-----------------+
                             |                   |
                             +---------+---------+
                                       |
                                       v
                             +-------------------+
                             | Apache Kafka Bus  |
                             | booking-events    |
                             | payment-events    |
                             +---------+---------+
                                       |
                                       v
                             +-------------------+
                             |Notification Serv. |
                             |   (Port 8088)     |
                             | WebSocket STOMP   |
                             | HTML Email Sender |
                             +-------------------+

Infrastructure Support:
- Eureka Service Registry (Port 8761)
- Spring Cloud Config Server (Port 8888)
- MySQL 8.0 Databases (Dedicated DB per microservice)
- Redis 7 (Caching, Rate Limiting & Session Store)
- Docker & Docker Compose Containerization
- Jenkins Multi-Branch CI/CD Pipeline
```

---

## 📋 Microservices & Port Allocation

| Component | Port | Technology | Database / Store | Responsibility |
|---|---|---|---|---|
| **Service Registry** | `8761` | Eureka Server | In-Memory | Microservice registration & heartbeats |
| **Config Server** | `8888` | Spring Cloud Config | Native Repo | Centralized externalized configurations |
| **API Gateway** | `8080` | Spring Cloud Gateway | Redis | Reactive JWT validation, RBAC, route proxy |
| **Auth Service** | `8081` | Spring Security + JWT | `travelwithus_auth` | User registration, login, token refresh |
| **User Service** | `8082` | Spring Boot Data JPA | `travelwithus_users` | User profiles, preferences, favorites |
| **Destination Service** | `8083` | Spring Boot Data JPA | `travelwithus_destinations`, Redis | World travel destinations, attractions |
| **Package Service** | `8084` | Spring Boot Data JPA | `travelwithus_packages`, Redis | Curated tour packages, slot inventory |
| **Hotel Service** | `8085` | Spring Boot Data JPA | `travelwithus_hotels`, Redis | Hotel catalog, room types, capacities |
| **Booking Service** | `8086` | Spring Boot + Feign | `travelwithus_bookings` | Booking lifecycle, manifests, inventory lock |
| **Payment Service** | `8087` | Spring Boot + Gateway | `travelwithus_payments` | Card processing, Stripe mock, refunds |
| **Notification Service**| `8088` | Kafka + WebSocket | `travelwithus_notifications` | Real-time STOMP push, HTML email templates |
| **Review Service** | `8089` | Spring Boot + Feign | `travelwithus_reviews` | Ratings, booking verification, moderation |
| **Traveler Web** | `3000` | React, Vite, CSS | Client LocalStorage | Customer booking portal, payments, alerts |
| **Admin Portal** | `3001` | React, Vite, CSS | Client LocalStorage | Executive operations, catalog CRUD, ledger |

---

## 🎨 Dual Web Applications

### 1. Customer Traveler Portal (`travelwithus-web`, Port `3000`)
- Built with **React 18**, **Vite**, **React Router 6**, and **Axios**.
- **Luxury Glassmorphism Aesthetic**: Outfit and Plus Jakarta Sans typography, deep slate glassmorphism cards, glowing teal accents.
- **Features**:
  - Global destination explorer with category chips (Beach, Cultural, Adventure, Urban).
  - Curated holiday package browser with discount badges and slot counters.
  - Multi-step booking checkout modal with real-time interactive credit card preview.
  - Live WebSocket / STOMP alert notifications banner with unread counter.
  - "My Bookings" dashboard with 1-click booking cancellation and verified review submissions.
  - Quick-fill demo account login switches (SuperAdmin, Admin, Customer).

### 2. Executive Admin Console (`travelwithus-admin`, Port `3001`)
- Built with **React 18**, **Vite**, **React Router 6**, and **Lucide Icons**.
- **Operations Dark Console Aesthetic**: High-density data tables, real-time KPI metric summaries, modal workflows.
- **Features**:
  - **Overview Dashboard**: Revenue charts, booking status distribution, quick-action shortcuts.
  - **Reservations & Manifests**: Filter by PENDING, CONFIRMED, CANCELLED, inspect traveler manifest, update status.
  - **Tour Package Inventory**: Real-time slot management, add package modal with duration, discounts, and highlights.
  - **Destination Manager**: Manage global destinations, landmark attraction counters, add destination modal.
  - **Partner Hotels & Resorts**: Lodging inventory, room rates, star ratings, add hotel modal.
  - **Review Moderation Queue**: 1-click Approve / Reject moderation actions with verified booking badges.
  - **Financial Ledger**: Transaction ledger with Stripe reference IDs, card masking, and automated refund dispatcher.

---

## 🚀 Running the Project

### Prerequisites
- **Java 21** (or Java 24 host runtime with `<release>21</release>`)
- **Maven 3.9+**
- **Node.js 20+** and **npm**
- **Docker & Docker Compose**

---

### 🐧 Running on Ubuntu / Linux

TravelWithUs comes with automated shell scripts for Ubuntu (20.04 LTS, 22.04 LTS, 24.04 LTS & Debian systems):

#### 1. (Optional) Install Prerequisites on Ubuntu
If your machine is a fresh Ubuntu install or missing dependencies:
```bash
chmod +x *.sh
./setup-ubuntu.sh
```
*(This automatically configures OpenJDK 21, Maven, Node.js 20+, Docker, and core network utilities).*

#### 2. Launch the Platform
```bash
./start-travelwithus.sh
```
The interactive launcher detects your environment (Docker vs. native) and lets you choose:
1. **Frontend Portals** (Customer Web on 3000, Admin on 3001)
2. **Full Stack via Docker Compose** (Containers for MySQL, Redis, Kafka, and all microservices)
3. **Core Backend** (Eureka Registry 8761, Config Server 8888, API Gateway 8080, Auth 8081, User 8082)
4. **Complete Ecosystem** (All 11 microservices + 2 frontends with automated port readiness checks)
5. **Build All Artifacts** (Maven compile & packaging + frontend npm installs)

Logs are saved in the `logs/` directory (e.g., `tail -f logs/api-gateway.log`).

#### 3. Inspect Running Services & Health Status
```bash
./status-travelwithus.sh
```
Prints a real-time status table showing port listeners, process IDs, and HTTP health check responses.

#### 4. Stop All Services Cleanly
```bash
./stop-travelwithus.sh
```
Gracefully shuts down Docker containers and terminates background microservice and frontend processes on ports `3000-3001` and `8080-8089`.

---

### Option A: Running via Docker Compose (Cross-Platform)

To run the complete ecosystem in Docker:

```bash
# 1. Start all infrastructure, backend microservices, and frontends:
docker compose up -d

# 2. Check container status:
docker compose ps

# 3. View streaming logs:
docker compose logs -f api-gateway
```

Once running, access:
- **Traveler Portal**: [http://localhost:3000](http://localhost:3000)
- **Admin Console**: [http://localhost:3001](http://localhost:3001)
- **API Gateway**: [http://localhost:8080](http://localhost:8080)
- **Eureka Dashboard**: [http://localhost:8761](http://localhost:8761)
- **Config Server**: [http://localhost:8888](http://localhost:8888)

---

### Option B: Running Locally Step-by-Step

#### 1. Compile & Test Backend
```bash
mvn clean test -Dmock-maker=mock-maker-subclass
```
*(All 50+ unit and integration tests across 13 modules will pass cleanly).*

#### 2. Start Core Infrastructure Services
In separate terminal windows:
```bash
# Terminal 1: Service Registry
cd service-registry
mvn spring-boot:run

# Terminal 2: Config Server
cd config-server
mvn spring-boot:run

# Terminal 3: API Gateway
cd api-gateway
mvn spring-boot:run
```

#### 3. Start Business Microservices
```bash
# Start Auth, User, Destination, Package, Hotel, Booking, Payment, Notification, Review services:
cd auth-service && mvn spring-boot:run
cd user-service && mvn spring-boot:run
cd destination-service && mvn spring-boot:run
cd package-service && mvn spring-boot:run
cd hotel-service && mvn spring-boot:run
cd booking-service && mvn spring-boot:run
cd payment-service && mvn spring-boot:run
cd notification-service && mvn spring-boot:run
cd review-service && mvn spring-boot:run
```

#### 4. Start Customer Frontend (`travelwithus-web`)
```bash
cd travelwithus-web
npm install
npm run dev
# Running on http://localhost:3000
```

#### 5. Start Admin Portal (`travelwithus-admin`)
```bash
cd travelwithus-admin
npm install
npm run dev
# Running on http://localhost:3001
```

---

## 🔒 Pre-Seeded Demonstration Accounts

| Role | Email Address | Password | Permissions |
|---|---|---|---|
| **Super Admin** | `admin@travelwithus.com` | `Admin@123` | Full administrative control, all microservice endpoints |
| **Support Admin** | `support@travelwithus.com` | `Admin@123` | Operational administrative access |
| **Demo Customer 1** | `john.doe@travelwithus.com` | `Customer@123` | Standard traveler booking privileges |
| **Demo Customer 2** | `alex.mercer@travelwithus.com` | `Customer@123` | Standard traveler booking privileges |

---

## 🔄 CI/CD Pipeline (`Jenkinsfile`)

A declarative Jenkins multi-branch pipeline is included at the project root ([Jenkinsfile](file:///d:/TravelWithUs/Jenkinsfile)) featuring:
1. **Environment & Tool Verification**: Java 21, Maven 3.9, Node.js 20, Docker CLI checks.
2. **Code Quality & Dependency Audit**: Duplicate dependency analysis and checkstyle verification.
3. **Automated Testing**: Parallel execution of Surefire unit and integration test suites with JUnit report archiving.
4. **Fat JAR Packaging**: Building standalone executable JARs for all 11 microservices.
5. **Customer Frontend Build**: Compiling `travelwithus-web` production bundle with Vite.
6. **Admin Portal Build**: Compiling `travelwithus-admin` production bundle with Vite.
7. **Containerization**: Parallel multi-stage Docker build for all microservices and frontends.
8. **Registry Tagging & Push**: Publishing versioned images (`1.0.0-${BUILD_NUMBER}`).

---

## 📚 API Specification

Detailed endpoint signatures, request payloads, response bodies, and query filters are documented in:
👉 [docs/API_REFERENCE.md](file:///d:/TravelWithUs/docs/API_REFERENCE.md)
