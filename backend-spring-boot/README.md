# Amazon Prime Retail Ecosystem - Spring Boot 3 & MySQL Backend

Enterprise microservice backend engineered with **Spring Boot 3.3.4**, **Java 17**, **Spring Data JPA (Hibernate 6)**, **Spring Security 6**, and **MySQL 8.0**.

---

## 🏗️ Architecture & Technology Stack

| Component | Technology | Version | Purpose |
|---|---|---|---|
| **Framework** | Spring Boot | `3.3.4` | Core MVC, REST controllers, Dependency Injection |
| **Language** | Java / OpenJDK | `17` LTS | Strict type safety and high-throughput execution |
| **ORM / Data** | Spring Data JPA | `Hibernate 6` | Schema generation, repository abstraction, transactions |
| **Relational DB** | MySQL | `8.0` | ACID storage with HikariCP connection pooling |
| **Security** | Spring Security 6 | `6.3` | Stateless JWT Bearer auth, RBAC, AES-256 GCM encryption |
| **API Docs** | SpringDoc OpenAPI | `2.5.0` | Swagger UI 3 interactive documentation (`/swagger-ui.html`) |
| **Monitoring** | Spring Boot Actuator | `3.3.4` | `/actuator/health`, `/actuator/metrics` |

---

## 🚀 REST API Endpoints Overview

### 1. Catalog & Inventory (`/api/v1/products`)
- `GET /api/v1/products` - Filter catalog with `query`, `category`, `primeOnly`, `maxPrice`
- `GET /api/v1/products/{id}` - Fetch individual product detail
- `POST /api/v1/products` - Create new product (Admin / Seller)
- `PUT /api/v1/products/{id}` - Update title, price, description, images
- `POST /api/v1/products/{id}/restock` - Add inventory units (+25 / +100)
- `DELETE /api/v1/products/{id}` - Delist product from storefront

### 2. Orders & Fulfillment (`/api/v1/orders`)
- `GET /api/v1/orders` - List all orders or filter by user (`?userId=...`)
- `GET /api/v1/orders/{id}` - Get order details, tracking checkpoints
- `POST /api/v1/orders` - Place new customer order
- `PUT /api/v1/orders/{id}/status` - Advance order lifecycle (`Processing` → `Shipped` → `Out for Delivery` → `Delivered`)

### 3. Seller Central (`/api/v1/seller`)
- `GET /api/v1/seller/analytics` - Gross Merchandise Value (GMV), buy-box win rate, low-stock count

### 4. Security Vault & Backups (`/api/v1/security`)
- `GET /api/v1/security/backups` - List encrypted database snapshots
- `POST /api/v1/security/backups/trigger` - Run automated encrypted backup routine
- `GET /api/v1/security/audit-logs` - Inspect SHA-256 signed tamper-proof audit trails

### 5. Authentication (`/api/v1/auth`)
- `POST /api/v1/auth/login` - Standard email/password JWT authentication
- `POST /api/v1/auth/social` - OAuth 2.0 social sign-in (Google, Apple, Facebook, GitHub)

---

## 💻 How to Run Locally

### Option A: Running with Maven
```bash
cd backend-spring-boot
./mvnw clean spring-boot:run
```
The application will launch on `http://localhost:8080`.
Access Swagger UI at `http://localhost:8080/swagger-ui.html`.

### Option B: Running with Docker Compose (MySQL 8 + Spring Boot)
```bash
cd backend-spring-boot
docker compose up --build -d
```
This automatically boots MySQL 8 on port 3306 and the Spring Boot application on port 8080.
