# Database Schema Overview

The platform utilizes a **PostgreSQL** relational database. The schema is entirely defined and managed by Django's ORM via migrations.

## Core Applications & Models

### 1. User / Accounts (`accounts`)

The platform relies on a user model (either default Django `User` or a customized subclass) to manage authentication and profile data.

*   **User**
    *   `id` (Primary Key)
    *   `username` (Unique, string)
    *   `email` (Unique, string)
    *   `first_name` (String)
    *   `last_name` (String)
    *   `password` (Hashed)
    *   `is_staff` / `is_superuser` (Booleans for admin access)
    *   `date_joined` (Datetime)

### 2. Businesses (`businesses`)

Manages the core domain entity of the platform: Handyman and service businesses.
Manages the core domain entity of the platform: The Business Profile.

*   *(Exact schema depends on `businesses/models.py`, but conceptually includes fields like Business Name, Owner/User ForeignKey, Contact Info, Address/City, and Service Type).*
*   **BusinessProfile**
    *   `id` (Primary Key)
    *   `owner` (OneToOne to User)
    *   `business_name` (String, 255)
    *   `slug` (Unique Slug)
    *   `category` (String, 100)
    *   `description` (Text)
    *   `phone`, `address`, `city`, `province`, `country`, `website` (Contact/Location fields)
    *   `logo` (Image)
    *   `is_active` (Boolean)