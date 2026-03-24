const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const fs = require('fs-extra');
const path = require('path');

const app = express();
const PORT = 5000;
const DATA_DIR = path.join(__dirname, 'data');
const APPOINTMENTS_FILE = path.join(DATA_DIR, 'appointments.json');

// Ensure data directory and file exist
fs.ensureDirSync(DATA_DIR);
if (!fs.existsSync(APPOINTMENTS_FILE)) {
    fs.writeJsonSync(APPOINTMENTS_FILE, []);
}

app.use(cors());
app.use(bodyParser.json());

// Helper to read appointments
const getAppointments = async () => {
    return await fs.readJson(APPOINTMENTS_FILE);
};

// Helper to save appointments
const saveAppointments = async (appointments) => {
    await fs.writeJson(APPOINTMENTS_FILE, appointments, { spaces: 2 });
};

// --- ROUTES ---

// 1. Submit Appointment
app.post('/api/appointments', async (req, res) => {
    try {
        const { name, phone, age, treatment, date, time, message } = req.body;
        
        if (!name || !phone) {
            return res.status(400).json({ error: 'Name and phone are required.' });
        }

        const appointments = await getAppointments();
        const newBooking = {
            id: Date.now(),
            name,
            phone,
            age,
            treatment,
            date,
            time,
            message,
            timestamp: new Date().toISOString()
        };

        appointments.push(newBooking);
        await saveAppointments(appointments);

        console.log('New Appointment:', newBooking);
        res.status(201).json({ message: 'Appointment submitted successfully!', booking: newBooking });
    } catch (error) {
        console.error('Error saving appointment:', error);
        res.status(500).json({ error: 'Failed to save appointment.' });
    }
});

// 2. Admin Login (Simple Password)
app.post('/api/admin/login', (req, res) => {
    const { password } = req.body;
    if (password === 'nav1234') {
        res.json({ success: true, token: 'fake-admin-token-123' });
    } else {
        res.status(401).json({ success: false, message: 'Invalid password.' });
    }
});

// 3. Get Appointments (Protected)
app.get('/api/appointments', async (req, res) => {
    const authHeader = req.headers.authorization;
    if (authHeader !== 'Bearer fake-admin-token-123') {
        return res.status(403).json({ error: 'Unauthorized.' });
    }

    try {
        const appointments = await getAppointments();
        res.json(appointments);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch appointments.' });
    }
});

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
