# Architecture Overview

## System Purpose

MiTurno is a queue management system for branch offices (banks, clinics, government offices). Customers arrive, take a numbered turn, receive a QR code, and recive appoitment updates from their phone. Cashiers manage the queue from an admin panel.

## Service Breakdown

### appointment-service (Core)

**Responsibility:** Manages the queue — creating appointments, assigning turn numbers, tracking status (waiting → in-progress → completed).

**Tech:** Java 21, Spring Boot, Spring Data JPA, PostgreSQL.

### qr-service (Planned)

**Responsibility:** Generates QR codes for turn tickets.

**Tech:** Java 21, Spring Boot.

### notification-service (Planned)

**Responsibility:** Sends SMS alerts when a client's appointment is updated. Listens to RabbitMQ events published by the appointment-service.

**Tech:** Java 21, Spring Boot, RabbitMQ consumer.

### auth-service (Planned)

**Responsibility:** JWT-based authentication for staff users (cashiers, admins).

**Tech:** Java 21, Spring Boot, Spring Security, JWT.

### frontend

**Responsibility:** Single-page application with four screens:
1. **Client form** (`/`) — customer enters their info to take a turn
2. **Cashier panel** (`/admin`) — staff calls next turn, marks complete
3. **Kiosko display** (planned) — large screen showing current queue
4. **Mobile QR view** (planned) — client checks position via QR code

**Tech:** React 18, Vite, TailwindCSS.

## Communication Between Services

```
appointment-service ──publish──▶ RabbitMQ ──consume──▶ notification-service
                                                   ──▶ qr-service
```

Services communicate asynchronously through RabbitMQ. When an appointment is created or its status changes, the appointment-service publishes an event. Other services consume these events independently.

This pattern means services don't need to know about each other — they only know about the message queue.

## Infrastructure

### Docker Compose (current)

All infrastructure runs in Docker containers orchestrated by `docker-compose.yml`:
- **PostgreSQL 16** (alpine) — port 5432, with health checks and persistent volume
- **RabbitMQ 3** (management) — ports 5672 (AMQP) and 15672 (management UI)
- Shared bridge network (`app_network`) for inter-container communication

### Kubernetes (planned)

The project will migrate from Docker Compose to Kubernetes for production-like deployment, with manifests for each service, Ingress routing, and ConfigMaps/Secrets for configuration.

## CI/CD

GitHub Actions pipeline (`.github/workflows/build.yml`) with:
- **Path-filtered builds** using `dorny/paths-filter` — only changed services are rebuilt
- **Maven dependency caching** — faster builds after the first run
- Triggers on push to `main` and pull requests
