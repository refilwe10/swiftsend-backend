# SwiftSend Backend API

Node.js + Express backend for the SwiftSend Courier Management System.

## Features

- REST API for mobile app and website
- User registration & login with bcrypt password encryption
- Role-based authentication (Customer / Driver)
- Delivery management endpoints
- Status update endpoints
- CORS enabled for cross-platform access

## API Endpoints

| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/` | GET | Health check |
| `/api/customers` | GET | Get all customers |
| `/api/register` | POST | Register new user |
| `/api/login` | POST | Login |
| `/api/deliveries` | GET/POST | Manage deliveries |
| `/api/drivers/:id/deliveries` | GET | Driver's deliveries |
| `/api/customers/:id/deliveries` | GET | Customer's parcels |
| `/api/deliveries/:tracking/status` | PUT | Update status |

## Setup

1. Clone the repository:
   ```bash
   git clone https://github.com/refilwe10/swiftsend-backend.git
   cd swiftsend-backend
