# ResuMatch 📄

ResuMatch is an AI-powered resume analysis tool that helps users evaluate their resumes against job descriptions. Using GPT-4, it provides detailed analysis, job matching, and improvement suggestions.

## Features 🌟

- Resume analysis with GPT-4
- Job description matching
- Detailed strengths and skills assessment
- Formatting and content improvement suggestions
- Resume rating system
- Real time analysis feedback

## Tech Stack 💻

### Frontend
- React.js
- Material-UI
- Axios

### Backend
- Node.js
- Express.js
- OpenAI API
- PDF.js

## Getting Started 🚀

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn
- OpenAI API key

### Installation

1. Clone the repository
   ```bash
   git clone https://github.com/yourusername/resumatch.git
   cd resumatch
   ```

2. Install Backend Dependencies
   ```bash
   cd backend
   npm install
   ```

3. Configure Environment Variables
   Create a `.env` file in the backend directory:
   ```
   PORT=3001
   OPENAI_API_KEY=your_api_key_here
   ```

4. Install Frontend Dependencies
   ```bash
   cd ../frontend
   npm install
   ```

5. Start the Application
   ```bash
   # Start Backend (from backend directory)
   npm start

   # Start Frontend (from frontend directory)
   npm start
   ```

The application will be available at `http://localhost:3000`

## Usage 

1. Upload your resume (PDF format)
2. (Optional) Paste the job description you want to match against
3. Click "Analyze Resume"
4. Review the detailed analysis and suggestions


## License 

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments 

- OpenAI for providing the GPT-4 API
- PDF.js for PDF parsing capabilities
- Material UI for the component library