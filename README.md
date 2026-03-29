# MiTurno

Queue management system for branch offices — built with microservices, containerized infrastructure, and CI/CD automation.

Customers take a turn, get a QR code, and track their position in line from the kiosk panel, additional they receive any update of their appointments via Phone message. Cashiers manage the queue from an admin panel.

## Tech Stack

**Backend:** Java 25, Spring Boot, Spring Data JPA, RabbitMQ  
**Frontend:** React 18, Vite, TailwindCSS, React Router  
**Database:** PostgreSQL 16  
**Infrastructure:** Docker, Docker Compose  
**CI/CD:** GitHub Actions with path-filtered builds and Maven caching  
**Messaging:** RabbitMQ (async event-driven communication between services)

## Architecture

```
┌─────────────┐     ┌──────────────────────┐     ┌──────────────────┐
│   Frontend   │────▶│  appointment-service  │────▶│    PostgreSQL    │
│  React/Vite  │     │   (Spring Boot API)   │     │                  │
└─────────────┘     └──────────┬───────────┘     └──────────────────┘
                               │
                               │ RabbitMQ
                               ▼
                    ┌──────────────────────┐
                    │  notification-service │
                    │     (SMS / alerts)    │
                    └──────────────────────┘
                    ┌──────────────────────┐
                    │      qr-service       │
                    │   (QR code generation)│
                    └──────────────────────┘
```

Each service is an independent Spring Boot application with its own database and Dockerfile.

## Project Structure

```
miturno/
├── appointment-service/     # Core API — appointments, clients, queue logic
├── qr-service/              # QR code generation (planned)
├── notification-service/    # SMS notifications via RabbitMQ (planned)
├── frontend/                # React SPA — client form + admin panel
├── docker-compose.yml       # PostgreSQL + RabbitMQ containers
├── .github/workflows/
│   └── build.yml            # CI pipeline with path filters
└── docs/                    # Architecture decisions and change logs
    ├── README.md
    ├── architecture.md
    ├── changelog/
    │   └── build-yml.md
    └── decisions/
        └── 001-client-user-separation.md
```

## What's Working

- **appointment-service**: REST API with `Appointment`, `Client`, and `User` entities. Full backend layer — repository, service (`@Transactional`), controller, DTO (Java record). Connected to PostgreSQL via Docker.
- **RabbitMQ messaging**: Publisher/consumer created, messages verified via management UI.
- **Frontend**: React app with routing (`/` → client form, `/admin` → admin panel).
- **CI/CD pipeline**: GitHub Actions with `dorny/paths-filter` — only changed services rebuild. Maven dependency caching enabled.
- **Docker Compose**: PostgreSQL (port 5432) and RabbitMQ (ports 5672/15672) running on a shared bridge network.

## What's Next

- [ ] Admin panel component (frontend)
- [ ] `appointment-service` — Add Repository, REST Controllers, Services
- [ ] `auth-service` — Spring Boot + JWT authentication
- [ ] `qr-service` — QR code generation for turn tickets
- [ ] `notification-service` — SMS alerts when turn is approaching
- [ ] Docker Compose → Kubernetes migration

## Quick Start

```bash
# Start infrastructure
docker compose up -d

# Run appointment-service
cd appointment-service
./mvnw spring-boot:run

# Run frontend
cd frontend
npm install
npm run dev
```

- Frontend: http://localhost:5173
- RabbitMQ Management: http://localhost:15672 (guest/guest)
- Appointment API: http://localhost:8080/api/appointments

## Documentation

Detailed documentation lives in [`docs/`](./docs/):

- [**Architecture Overview**](./docs/architecture.md) — system design, service boundaries, and tech choices
- [**Change Logs**](./docs/changelog/) — what changed in each config file and why
- [**Architecture Decisions**](./docs/decisions/) — ADRs explaining key design choices

## About This Project

MiTurno is a personal project that serves two purposes: a functional queue management system and a DevOps learning lab. It demonstrates end-to-end ownership — from architecture design and backend development to containerization, CI/CD, and infrastructure automation.

Built by [Esmeralda Medrano](https://github.com/EsmeraldaMtz-dev).