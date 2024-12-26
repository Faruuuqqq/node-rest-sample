const express = require('express');
const router = express.Router();
const db = require('../db');

// Get all lecturers
router.get('/', (req, res) => {
    db.query('SELECT * FROM lecturers', (err, results) => {
        if (err) {
            console.error('Error fetching lecturers:', err.message);
            res.status(500).json({ error: 'Failed to fetch lecturers.' });
        } else {
            res.json(results);
        }
    });
});

// Add a new lecturer
router.post('/', (req, res) => {
    const { name, department } = req.body;

    if (!name || !department) {
        return res.status(400).json({ error: 'Name and department are required.' });
    }

    db.query('INSERT INTO lecturers (name, department) VALUES (?, ?)', [name, department], (err, results) => {
        if (err) {
            console.error('Error adding lecturer:', err.message);
            res.status(500).json({ error: 'Failed to add lecturer.' });
        } else {
            res.json({ message: 'Lecturer added successfully.', id: results.insertId });
        }
    });
});

// Delete a lecturer by ID
router.delete('/:id', (req, res) => {
    const { id } = req.params;

    db.query('DELETE FROM lecturers WHERE id = ?', [id], (err) => {
        if (err) {
            console.error('Error deleting lecturer:', err.message);
            res.status(500).json({ error: 'Failed to delete lecturer.' });
        } else {
            res.json({ message: 'Lecturer deleted successfully.' });
        }
    });
});

module.exports = router;
