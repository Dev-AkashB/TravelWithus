# TravelWithUs API Reference & Endpoint Catalogue

This document provides a comprehensive REST API specification for all 11 microservices running behind the **API Gateway** (`http://localhost:8080/api/v1`).

---

## Authentication & Headers
Protected endpoints require an HMAC-SHA256 JWT in the Authorization header:
```http
Authorization: Bearer <your_access_jwt_token>
Content-Type: application/json
```

---

## 1. Authentication Service (`/api/v1/auth`)
*Microservice Port: 8081*

| Method | Endpoint | Access | Description |
|---|---|---|---|
| `POST` | `/api/v1/auth/register` | Public | Register new user account |
| `POST` | `/api/v1/auth/login` | Public | Authenticate user, returns Access JWT & Refresh token |
| `POST` | `/api/v1/auth/refresh` | Public | Exchange refresh token for fresh access token |
| `POST` | `/api/v1/auth/logout` | Authenticated | Invalidate refresh token |
| `GET` | `/api/v1/auth/me` | Authenticated | Retrieve current user session & roles |

---

## 2. User Service (`/api/v1/users`)
*Microservice Port: 8082*

| Method | Endpoint | Access | Description |
|---|---|---|---|
| `GET` | `/api/v1/users/profile` | Authenticated | Retrieve user profile & preferences |
| `PUT` | `/api/v1/users/profile` | Authenticated | Update contact info & preferences |
| `GET` | `/api/v1/users/favorites` | Authenticated | Retrieve saved favorite destinations/packages |
| `POST` | `/api/v1/users/favorites` | Authenticated | Add item to favorites |
| `DELETE` | `/api/v1/users/favorites/{id}` | Authenticated | Remove item from favorites |

---

## 3. Destination Service (`/api/v1/destinations`)
*Microservice Port: 8083*

| Method | Endpoint | Access | Description |
|---|---|---|---|
| `GET` | `/api/v1/destinations` | Public | Search destinations (filters: `query`, `category`, `popular`) |
| `GET` | `/api/v1/destinations/{id}` | Public | Get destination details & landmark attractions |
| `POST` | `/api/v1/destinations` | `ROLE_ADMIN` | Create new travel destination |
| `PUT` | `/api/v1/destinations/{id}` | `ROLE_ADMIN` | Update destination info |
| `DELETE` | `/api/v1/destinations/{id}` | `ROLE_ADMIN` | Delete destination |

---

## 4. Package Service (`/api/v1/packages`)
*Microservice Port: 8084*

| Method | Endpoint | Access | Description |
|---|---|---|---|
| `GET` | `/api/v1/packages` | Public | List & search tour packages with price filters |
| `GET` | `/api/v1/packages/{id}` | Public | Get package details with itinerary & inclusions |
| `POST` | `/api/v1/packages` | `ROLE_ADMIN` | Publish new curated package |
| `PUT` | `/api/v1/packages/{id}` | `ROLE_ADMIN` | Update package pricing or slots |
| `POST` | `/api/v1/packages/{id}/reserve-slots` | Internal / Booking | Reserve inventory slots during checkout |
| `POST` | `/api/v1/packages/{id}/release-slots` | Internal / Booking | Release reserved slots upon cancellation |

---

## 5. Hotel Service (`/api/v1/hotels`)
*Microservice Port: 8085*

| Method | Endpoint | Access | Description |
|---|---|---|---|
| `GET` | `/api/v1/hotels` | Public | Search hotels by destination, stars, price range |
| `GET` | `/api/v1/hotels/{id}` | Public | Get hotel profile & room types inventory |
| `POST` | `/api/v1/hotels` | `ROLE_ADMIN` | Register hospitality partner property |
| `POST` | `/api/v1/hotels/{id}/reserve-rooms` | Internal / Booking | Reserve room capacity |
| `POST` | `/api/v1/hotels/{id}/release-rooms` | Internal / Booking | Release room capacity |

---

## 6. Booking Service (`/api/v1/bookings`)
*Microservice Port: 8086*

| Method | Endpoint | Access | Description |
|---|---|---|---|
| `POST` | `/api/v1/bookings` | Authenticated | Create booking (`PENDING`), lock slots via Feign |
| `GET` | `/api/v1/bookings/my` | Authenticated | Get traveler's booking history |
| `GET` | `/api/v1/bookings/{bookingNumber}` | Authenticated | Get booking details & traveler manifest |
| `POST` | `/api/v1/bookings/{bookingNumber}/cancel` | Authenticated | Cancel booking & trigger inventory release |
| `PUT` | `/api/v1/bookings/{bookingNumber}/payment-status` | Internal / Payment | Confirm payment & transition to `CONFIRMED` |
| `GET` | `/api/v1/bookings/admin/all` | `ROLE_ADMIN` | Paginated booking ledger for admin operations |
| `GET` | `/api/v1/bookings/admin/stats` | `ROLE_ADMIN` | Aggregated revenue and reservation metrics |

---

## 7. Payment Service (`/api/v1/payments`)
*Microservice Port: 8087*

| Method | Endpoint | Access | Description |
|---|---|---|---|
| `POST` | `/api/v1/payments/process` | Authenticated | Process payment with card token / CVV |
| `GET` | `/api/v1/payments/{paymentReference}` | Authenticated | Check payment receipt & status |
| `POST` | `/api/v1/payments/{paymentReference}/refund` | `ROLE_ADMIN` | Issue partial or full refund |
| `GET` | `/api/v1/payments/admin/all` | `ROLE_ADMIN` | Paginated financial transaction logs |

---

## 8. Notification & WebSocket Service (`/api/v1/notifications`, `/ws`)
*Microservice Port: 8088*

| Method / Protocol | Endpoint | Access | Description |
|---|---|---|---|
| `GET` | `/api/v1/notifications/my` | Authenticated | List traveler notifications & unread alerts |
| `PUT` | `/api/v1/notifications/{id}/read` | Authenticated | Mark notification as read |
| `PUT` | `/api/v1/notifications/read-all` | Authenticated | Mark all notifications read |
| `STOMP / SockJS` | `/ws` | Public | Real-time WebSocket connection endpoint |
| `SUBSCRIBE` | `/topic/notifications` | Public | Global broadcast alerts |
| `SUBSCRIBE` | `/topic/user-{userId}` | Authenticated | User-specific real-time booking alerts |

---

## 9. Review & Rating Service (`/api/v1/reviews`)
*Microservice Port: 8089*

| Method | Endpoint | Access | Description |
|---|---|---|---|
| `POST` | `/api/v1/reviews` | Authenticated | Submit review (verifies booking via Feign) |
| `GET` | `/api/v1/reviews/{targetType}/{targetId}` | Public | Get approved reviews for package or hotel |
| `GET` | `/api/v1/reviews/admin/moderation` | `ROLE_ADMIN` | Fetch pending moderation queue |
| `PUT` | `/api/v1/reviews/admin/{id}/moderate` | `ROLE_ADMIN` | Approve or reject review with audit reason |
| `POST` | `/api/v1/reviews/{id}/helpful` | Public | Upvote review helpfulness |
| `DELETE` | `/api/v1/reviews/{id}` | `ROLE_ADMIN` | Delete review |

---

## Default Seed Accounts

| Account Role | Email | Password | Authorities |
|---|---|---|---|
| **Super Admin** | `admin@travelwithus.com` | `Admin@123` | `ROLE_ADMIN`, `ROLE_SUPER_ADMIN` |
| **Operations Admin**| `support@travelwithus.com` | `Admin@123` | `ROLE_ADMIN` |
| **Demo Customer** | `john.doe@travelwithus.com` | `Customer@123` | `ROLE_CUSTOMER` |
| **Demo Customer 2** | `alex.mercer@travelwithus.com`| `Customer@123` | `ROLE_CUSTOMER` |
