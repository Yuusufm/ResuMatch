import React from 'react';
import { 
    Paper, 
    Typography, 
    Box,
    Divider 
} from '@mui/material';

const AnalysisResults = ({ analysis }) => {
    if (!analysis) return null;

    return (
        <Paper elevation={3} sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
                Analysis Results
            </Typography>
            <Divider sx={{ mb: 2 }} />
            <Box sx={{ whiteSpace: 'pre-line' }}>
                <Typography variant="body1">
                    {analysis}
                </Typography>
            </Box>
        </Paper>
    );
};

export default AnalysisResults;