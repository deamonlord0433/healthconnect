const express = require('express');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const db = require('./db');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Multer setup for uploads (images + audio)
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        // Preserve extension when possible, otherwise fallback
        const ext = path.extname(file.originalname) || '';
        cb(null, Date.now() + ext);
    }
});

const upload = multer({ storage: storage });


// Fake AI categorizer for complaints based on keywords in description (as requested)
const categorizeIssue = (description) => {
    if (!description) return 'General Sanitation';
    const desc = description.toLowerCase();
    if (desc.includes('garbage') || desc.includes('trash') || desc.includes('waste')) return 'Garbage Issue';
    if (desc.includes('water') || desc.includes('drain') || desc.includes('leak')) return 'Water/Drainage Issue';
    if (desc.includes('mosquito') || desc.includes('bug') || desc.includes('dengue')) return 'Mosquito Risk';
    return 'General Sanitation';
};

// API Endpoints

// 1. Submit a complaint (image + optional audio)
app.post('/api/complaints', upload.fields([{ name: 'image', maxCount: 1 }, { name: 'audio', maxCount: 1 }]), (req, res) => {
    const { description, location, priority } = req.body;
    const imageFile = req.files && req.files.image ? req.files.image[0] : null;
    const audioFile = req.files && req.files.audio ? req.files.audio[0] : null;

    const imagePath = imageFile ? `/uploads/${imageFile.filename}` : null;
    const audioPath = audioFile ? `/uploads/${audioFile.filename}` : null;

    const category = categorizeIssue(description);

    const sql = `INSERT INTO complaints (category, description, location, priority, imagePath, audioPath) VALUES (?, ?, ?, ?, ?, ?)`;
    const params = [category, description, location, priority || 'Normal', imagePath, audioPath];

    db.run(sql, params, function(err) {
        if (err) {
            res.status(400).json({ error: err.message });
            return;
        }
        res.json({
            message: 'Complaint submitted successfully',
            complaintId: this.lastID,
            category: category
        });
    });
});

// 2. Get all complaints (for Admin Dashboard)
app.get('/api/complaints', (req, res) => {
    const sql = `SELECT * FROM complaints ORDER BY createdAt DESC`;
    db.all(sql, [], (err, rows) => {
        if (err) {
            res.status(400).json({ error: err.message });
            return;
        }
        res.json({
            data: rows
        });
    });
});

// 3. Update complaint status
app.patch('/api/complaints/:id/status', (req, res) => {
    const { status } = req.body;
    const { id } = req.params;
    const sql = `UPDATE complaints SET status = ? WHERE id = ?`;
    db.run(sql, [status, id], function(err) {
        if (err) {
            res.status(400).json({ error: err.message });
            return;
        }
        res.json({ message: 'Status updated', changes: this.changes });
    });
});

// 4. Awareness API (mock data)
app.get('/api/awareness', (req, res) => {
    const awarenessData = [
        { 
            id: 1, 
            title: 'Clean Water & Sanitation', 
            description: 'Safe water and sanitation are fundamental human rights. Learn how to purify water and maintain sanitation at home.',
            type: 'Video', 
            url: 'https://www.youtube.com/embed/TDBCq96R9Pc',
            duration: '4:10',
            content: [
                { heading: 'Why Clean Water Matters', text: 'Contaminated water causes diseases like cholera, typhoid, and diarrhea. Always use safe drinking water sources.' },
                { heading: 'Boiling Water', text: 'Boil water for at least 1 minute to kill bacteria, viruses and parasites. Let it cool in a covered container.' },
                { heading: 'Chlorination', text: 'Add 2 drops of household bleach (5% chlorine) per litre of water and wait 30 minutes before drinking.' },
                { heading: 'Safe Storage', text: 'Store purified water in a clean, covered container. Avoid dipping hands or cups directly into storage vessels.' },
                { heading: 'Sanitation Practices', text: 'Use and maintain proper toilets. Never defecate in the open. Dispose of waste far from water sources.' },
                { heading: 'Community Action', text: 'Report blocked drains or broken pipelines immediately to local health authorities.' }
            ]
        },
        { 
            id: 2, 
            title: 'Preventing Mosquito Breeding', 
            description: 'Mosquitoes breed in stagnant water. Identifying and eliminating breeding spots protects your community from malaria and dengue.',
            type: 'Video', 
            url: 'https://www.youtube.com/embed/qED2vJwcJCk',
            duration: '2:45',
            content: [
                { heading: 'Eliminate Standing Water', text: 'Empty, clean or cover containers like buckets, flowerpots, old tires and bottles that collect rainwater every week.' },
                { heading: 'Drain Stagnant Areas', text: 'Fill low-lying areas in your yard and clear blocked gutters and drains regularly.' },
                { heading: 'Use Mosquito Nets', text: 'Sleep under insecticide-treated mosquito nets (ITNs) especially for children and pregnant women.' },
                { heading: 'Apply Repellents', text: 'Use EPA-registered insect repellents containing DEET, picaridin or oil of lemon eucalyptus on exposed skin.' },
                { heading: 'Window & Door Screens', text: 'Install and maintain screens on windows and doors to prevent mosquitoes from entering your home.' },
                { heading: 'Recognise Symptoms', text: 'Watch for fever, chills and body aches. Seek medical attention immediately if symptoms of dengue or malaria appear.' }
            ]
        },
        { 
            id: 3, 
            title: 'Hand Hygiene for Kids', 
            description: 'Teaching children to wash hands properly prevents 80% of common infectious diseases. Make handwashing fun and habitual.',
            type: 'Video',
            url: 'https://www.youtube.com/embed/eNmte6Xe3R4',
            duration: '2:20',
            content: [
                { heading: 'When to Wash Hands', text: 'Before eating, after using the toilet, after playing outside, after touching animals and after coughing or sneezing.' },
                { heading: 'The 6-Step Method', text: 'Wet hands → Apply soap → Lather back, between fingers, under nails → Scrub for 20 seconds → Rinse well → Dry with clean towel.' },
                { heading: 'Use Soap Always', text: 'Water alone is not enough. Soap lifts germs off the skin surface and washing rinses them away.' },
                { heading: 'Teach the 20-Second Rule', text: 'Sing "Happy Birthday" twice or count to 20 while scrubbing. This ensures germs are effectively removed.' },
                { heading: 'Hand Sanitiser on the Go', text: 'When soap and water are unavailable, use an alcohol-based hand sanitiser with at least 60% alcohol.' },
                { heading: 'Make it a Habit', text: 'Place colourful reminders near sinks and reward children when they practise handwashing without being reminded.' }
            ]
        }
    ];
    res.json(awarenessData);
});

// Ensure uploads folder exists
const fs = require('fs');
const dir = './uploads';
if (!fs.existsSync(dir)){
    fs.mkdirSync(dir);
}

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
