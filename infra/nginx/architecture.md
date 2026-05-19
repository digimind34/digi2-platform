# Architecture Overview

DIGI2-PLATFORM is a modern, containerized full-stack web application designed for high performance, security, and scalability.

## High-Level Components

*   **Frontend:** Built with Next.js (App Router), React, and TypeScript. It is optimized as a `standalone` Node.js build for production.
*   **Backend:** Powered by Django and Django REST Framework (DRF) using Python. It uses Gunicorn as the WSGI HTTP server in production.
*   **Database:** PostgreSQL 16, serving as the primary relational database.
*   **Reverse Proxy / API Gateway:** Nginx handles request routing, SSL termination (Let's Encrypt / Certbot), gzip compression, and HTTP-to-HTTPS redirection.

## Infrastructure & Deployment

The platform is fully containerized using **Docker** and orchestrated locally/in-production using **Docker Compose**.

*   **AWS Integration:** CI/CD pipelines (GitHub Actions) build and push Docker images to Amazon Elastic Container Registry (ECR).
*   **Terraform:** Used for provisioning cloud infrastructure components (e.g., ECR repositories).

## Traffic Flow

1.  Incoming traffic hits **Nginx** on ports 80/443. Port 80 traffic is redirected to 443 (HTTPS).
2.  Nginx routes requests based on the URL path:
    *   `/api/*`, `/admin/*`, `/static/*`, `/media/*` -> Proxied to the **Django Backend** (port 8000).
    *   `/` (all other routes) -> Proxied to the **Next.js Frontend** (port 3000).
3.  The **Django Backend** communicates securely with the **PostgreSQL** database on its internal Docker network.

## Security
The platform employs a decoupled, secure cookie-based architecture. JWTs are stored in `HttpOnly`, `SameSite=Lax`, and `Secure` cookies to protect against XSS, while Double-Submit CSRF cookies and strict Origin checks protect against Cross-Site Request Forgery.