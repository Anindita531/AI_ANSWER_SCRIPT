const fs = require('fs');

const readmeContent = `# 🤖 ScriptSense AI - Smart Grading System
**Project Name:** FoodFi AI Evaluator  
**Tech Stack:** Node.js, Express, Groq Cloud (Llama 4), Poppler, PDF-Parse

ScriptSense AI is an intelligent automated grading system designed to evaluate handwritten scripts against a provided model answer. Using advanced Vision-Language Models (VLM), it transcribes handwriting, compares it with reference material, and provides detailed feedback and scoring.

---

## ✨ Features
- **Multi-Format Support:** Accepts \`.jpg\`, \`.png\`, and \`.pdf\` files.
- **Dual Model Input:** Teachers can either type the model answer or upload a Reference PDF.
- **Handwriting OCR:** High-accuracy transcription of handwritten text using AI.
- **Automated Scoring:** Instant marks calculation based on "Max Marks" input.
- **Intelligent Feedback:** Provides constructive criticism and suggestions for improvement.
- **Modern UI:** Clean, responsive interface built with Bootstrap 5.

---

## 🚀 Installation & Setup

### 1. Prerequisites
Make sure you have [Node.js](https://nodejs.org/) (v20+) installed. 
For PDF processing, you need **Poppler** installed on your system:
- **Windows:** Download Poppler for Windows and add the \`bin\` folder to your System PATH.

### 2. Install Dependencies
\`\`\`bash
npm install express multer groq-sdk dotenv pdf-poppler pdf-parse canvas
\`\`\`

### 3. Environment Configuration
Create a \`.env\` file in the root directory:
\`\`\`env
GROQ_API_KEY=your_api_key_here
PORT=3000
\`\`\`

### 4. Run the Project
\`\`\`bash
node server.js
\`\`\`

---

## 🛠️ Project Structure
\`\`\`text
grading-system/
├── public/
│   └── index.html      # Frontend Interface
├── uploads/            # Temporary storage for files
├── server.js           # Express server & AI Logic
├── .env                # API Keys (Secret)
└── README.md           # Documentation
\`\`\`

---

## 📄 License
Distributed under the MIT License.
`;

fs.writeFileSync('README.md', readmeContent);
console.log('✅ README.md file has been created successfully!');
