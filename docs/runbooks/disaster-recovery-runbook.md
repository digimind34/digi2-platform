# Digi2 Platform - Disaster Recovery Runbook

## Purpose

This runbook defines the procedures for recovering the Digi2 Platform after data loss, infrastructure failure, or major service disruption.

---

# Recovery Objectives

## Recovery Time Objective (RTO)

Target:

* Restore platform within **60 minutes**

---

## Recovery Point Objective (RPO)

Target:

* Maximum acceptable data loss: **24 hours**
* Based on scheduled daily PostgreSQL and media backups.

---

# Recovery Scenarios

## Database Corruption

Steps:

1. Stop application services.
2. Restore the latest verified PostgreSQL backup.
3. Start PostgreSQL.
4. Validate application functionality.
5. Resume production traffic.

---

## Media Loss

Steps:

1. Retrieve latest media archive.
2. Extract media to the production media directory.
3. Verify uploaded files.
4. Restart affected services if necessary.

---

## EC2 Instance Failure

Steps:

1. Launch replacement EC2 instance.
2. Install Docker and Docker Compose.
3. Clone the Digi2 Platform repository.
4. Restore environment configuration.
5. Restore PostgreSQL backup.
6. Restore media backup.
7. Update DNS or reassign Elastic IP.
8. Verify application health.

---

## Complete Environment Recovery

Recovery order:

1. Infrastructure
2. Docker
3. PostgreSQL
4. Backend
5. Frontend
6. Nginx
7. Monitoring
8. Logging
9. Security Services

---

# Validation Checklist

Confirm:

* Website responds over HTTPS.
* Backend health checks pass.
* Frontend loads correctly.
* User authentication works.
* Monitoring dashboards are available.
* Loki receives logs.
* Tempo receives traces.
* Alertmanager is operational.
* Scheduled backups resume.

---

# Recovery Complete

Recovery is complete when:

* All critical services are healthy.
* Monitoring confirms normal operation.
* No critical alerts remain.
* Users can access the platform successfully.
