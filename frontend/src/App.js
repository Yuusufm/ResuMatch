import React, { useState } from 'react';
import './styles/App.css';

function App() {
    // State for handling file uploads and analysis
    const [file, setFile] = useState(null);
    const [jobDescription, setJobDescription] = useState('');
    const [analysis, setAnalysis] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [showAbout, setShowAbout] = useState(false);

    // TODO: Add support for doc and docx files later
    const handleFileChange = (event) => {
        setFile(event.target.files[0]);
        setError(null);
    };

    // Main function to handle resume analysis
    // Need to add error handling for large files
    const handleSubmit = async () => {
        if (!file) {
            setError('Please select a file first');
            return;
        }

        setLoading(true);
        setError(null);

        const formData = new FormData();
        formData.append('resume', file);
        
        // Only append job description if it's not empty
        if (jobDescription.trim()) {
            formData.append('jobDescription', jobDescription.trim());
        }

        // Debug logging
        console.log('Sending job description:', jobDescription);
        
        try {
            // might need to update this URL for production
            const response = await fetch('http://localhost:3001/api/analyze', {
                method: 'POST',
                body: formData,
            });

            const data = await response.json();
            
            if (!response.ok) {
                throw new Error(data.error || 'Analysis failed');
            }

            // Debug logging
            console.log('Received analysis:', data.analysis);
            
            setAnalysis(data.analysis);
        } catch (err) {
            console.error('Analysis error:', err);
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    // About page component - maybe move this to a separate file later?
    const AboutPage = () => (
        <div className="about-content">
            <h2>About ResuMatch</h2>
            <p>
                ResuMatch is an intelligent resume analysis platform that uses advanced AI to match 
                your resume with career opportunities. Our system:
            </p>
            <ul>
                <li>Provides comprehensive resume analysis</li>
                <li>Calculates job match percentages</li>
                <li>Identifies your strongest career paths</li>
                <li>Offers tailored improvement suggestions</li>
                <li>Helps optimize your resume for ATS systems</li>
            </ul>
            <p>
                Simply upload your resume and optionally include a job description to receive 
                detailed insights and matching scores.
            </p>
            <button className="about-close" onClick={() => setShowAbout(false)}>
                Close
            </button>
        </div>
    );

    // Helper function to format the analysis text
    const formatAnalysis = (text) => {
        // Split into sections while preserving numbering
        const sections = text.split(/(?=\d\.\s+(?:TOP ROLES|DETAILED ANALYSIS|IMPROVEMENT SUGGESTIONS|RESUME RATING|JOB MATCH ANALYSIS):)/i);
        return sections.filter(section => section.trim());
    };

    // fix mobile responsiveness issues here
    return (
        <div className="container">
            <nav className="navbar">
                <div className="logo">
                    <h1>Resu<span className="highlight">Match</span></h1>
                    <p className="tagline">AI-Powered Resume Analysis</p>
                </div>
                <button className="about-button" onClick={() => setShowAbout(true)}>
                    About
                </button>
            </nav>

            {showAbout ? (
                <AboutPage />
            ) : (
                <>
                    <div className="upload-section">
                        <h2>Match Your Resume</h2>
                        <input
                            type="file"
                            accept=".pdf"
                            onChange={handleFileChange}
                            style={{ display: 'none' }}
                            id="file-input"
                        />
                        <label htmlFor="file-input" className="upload-button">
                            {file ? file.name : 'Choose PDF'}
                        </label>
                        
                        {/* maybe add a character count here? */}
                        <textarea
                            className="job-description"
                            placeholder="Paste job description here (optional) - Get a detailed match analysis"
                            value={jobDescription}
                            onChange={(e) => setJobDescription(e.target.value)}
                        />
                        
                        {file && (
                            <button 
                                className="upload-button analyze-button" 
                                onClick={handleSubmit}
                            >
                                Analyze & Match
                            </button>
                        )}
                    </div>

                    {error && <div className="error">{error}</div>}
                    
                    {loading && (
                        <div className="loading">
                            <div className="loading-spinner"></div>
                            Analyzing your resume...
                        </div>
                    )}
                    
                    {analysis && (
                        <div className="results">
                            {formatAnalysis(analysis).map((section, index) => {
                                const [title, ...content] = section.split('\n');
                                return (
                                    <div key={index} className="analysis-section">
                                        <h3 className="section-title">{title.trim()}</h3>
                                        <div className="section-content">
                                            {content.join('\n')}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </>
            )}
        </div>
    );
}

// remember to add dark mode toggle
export default App;