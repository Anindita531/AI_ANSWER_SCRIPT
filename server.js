// --- Polyfill for pdf-parse (Keep this at the very top) ---
const canvas = require('canvas');
global.DOMMatrix = canvas.DOMMatrix;
// ---------------------------------------------------------

require('dotenv').config();
const express = require('express');
const multer = require('multer');
const { Groq } = require('groq-sdk');
const fs = require('fs');
const path = require('path');
const pdfPoppler = require('pdf-poppler'); 
const pdfParse = require('pdf-parse'); // Model PDF রিড করার জন্য

const app = express();
const upload = multer({ dest: 'uploads/' });
const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

app.use(express.json());
app.use(express.static('public'));

// মাল্টিপল ফাইল রিসিভ করার জন্য Multer কনফিগারেশন
const multiUpload = upload.fields([
    { name: 'script', maxCount: 1 },
    { name: 'modelPdf', maxCount: 1 }
]);

app.post('/evaluate', multiUpload, async (req, res) => {
    let scriptPath = "";
    let modelPdfPath = "";
    let outputImage = "";

    try {
        const { modelAnswer, maxMarks } = req.body;
        
        // ফাইল চেক
        if (!req.files || !req.files['script']) throw new Error("Student script is required.");
        scriptPath = req.files['script'][0].path;

        // ১. Model Answer প্রসেস করা (Text অথবা PDF)
        let finalModelAnswer = modelAnswer; // শুরুতে টেক্সট বক্সের ভ্যালু নিচ্ছি
        
        if (req.files['modelPdf']) {
            console.log("📄 Extracting text from Model PDF...");
            modelPdfPath = req.files['modelPdf'][0].path;
            const dataBuffer = fs.readFileSync(modelPdfPath);
            const pdfData = await pdfParse(dataBuffer);
            finalModelAnswer = pdfData.text; // PDF থেকে টেক্সট নিয়ে ওভাররাইট করছি
        }

        // ২. Student Script প্রসেস করা (Image/PDF)
        let base64Body = "";
        let finalMime = req.files['script'][0].mimetype;

        if (finalMime === 'application/pdf') {
            console.log("📄 Converting Student PDF to Image...");
            let opts = {
                format: 'jpeg',
                out_dir: path.dirname(scriptPath),
                out_prefix: path.basename(scriptPath),
                page: 1
            };
            await pdfPoppler.convert(scriptPath, opts);
            outputImage = scriptPath + "-1.jpg";
            base64Body = fs.readFileSync(outputImage).toString('base64');
            finalMime = "image/jpeg";
        } else {
            base64Body = fs.readFileSync(scriptPath).toString('base64');
        }

        const cleanBase64 = base64Body.replace(/\s/g, "");

        // ৩. AI দিয়ে ইভ্যালুয়েশন
        const response = await groq.chat.completions.create({
            model: "meta-llama/llama-4-scout-17b-16e-instruct",
            messages: [{
                role: "user",
                content: [
                    { 
                        type: "text", 
                        text: `Grade this handwritten script. 
                        Model Answer: "${finalModelAnswer}"
                        Max Marks: ${maxMarks}
                        Return JSON format: {"marks_obtained": number, "feedback": "string", "transcription": "text"}` 
                    },
                    { type: "image_url", image_url: { url: `data:${finalMime};base64,${cleanBase64}` } }
                ]
            }],
            response_format: { type: "json_object" }
        });

        res.json(JSON.parse(response.choices[0].message.content));

    } catch (error) {
        console.error("❌ Error:", error.message);
        res.status(500).json({ error: error.message });
    } finally {
        // সব ফাইল ডিলিট করে সার্ভার পরিষ্কার রাখা
        if (scriptPath && fs.existsSync(scriptPath)) fs.unlinkSync(scriptPath);
        if (modelPdfPath && fs.existsSync(modelPdfPath)) fs.unlinkSync(modelPdfPath);
        if (outputImage && fs.existsSync(outputImage)) fs.unlinkSync(outputImage);
    }
});

app.listen(3000, () => console.log("🚀 Server Ready on http://localhost:3000"));