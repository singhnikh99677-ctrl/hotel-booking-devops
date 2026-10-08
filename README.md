# Hotel Booking System – CI/CD Automation

A beginner-friendly hotel booking website + backend + MySQL + Docker + Kubernetes + Jenkins CI/CD project.

## Main features
- Search hotels by place
- 3 sample hotel cards
- Select check-in/check-out dates and guests
- Calculate booking amount automatically
- Save bookings in MySQL
- View recent bookings
- Backend health check
- Docker Compose setup
- Kubernetes deployment files
- Jenkins CI/CD pipeline
- Basic security validation with Helmet, rate limiting and npm audit
- Prometheus metrics endpoint
- Kubernetes readiness/liveness probes
- Blue/green-style deployment example for backend

## Folder structure

hotel-booking-devops/
├── frontend/
│   ├── index.html
│   ├── style.css
│   ├── app.js
│   ├── Dockerfile
│   └── nginx.conf
├── backend/
│   ├── src/
│   │   ├── server.js
│   │   ├── config/db.js
│   │   ├── models/Hotel.js
│   │   ├── models/Booking.js
│   │   ├── routes/hotels.js
│   │   ├── routes/bookings.js
│   │   ├── routes/health.js
│   │   ├── middleware/errorHandler.js
│   │   ├── seed.js
│   │   └── metrics.js
│   ├── tests/api.test.js
│   ├── package.json
│   └── Dockerfile
├── k8s/
│   ├── namespace.yaml
│   ├── mysql.yaml
│   ├── backend.yaml
│   ├── backend-blue.yaml
│   ├── frontend.yaml
│   └── monitoring.yaml
├── monitoring/
│   └── prometheus.yml
├── docker-compose.yml
├── Jenkinsfile
├── .gitignore
└── .dockerignore

## Default ports
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000
- Backend health: http://localhost:5000/api/health
- Backend metrics: http://localhost:5000/metrics
- MySQL: localhost:27017

## Important note
This is a college/learning project. It does not process real payments or real hotel reservations. Booking records are stored locally in MySQL.


## Kubernetes frontend
The Kubernetes frontend uses the same full website from `frontend/`. Nginx forwards `/api` requests to the Kubernetes `hotel-backend` service, so the browser does not need to know the backend pod address.


## Database
This project uses **MySQL 8.0**, not MongoDB.

Database:
- Database name: `hotel_booking`
- User: `root`
- Password in local Docker learning setup: `root`
- Port: `3306`

Tables:
- `hotels`
- `bookings`

The backend automatically creates these tables when it starts and inserts 3 sample hotels if the `hotels` table is empty.

## SQL booking data
A booking stores:
`hotel_id`, `hotel_name`, `place`, `guest_name`, `guests`, `check_in`, `check_out`, `nights`, `total_amount`, and `status`.
