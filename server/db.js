const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.resolve(__dirname, 'healthconnect.db');
const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.error('Error opening database', err.message);
    } else {
        console.log('Connected to the SQLite database.');
        // Create Complaints table
        db.run(`CREATE TABLE IF NOT EXISTS complaints (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            category TEXT,
            description TEXT,
            location TEXT,
            priority TEXT,
            status TEXT DEFAULT 'Pending',
            imagePath TEXT,
            audioPath TEXT,
            createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
        )`);

        // Backfill schema for existing DBs
        db.run(`ALTER TABLE complaints ADD COLUMN audioPath TEXT`, () => {});

    }
});

module.exports = db;
