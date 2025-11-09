REST API koji će glasovni agent koristiti da komunicira sa backend sistemom. Ovo je ključno za razumevanje integracionih tački.

---

### **REST API Specifikacija za AetherNet Glasovni Agent**

**Bazni URL:** `https://api.aethernet.com/v1`

**Zajednički Zaglavlja (Common Headers):**
```http
Content-Type: application/json
Authorization: Bearer <voice_agent_jwt_token>
X-Transaction-ID: <uuid_for_tracing>
```

---

### **1. API: Inicijalizacija Sesije Narudžbine**

**Svaki poziv glasovnog agenta počinje ovim API-jem kako bi se započela sesija narudžbine.**

* **Endpoint:** `POST /voice/sessions`
* **Opis:** Kreira novu sesiju narudžbine i vraća Session ID koji se koristi u svim narednim pozivima.
* **Request Body:**
```json
{
  "user_phone_number": "+381641234567",
  "call_sid": "CA1234567890abcdef", // Unique ID od telekom operatora
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

### **2. API: Verifikacija i Provera Adrese**

* **Endpoint:** `POST /voice/sessions/{session_id}/verify-address`
* **Opis:** Proverava i geokodira adresu koju je korisnik izgovorio.
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
* **Mogući Error Response (422 Unprocessable Entity):**
```json
{
  "error_code": "ADDRESS_AMBIGUOUS",
  "message": "Našao sam više adresa. Da li ste mislili na Bulevar Kralja Aleksandra 123 ili Bulevar Kralja Aleksandra 123a?",
  "suggestions": ["Bulevar Kralja Aleksandra 123", "Bulevar Kralja Aleksandra 123a"]
}
```

---

### **3. API: Provera Dostupnosti Pošiljaoca**

* **Endpoint:** `POST /voice/sessions/{session_id}/verify-merchant`
* **Opis:** Proverava da li pošiljalac postoji u bazi i da li je dostupan za dostavu.
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

### **4. API: Provera Dostupnosti i Kalkulacija Cene**

* **Endpoint:** `POST /voice/sessions/{session_id}/calculate-quote`
* **Opis:** Proverava dostupnost dronova i računa ukupnu cenu dostave.
* **Request Body:**
```json
{
  "delivery_time_type": "now", // ili "scheduled" sa "scheduled_time": "2024-01-15T18:30:00Z"
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

### **5. API: Potvrda i Kreiranje Narudžbine**

* **Endpoint:** `POST /voice/sessions/{session_id}/confirm-order`
* **Opis:** Finalizira narudžbinu i kreira je u sistemu.
* **Request Body:**
```json
{
  "user_confirmed": true,
  "payment_method": "card" // ili "wallet"
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

### **6. API: Obrada Plaćanja**

* **Endpoint:** `POST /voice/sessions/{session_id}/process-payment`
* **Opis:** Procesira plaćanje nakon što korisnik izabere način plaćanja.
* **Request Body:**
```json
{
  "payment_method": "card",
  "payment_details": {
    "token": "tok_visa_123abc" // tokenizirani podaci o kartici
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

### **7. API: Otkazivanje Sesije**

* **Endpoint:** `POST /voice/sessions/{session_id}/cancel`
* **Opis:** Koristi se ako korisnik otkaže narudžbinu ili se poziv prekine.
* **Request Body:**
```json
{
  "reason": "user_cancelled" // ili "call_ended", "timeout"
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

### **Dijagram Sekvence Poziva (Sequence Diagram)**

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

Ovi API-jevsi obezbeduju čvrstu podlogu za integraciju glasovnog agenta sa backend sistemom. Svaki endpoint je dizajniran da bude idempotentan gde je to moguće i vraća jasne poruke za korisnika koje agent može direktno da koristi.
