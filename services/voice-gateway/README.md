```markdown
# AetherVoice Gateway

Backend service for AetherNet voice agent - part of the Aether drone delivery platform.

> 🔗 **Part of**: [Aether Monorepo](../../)

## 🎯 Purpose

REST API that voice agents use to communicate with the backend system. This is crucial for understanding integration points.

---

## **REST API Specification for AetherNet Voice Agent**

**Base URL:** `https://api.aethernet.com/v1`

**Common Headers:**
```http
Content-Type: application/json
Authorization: Bearer <voice_agent_jwt_token>
X-Transaction-ID: <uuid_for_tracing>
```

---

### **1. API: Order Session Initialization**

**Every voice agent call starts with this API to begin an order session.**

* **Endpoint:** `POST /voice/sessions`
* **Description:** Creates a new order session and returns a Session ID used in all subsequent calls.
* **Request Body:**
```json
{
  "user_phone_number": "+381641234567",
  "call_sid": "CA1234567890abcdef", // Unique ID from telecom operator
  "language": "sr-Latn"
}
```
* **Response (201 Created):**
```json
{
  "session_id": "sess_abc123def456",
  "status": "active",
  "welcome_message": "Dobrodošli u AetherNet. Da li želite da naručite novu dostavu?"
}
```

---

### **2. API: Address Verification**

* **Endpoint:** `POST /voice/sessions/{session_id}/verify-address`
* **Description:** Verifies and geocodes the address spoken by the user.
* **Request Body:**
```json
{
  "spoken_address": "Bulevar Kralja Aleksandra 123, stan 5, Beograd"
}
```
* **Response (200 OK):**
```json
{
  "verified_address": {
    "street": "Bulevar Kralja Aleksandra 123",
    "apartment": "stan 5",
    "city": "Beograd",
    "zip_code": "11000",
    "latitude": 44.8125,
    "longitude": 20.4612
  },
  "confidence_score": 0.95,
  "response_message": "Hvala. Šta želite da naručite i od koga?"
}
```
* **Possible Error Response (422 Unprocessable Entity):**
```json
{
  "error_code": "ADDRESS_AMBIGUOUS",
  "message": "Našao sam više adresa. Da li ste mislili na Bulevar Kralja Aleksandra 123 ili Bulevar Kralja Aleksandra 123a?",
  "suggestions": ["Bulevar Kralja Aleksandra 123", "Bulevar Kralja Aleksandra 123a"]
}
```

---

### **3. API: Merchant Availability Check**

* **Endpoint:** `POST /voice/sessions/{session_id}/verify-merchant`
* **Description:** Checks if the merchant exists in the database and is available for delivery.
* **Request Body:**
```json
{
  "merchant_name": "Bistro Slavija",
  "items": [
    {"name": "kafa", "quantity": 2},
    {"name": "sendvič sa šunkom", "quantity": 1}
  ]
}
```
* **Response (200 OK):**
```json
{
  "merchant_id": "merch_789xyz",
  "merchant_name": "Bistro Slavija",
  "is_available": true,
  "estimated_preparation_time": 15,
  "response_message": "Odličan izbor. Kada želite da vam dostavimo? Odmah ili određeno vreme?"
}
```
* **Error Response (404 Not Found):**
```json
{
  "error_code": "MERCHANT_NOT_FOUND",
  "message": "Izvinite, 'Bistro Slavija' trenutno nema dostupne dronove. Da li želite da vidimo druge bistroe u vašoj blizini?",
  "alternative_merchants": [
    {"id": "merch_456abc", "name": "Bistro Moskva", "distance_km": 0.8},
    {"id": "merch_123def", "name": "Cafe Drina", "distance_km": 1.2}
  ]
}
```

---

### **4. API: Availability Check and Price Calculation**

* **Endpoint:** `POST /voice/sessions/{session_id}/calculate-quote`
* **Description:** Checks drone availability and calculates total delivery price.
* **Request Body:**
```json
{
  "delivery_time_type": "now", // or "scheduled" with "scheduled_time": "2024-01-15T18:30:00Z"
}
```
* **Response (200 OK):**
```json
{
  "delivery_available": true,
  "estimated_delivery_minutes": 25,
  "breakdown": {
    "items_total": 650.00,
    "delivery_fee": 200.00,
    "total": 850.00
  },
  "currency": "RSD",
  "response_message": "Vaša dostava će stići za 25 minuta. Ukupna cena je 850 dinara, uključujući dostavu. Da li potvrđujete narudžbinu?"
}
```
* **Error Response (503 Service Unavailable):**
```json
{
  "error_code": "NO_DRONES_AVAILABLE",
  "message": "Izvinite, trenutno nemamo dostupne dronove u vašoj zoni. Molimo pokušajte za 15 minuta."
}
```

---

### **5. API: Order Confirmation and Creation**

* **Endpoint:** `POST /voice/sessions/{session_id}/confirm-order`
* **Description:** Finalizes the order and creates it in the system.
* **Request Body:**
```json
{
  "user_confirmed": true,
  "payment_method": "card" // or "wallet"
}
```
* **Response (201 Created):**
```json
{
  "order_id": "order_aeth789012",
  "status": "pending_payment",
  "payment_intent_id": "pi_abc123",
  "response_message": "Hvala. Kako želite da platite? Karticom preko telefona ili novčanikom u aplikaciji?"
}
```

---

### **6. API: Payment Processing**

* **Endpoint:** `POST /voice/sessions/{session_id}/process-payment`
* **Description:** Processes payment after the user selects payment method.
* **Request Body:**
```json
{
  "payment_method": "card",
  "payment_details": {
    "token": "tok_visa_123abc" // tokenized card data
  }
}
```
* **Response (200 OK):**
```json
{
  "payment_status": "succeeded",
  "order_id": "order_aeth789012", 
  "tracking_url": "https://track.aethernet.com/order_aeth789012",
  "response_message": "Vaša narudžbina je prihvaćena! Broj vaše pošiljke je AETH-789-012. Dron će krenuti uskoro. Pratite njegov let putem SMS linka koji ćete dobiti. Hvala što koristite AetherNet!"
}
```

---

### **7. API: Session Cancellation**

* **Endpoint:** `POST /voice/sessions/{session_id}/cancel`
* **Description:** Used if the user cancels the order or the call ends.
* **Request Body:**
```json
{
  "reason": "user_cancelled" // or "call_ended", "timeout"
}
```
* **Response (200 OK):**
```json
{
  "session_status": "cancelled",
  "message": "Session cancelled successfully"
}
```

---

### **Call Sequence Diagram**

```
[Voice Agent]            [AetherNet Backend]
     |                             |
     | POST /voice/sessions        |
     |---------------------------->|
     |     session_id: "sess_123"  |
     |<----------------------------|
     |                             |
     | POST /verify-address        |
     |---------------------------->|
     |    verified_address data    |
     |<----------------------------|
     |                             |
     | POST /verify-merchant       |
     |---------------------------->|
     |   merchant availability     |
     |<----------------------------|
     |                             |
     | POST /calculate-quote       |
     |---------------------------->|
     |    delivery quote & ETA     |
     |<----------------------------|
     |                             |
     | POST /confirm-order         |
     |---------------------------->|
     |     order_id, status        |
     |<----------------------------|
     |                             |
     | POST /process-payment       |
     |---------------------------->|
     |   payment confirmation      |
     |<----------------------------|
     |                             |
```

These APIs provide a solid foundation for integrating voice agents with the backend system. Each endpoint is designed to be idempotent where possible and returns clear user messages that the agent can use directly.

---

## 🚀 Quick Start

```bash
# From the voice-gateway directory
cd services/voice-gateway

# Run the application
./mvnw spring-boot:run

# Or with profile
./mvnw spring-boot:run -Dspring-boot.run.profiles=local

# Access APIs
http://localhost:8080/v1/health
http://localhost:8080/v1/swagger-ui/index.html
```

## 🏗 Architecture

```
Voice Agent → AetherVoice Gateway → MySQL
                    ↓
            (Future) User Management
                    ↓  
            (Future) Drone Orchestrator
```

## 🔧 Configuration

See [configuration guide](./docs/configuration.md) for environment setup.

## 🧪 Testing

```bash
# Unit tests
./mvnw test

# Integration tests  
./mvnw verify
```

## 👥 Team

