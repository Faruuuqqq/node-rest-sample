const mysql = require('mysql');

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',  // Your MySQL username
    password: '',  // Your MySQL password
    database: 'university_db',
});

db.connect((err) => {
    if (err) {
        console.error('Error connecting to database:', err.message);
        return;
    }
    console.log('Connected to MySQL database.');
});

module.exports = db;
