import React, { useState } from 'react';
import { 
    Button, 
    TextField, 
    Paper, 
    Box, 
    Typography,
    CircularProgress
} from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';

const UploadForm = ({ onAnalyze }) => {
    const [file, setFile] = useState(null);
    const [jobDescription, setJobDescription] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!file || !jobDescription) {
            alert('Please provide both resume and job description');
            return;
        }

        setLoading(true);
        const formData = new FormData();
        formData.append('resume', file);
        formData.append('jobDescription', jobDescription);

        try {
            await onAnalyze(formData);
        } catch (error) {
            alert(error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Paper elevation={3} sx={{ p: 3, mb: 3 }}>
            <form onSubmit={handleSubmit}>
                <Box sx={{ mb: 2 }}>
                    <input
                        accept=".pdf"
                        style={{ display: 'none' }}
                        id="resume-file"
                        type="file"
                        onChange={(e) => setFile(e.target.files[0])}
                    />
                    <label htmlFor="resume-file">
                        <Button
                            variant="contained"
                            component="span"
                            startIcon={<CloudUploadIcon />}
                            fullWidth
                        >
                            Upload Resume (PDF)
                        </Button>
                    </label>
                    {file && (
                        <Typography variant="body2" sx={{ mt: 1 }}>
                            Selected file: {file.name}
                        </Typography>
                    )}
                </Box>

                <TextField
                    multiline
                    rows={4}
                    fullWidth
                    label="Job Description"
                    value={jobDescription}
                    onChange={(e) => setJobDescription(e.target.value)}
                    sx={{ mb: 2 }}
                />

                <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    fullWidth
                    disabled={loading}
                >
                    {loading ? <CircularProgress size={24} /> : 'Analyze Resume'}
                </Button>
            </form>
        </Paper>
    );
};

export default UploadForm;