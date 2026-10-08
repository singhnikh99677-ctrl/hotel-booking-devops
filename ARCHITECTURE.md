# Project Architecture

Browser
  |
  v
Nginx Frontend (port 3000)
  |
  v
Express Backend (port 5000)
  |
  v
MySQL (port 27017)

CI/CD:
GitHub -> Jenkins -> npm test -> security audit -> Docker build -> Docker Compose test -> Kubernetes validation

Data:
MySQL stores the 3 hotel records and every confirmed booking.
A booking stores hotel name, place, guest name, guests, check-in, check-out, nights and total amount.

Monitoring:
Backend exposes /metrics. Prometheus can scrape it in Kubernetes.
Kubernetes probes check backend health and frontend readiness.
