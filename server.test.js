const request = require('supertest');
const app = require('./server'); // Imports your Express app

describe('SwiftSend Backend Automated Tests', () => {

    // ---------------------------------------------------------
    // Test 1: Health Check
    // ---------------------------------------------------------
    test('GET / - Should return 200 OK (Server is running)', async () => {
        const res = await request(app).get('/');
        expect(res.statusCode).toEqual(200);
    });

    // ---------------------------------------------------------
    // Test 2: Login Validation (Invalid Input Handling)
    // ---------------------------------------------------------
    test('POST /api/login - Should return 400 if email or password is missing', async () => {
        const res = await request(app)
            .post('/api/login')
            .send({ 
                email: '', 
                password: '', 
                role: 'Customer' 
            });
        
        // Expecting a 400 Bad Request because fields are empty
        expect(res.statusCode).toEqual(400);
    });

    // ---------------------------------------------------------
    // Test 3: Registration Validation (Invalid Input Handling)
    // ---------------------------------------------------------
    test('POST /api/register - Should return 400 if required fields are missing', async () => {
        const res = await request(app)
            .post('/api/register')
            .send({ 
                full_name: 'John Doe' 
                // Missing email, password, role, etc.
            });
        
        expect(res.statusCode).toEqual(400);
    });

    // ---------------------------------------------------------
    // Test 4: 404 Route Handling
    // ---------------------------------------------------------
    test('GET /api/unknown-route - Should return 404 Not Found', async () => {
        const res = await request(app).get('/api/this-route-does-not-exist');
        expect(res.statusCode).toEqual(404);
    });

});