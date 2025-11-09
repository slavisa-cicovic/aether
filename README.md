# 🚀 Aether - Autonomous Drone Delivery Platform

A complete ecosystem for autonomous drone delivery services.

## 🏗 Architecture

## 📦 Services

### Backend Services
- **[voice-gateway](./voice-gateway/)** - Voice agent integration for order placement
- **[user-management](./user-management/)** - User authentication and management  
- **[drone-orchestrator](./drone-orchestrator/)** - Drone fleet management and delivery coordination

### Frontend Applications
- **[mobile-app](./mobile-app/)** - React Native mobile application
- **[web-dashboard](./web-dashboard/)** - React web dashboard for operators

### Shared Resources
- **[shared](./shared/)** - Common libraries and configurations
- **[docs](./docs/)** - Project documentation

## 🚀 Quick Start

```bash
# Clone the repository
git clone https://github.com/your-username/aether.git
cd aether

# Start all services (requires Docker)
docker-compose up -d

# Or start individual services
cd voice-gateway && ./mvnw spring-boot:run