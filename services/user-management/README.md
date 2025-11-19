# Aether User Management Service

User Management microservice for the Aether platform.  
Responsible for authentication, authorization, roles, permissions, and issuing JWT tokens.

## 🧱 Tech Stack
- Java 21
- Spring Boot 3.5.x
- Spring Security 6
- Spring Data JPA (MySQL)
- JWT (access & refresh tokens)
- Lombok
- SpringDoc OpenAPI

## 🚀 Running locally

Create database:

```sql
CREATE DATABASE aethernet_user CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
