const express = require('express');
const router = express.Router();
const db = require('../db');
const { isArray } = require('lodash');

router.get('/', (req, res) => {
    db.query('SELECT * FROM schedules', (err, results) => {
        if (err) {
            console.log('Error fethcing schedules:', err.message);
            res.status(500).json({ error: 'Failed to fetch schedules.' });
        } else {
            res.json(results);
        }
    });
});

/*
router.get('/:id', (req, res) => {
    db.query('SELECT')
})
router.post('/', (req, res) => {
    const schedules = req.body;

    if (!Array.isArray(schedules)){
        return res.status(400).json({ error: 'Invalid input: expected an array of schedules'});
    }

    schedules.forEach(schedule => {
        db.query('INSERT INTO schedules (date, time, place, lecturer_id, teacher_id ) VALUES (?, ?, ?, ?, ?)', [schedule.date, schedule.time, schedule.place, schedule.lecturer_id, schedule.teacher_id],
            (err, results) => {
            if (err) {
                console.error('Error adding schedules:', err.message);
                res.status(500).json({ error : 'Failed to add schedules'});

            }
        });
    });
    res.json({ message : 'Lecturer added succesfully.'});
});
*/

router.post('/', (req, res) => {
    const { date, time, place, lecturer_id, teacher_id, important } = req.body;

    if (!date || !time || !place || !lecturer_id || !teacher_id) {
        return res.status(400).json({ error: 'All fields are required.' });
    }

    const lecturerQuery = 'SELECT COUNT(*) AS count FROM lecturers WHERE id = ?';    
    const teacherQuery = 'SELECT COUNT(*) AS count FROM teachers WHERE id = ?';    

    db.query(lecturerQuery, [lecturer_id], (lecturerErr, lecturerResults) => {
        if (lecturerErr) {
            console.log(lecturerErr);
            return res.status(500).json({ error: 'Error checking lecturer'});
        } 
        if (lecturerResults[0].count === 0){
            return res.status(400).json({ error: 'invalid teacher ID.'});
        }

        const insertQuery = `
                INSERT INTO schedules (date, time, place, lecturer_id, teacher_id, important)
                VALUES (?, ?, ?, ?, ?, ?)
            `;
        db.query(insertQuery, [date, time, place, lecturer_id, teacher_id, important || false], (insertErr, insertResults) => {
                if (insertErr) {
                    console.error(insertErr);
                    return res.status(500).json({ error: 'Error adding schedule.' });
                }

                res.json({ message: 'Schedule added.', id: insertResults.insertId });
            });
        });
    });

router.delete('/id', (req, res) => {
    const { id } = req.params;

    db.query('DELETE FROM schedules WHERE id = ?', [id], (err) => {
        if (err) {
            console.error('Error deleting schedules:', err.message);
            res.status(500).json({ error: 'Failed to delete schedules'});
        } else {
            res.json({ message: 'Schedules deleted successfully'});
        }
    });
});

router.put('/:id', (req, res) => {
    const { id } = req.params;
    const { date, time, place, important } = req.body;

    db.query (
        'UPDATE schedules SET date = ?, time = ?, important = ?, place = ? WHERE id = ?',
        [date, time, place, important, id], (err, results) => {
            if (err) throw err;
            if (results.affectedRows === 0) {
                return res.status(400).json({ message: 'schedules not found' });
            } else {
                res.json({ message: 'schedules updated.'});
            }
        });
});

module.exports = router;