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

console.log('OpenAI API Key status:', process.env.OPENAI_API_KEY ? 'Present' : 'Missing');
console.log('PORT:', process.env.PORT);

app.use(cors({
    origin: [
        'https://resu-match-181zsvgnu-yuusufs-projects-cab6110b.vercel.app',
        'https://resu-match-delta.vercel.app',
        'http://localhost:3000'  // for local development
    ],
    methods: ['GET', 'POST', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Accept'],
    credentials: true
}));
app.use(express.json());

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// Add preflight handling
app.options('*', cors());

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
        console.log('Received analysis request');
        
        if (!process.env.OPENAI_API_KEY) {
            throw new Error('OpenAI API key is not configured');
        }

        if (!req.file) {
            console.log('No file uploaded');
            return res.status(400).json({ error: 'No file uploaded' });
        }

        console.log('Processing file:', req.file.originalname);
        const jobDescription = req.body.jobDescription;
        
        console.log('Starting analysis...');
        const analysis = await analyzeResume(req.file.buffer, jobDescription);
        console.log('Analysis completed');
        
        res.header('Access-Control-Allow-Origin', '*');
        res.header('Content-Type', 'application/json');
        res.json(analysis);
    } catch (error) {
        console.error('Error analyzing resume:', error);
        res.status(500).json({ 
            error: 'Error analyzing resume: ' + error.message,
            details: process.env.NODE_ENV === 'development' ? error.stack : undefined
        });
    }
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
    console.log('Press Ctrl+C to stop the server');
});