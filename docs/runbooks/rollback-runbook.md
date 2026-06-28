# Digi2 Platform - Production Rollback Runbook

## Purpose

This runbook describes the standard rollback procedure for the Digi2 Platform when a deployment introduces issues affecting availability, functionality, or stability.

---

# Rollback Triggers

Initiate a rollback if any of the following occur after deployment:

* Application health checks fail.
* Backend or frontend containers fail to start.
* Database migrations fail.
* Login or registration is unavailable.
* Critical dashboards become inaccessible.
* Prometheus reports critical alerts.
* Elevated 5xx HTTP errors.
* Severe performance degradation.

---

# Rollback Procedure

## 1. Verify Current Status

```bash
docker-compose ps
```

---

## 2. Review Recent Deployment

```bash
cat deployment-history/releases.log
```

---

## 3. Execute Rollback

```bash
./scripts/rollback.sh
```

If using blue/green deployment:

```bash
./scripts/switch-traffic.sh
```

or

```bash
./scripts/promote-release.sh
```

depending on the deployment strategy.

---

## 4. Verify Rollback

```bash
docker-compose ps
```

Confirm all critical services are healthy:

* Nginx
* Backend
* Frontend
* PostgreSQL

---

## 5. Validate Application

Verify:

* Homepage
* Login
* Registration
* Customer Dashboard
* Business Dashboard
* Services
* Billing

---

## 6. Validate Observability

Confirm:

* Prometheus targets are UP.
* Grafana dashboards load.
* Loki receives logs.
* Tempo receives traces.
* No new critical alerts.

---

## 7. Document the Incident

Record:

* Deployment version
* Rollback reason
* Time of rollback
* Services affected
* Root cause (if known)
* Corrective actions

---

# Rollback Complete

A rollback is considered successful when:

* Users can access the platform.
* Health checks pass.
* Monitoring returns to normal.
* Critical alerts clear.
