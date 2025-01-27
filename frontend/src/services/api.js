import axios from 'axios';

const API_URL = 'http://localhost:3001/api';  // Update this to match your new port 

const api = {
    analyzeResume: async (formData) => {
        try {
            const response = await axios.post(`${API_URL}/analyze`, formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            return response.data;
        } catch (error) {
            throw error.response?.data || error.message;
        }
    }
};

export default api; 