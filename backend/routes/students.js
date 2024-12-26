const express = require('express');
const router = express.Router();
const db = require('../db');

// Get all students
router.get('/', (req, res) => {
    db.query('SELECT * FROM students', (err, results) => {
        if (err) throw err;
        res.json(results);
    });
});

// Add a student
router.post('/', (req, res) => {
    const { name, age, major } = req.body;
    console.log(req.body);
    db.query('INSERT INTO students (name, age, major) VALUES (?, ?, ?)', [name, age, major], (err, results) => {
        if (err) throw err;
        res.json({ message: 'Student added.', id: results.insertId });
    });
});

// Update a student
router.put('/:id', (req, res) => {
    const { id } = req.params;
    const { name, age, major } = req.body;

    db.query(
        'UPDATE students SET name = ?, age = ?, major = ? WHERE id = ?',
        [name, age, major, id],
        (err, results) => {
            if (err) throw err;
            if (results.affectedRows === 0) {
                return res.status(404).json({ message: 'Student not found.' });
            }
            res.json({ message: 'Student updated.' });
        }
    );
});

// Delete a student
router.delete('/:id', (req, res) => {
    const { id } = req.params;
    db.query('DELETE FROM students WHERE id = ?', [id], (err) => {
        if (err) throw err;
        res.json({ message: 'Student deleted.' });
    });
});

module.exports = router;
