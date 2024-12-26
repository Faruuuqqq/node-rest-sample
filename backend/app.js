const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

// Import routes
const studentRoutes = require('./routes/students');
const lecturerRoutes = require('./routes/lecturers');
const teacherRoutes = require('./routes/teachers');

const app = express();
const port = 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Routes
app.use('/api/students', studentRoutes);
app.use('/api/lecturers', lecturerRoutes);
app.use('/api/teachers', teacherRoutes);

// Start server
app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});
