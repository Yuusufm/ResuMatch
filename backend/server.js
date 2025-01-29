import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import multer from 'multer';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import { analyzeResume } from './services/resumeService.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config();

const app = express();
// Using Render's PORT or fallback to 3001
const port = process.env.PORT || 3001;

app.use(cors({
    origin: [
        'https://resu-match-j7z2mdarz-yuusufs-projects-cab6110b.vercel.app',
        'http://localhost:3000'  // for local development
    ],
    methods: ['GET', 'POST'],
    credentials: true
}));
app.use(express.json());

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// Add this new root route
app.get('/', (req, res) => {
    res.json({ 
        message: 'ResuMatch API is running',
        status: 'healthy',
        endpoints: {
            analyze: '/api/analyze'
        }
    });
});

app.post('/api/analyze', upload.single('resume'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: 'No file uploaded' });
        }

        const jobDescription = req.body.jobDescription;
        
        // Debugging
        //console.log('Received job description:', jobDescription);

       
        const analysis = await analyzeResume(req.file.buffer, jobDescription);
        
        // Make sure we're sending JSON
        res.header('Content-Type', 'application/json');
        res.json(analysis);
    } catch (error) {
        console.error('Error analyzing resume:', error);
        res.status(500).json({ error: 'Error analyzing resume' });
    }
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
    console.log('Press Ctrl+C to stop the server');
});