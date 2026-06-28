# Digi2 Platform - Production Deployment Runbook

## Purpose

This runbook describes the standard production deployment procedure for the Digi2 Platform.

---

# Architecture

* AWS EC2
* Docker Compose
* Nginx Reverse Proxy
* Django Backend
* Next.js Frontend
* PostgreSQL
* GitHub Actions CI/CD
* Blue/Green Deployment
* Prometheus
* Grafana
* Loki
* Tempo
* OpenTelemetry
* Falco Runtime Security

---

# Prerequisites

Before deploying, verify:

* GitHub Actions completed successfully.
* Docker images were pushed to Amazon ECR.
* EC2 instance is healthy.
* PostgreSQL is running.
* Available disk space is sufficient.
* Current production deployment is healthy.

---

# Deployment Procedure

## 1. Connect to Production Server

```bash
ssh ec2-user@<production-server>
```

---

## 2. Navigate to Project

```bash
cd ~/DIGI2-PLATFORM
```

---

## 3. Verify Current Status

```bash
docker-compose ps
```

Confirm:

* Backend healthy
* Frontend healthy
* PostgreSQL healthy
* Nginx healthy

---

## 4. Pull Latest Code

```bash
git pull origin main
```

---

## 5. Deploy New Version

```bash
./scripts/deploy-version.sh
```

---

## 6. Verify Deployment

```bash
docker-compose ps
```

Verify:

* Containers are healthy.
* No restart loops.
* No failed containers.

---

## 7. Validate Website

```bash
curl -I https://localhost -k
```

Expected:

```
HTTP/1.1 200 OK
```

---

## 8. Verify Monitoring

Confirm:

* Prometheus targets are UP.
* Grafana dashboards load.
* Loki receives logs.
* Tempo receives traces.
* Falco generates runtime events.

---

## 9. Verify Application

Test:

* Homepage
* Login
* Registration
* Customer Dashboard
* Business Dashboard
* Services
* Billing
* Stripe Checkout

---

## 10. Deployment Complete

Deployment is considered successful after:

* Application is available.
* Monitoring is healthy.
* No active alerts.
* Error logs remain normal.
* Health checks pass.

---

# Rollback Criteria

Rollback immediately if:

* Health checks fail.
* Database migration fails.
* Application errors increase.
* Login fails.
* Dashboard unavailable.
* Critical monitoring alerts appear.

Refer to:

**rollback-runbook.md**
