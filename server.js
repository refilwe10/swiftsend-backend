// ========================================
// SwiftSend Backend Server
// Supports: Drivers + Customers
// ========================================

const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

// ---------- Database Connection ----------
const db = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

// ---------- Test Route ----------
app.get('/', (req, res) => {
    res.send(' SwiftSend Backend is running!');
});

// ---------- Get All Customers ----------
app.get('/api/customers', (req, res) => {
    const sql = 'SELECT customer_id, full_name, email, phone, address FROM customers';
    db.query(sql, (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(results);
    });
});

// ---------- REGISTER (with role) ----------
app.post('/api/register', async (req, res) => {
    const { full_name, email, phone, address, password, role } = req.body;

    if (!full_name || !email || !phone || !address || !password) {
        return res.status(400).json({ error: 'All fields are required' });
    }

    // Determine which table based on role
    const table = role === 'driver' ? 'drivers' : 'customers';

    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        console.log(`🔐 Registering ${role || 'customer'}:`, email);

        const sql = `INSERT INTO ${table} (full_name, email, phone, address, password) VALUES (?, ?, ?, ?, ?)`;
        db.query(sql, [full_name, email, phone, address, hashedPassword], (err, result) => {
            if (err) {
                if (err.code === 'ER_DUP_ENTRY') {
                    return res.status(400).json({ error: 'Email already registered' });
                }
                return res.status(500).json({ error: err.message });
            }
            res.json({
                message: `${role === 'driver' ? 'Driver' : 'Customer'} registered successfully!`,
                id: result.insertId,
                full_name: full_name,
                role: role || 'customer'
            });
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// ---------- LOGIN (with role) ----------
app.post('/api/login', (req, res) => {
    const { email, password, role } = req.body;

    if (!email || !password) {
        return res.status(400).json({ error: 'Email and password are required' });
    }

    const table = role === 'driver' ? 'drivers' : 'customers';
    const idField = role === 'driver' ? 'driver_id' : 'customer_id';

    const sql = `SELECT * FROM ${table} WHERE email = ?`;
    db.query(sql, [email], async (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        if (results.length === 0) {
            return res.status(401).json({ error: 'Invalid email or password' });
        }

        const user = results[0];

        if (user.password && user.password.startsWith('$2')) {
            const match = await bcrypt.compare(password, user.password);
            if (!match) {
                return res.status(401).json({ error: 'Invalid email or password' });
            }
            console.log(` ${role} verified:`, email);
        }

        res.json({
            message: 'Login successful!',
            role: role || 'customer',
            user: {
                id: user[idField],
                full_name: user.full_name,
                email: user.email,
                phone: user.phone,
                address: user.address,
                vehicle: user.vehicle_details || null
            }
        });
    });
});

// ---------- Get Deliveries for a Customer ----------
app.get('/api/customers/:customerId/deliveries', (req, res) => {
    const { customerId } = req.params;
    const sql = 'SELECT * FROM deliveries WHERE customer_id = ? ORDER BY created_at DESC';
    db.query(sql, [customerId], (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(results);
    });
});

// ---------- Get Deliveries for a Driver ----------
app.get('/api/drivers/:driverId/deliveries', (req, res) => {
    const { driverId } = req.params;
    const sql = 'SELECT * FROM deliveries WHERE driver_id = ? ORDER BY created_at DESC';
    db.query(sql, [driverId], (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(results);
    });
});

// ---------- UPDATE Delivery Status ----------
app.put('/api/deliveries/:tracking/status', (req, res) => {
    const { tracking } = req.params;
    const { status } = req.body;

    if (!status) return res.status(400).json({ error: 'Status is required' });

    const sql = 'UPDATE deliveries SET status = ? WHERE tracking_number = ?';
    db.query(sql, [status, tracking], (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        if (result.affectedRows === 0) return res.status(404).json({ error: 'Delivery not found' });
        console.log(` ${tracking} → ${status}`);
        res.json({ message: 'Updated!', tracking, new_status: status });
    });
});

// ---------- Start Server ----------
const PORT = process.env.PORT || 3000;
app.listen(PORT, '0.0.0.0', () => {
    console.log(` Server: http://localhost:${PORT}`);
});