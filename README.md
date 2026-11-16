# SwiftSend Backend API

The Node.js and Express REST API backend for the SwiftSend Courier Management System. It handles authentication, delivery management, and database interactions.

##  Technologies Used
*   **Runtime:** Node.js
*   **Framework:** Express.js
*   **Database:** MySQL (mysql2)
*   **Security:** bcryptjs (Password Hashing), CORS
*   **Testing:** Jest, Supertest
*   **CI/CD:** GitHub Actions

##  API Endpoints
*   `POST /api/register` - Register a new user (Customer/Driver)
*   `POST /api/login` - Authenticate user and return role
*   `GET /api/deliveries` - Get all deliveries
*   `PUT /api/deliveries/:tracking/status` - Update delivery status
*   `GET /api/drivers/:id/deliveries` - Get deliveries for a specific driver
*   `GET /api/customers/:id/deliveries` - Get deliveries for a specific customer

##  Automated Testing
This project uses **Jest** and **Supertest** for API integration testing. 
To run the tests locally:
```bash
npm install
npm test
