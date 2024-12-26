const express = require('express');
const router = express.Router();
const db = require('../db');

// Get all teachers
router.get('/', (req, res) => {
    db.query('SELECT * FROM teachers', (err, results) => {
        if (err) {
            console.error('Error fetching teachers:', err.message);
            res.status(500).json({ error: 'Failed to fetch teachers.' });
        } else {
            res.json(results);
        }
    });
});

// Add a new teacher
router.post('/', (req, res) => {
    const { name, subject } = req.body;

    if (!name || !subject) {
        return res.status(400).json({ error: 'Name and subject are required.' });
    }

    db.query('INSERT INTO teachers (name, subject) VALUES (?, ?)', [name, subject], (err, results) => {
        if (err) {
            console.error('Error adding teacher:', err.message);
            res.status(500).json({ error: 'Failed to add teacher.' });
        } else {
            res.json({ message: 'Teacher added successfully.', id: results.insertId });
        }
    });
});

// Delete a teacher by ID
router.delete('/:id', (req, res) => {
    const { id } = req.params;

    db.query('DELETE FROM teachers WHERE id = ?', [id], (err) => {
        if (err) {
            console.error('Error deleting teacher:', err.message);
            res.status(500).json({ error: 'Failed to delete teacher.' });
        } else {
            res.json({ message: 'Teacher deleted successfully.' });
        }
    });
});

module.exports = router;
