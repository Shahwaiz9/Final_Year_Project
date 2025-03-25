import fs from "fs";
import express from "express";
import { Client } from "@gradio/client";
import multer from "multer";
const router = express.Router();
const upload = multer({ dest: "uploads/" });
import axios from "axios";
import dotenv from "dotenv";
dotenv.config();

// Load environment variables
const GROQ_API_KEY = process.env.GROQ_API_KEY;

// AI Prediction Endpoint
router.post("/", upload.single("image"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No image uploaded" });
    }

    // Read the uploaded image and convert to Blob
    const imageBuffer = fs.readFileSync(req.file.path);
    const imageBlob = new Blob([imageBuffer]);

    // Connect to Hugging Face API (Replace with your Gradio Space)
    const client = await Client.connect("WhiteFrost99/Resnet-AI-PlantHaven");
    const result = await client.predict("/predict", {
      image: imageBlob,
    });

    // Delete temporary file
    fs.unlinkSync(req.file.path);

    // Send response to frontend
    res.json({ prediction: result.data });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Groq API Config

const GROQ_URL = "https://api.groq.com/openai/v1/chat/completions";

// Remedies Route
router.post("/remedies", async (req, res) => {
  const { disease } = req.body;

  // Construct Prompt
  const prompt = `
    Provide a structured and well-formatted response for the following plant disease:

**Disease:** ${disease}  

## Cause(s):
List all possible causes of this disease in bullet points. Example:
- Cause 1  
- Cause 2  
- Cause 3  

## Remedies & Treatments:
### Chemical Treatments:
List chemical treatments along with their formulas. Example:
- **Chemical Name** (Formula)  
- **Another Chemical** (Formula)  

### Organic Remedies:
List organic remedies if applicable. Example:
- **Neem oil**  
- **Baking soda solution**  
- **Compost tea**  

### Recommended Pesticides & Fertilizers (Available in Pakistan):
Provide specific pesticides and fertilizers used to treat this disease. Example:
- **Pesticides:** Name 1, Name 2, Name 3  
- **Fertilizers:** Name 1, Name 2  

## Ideal Growing Conditions to Prevent ${disease}:
### Water:
- Provide watering recommendations (e.g., drip irrigation, avoid overhead watering).  
- Mention the best watering time (e.g., morning or evening).  
- Explain overwatering and underwatering risks.  

### Soil:
- Mention the best soil type (e.g., sandy loam, well-draining).  
- Provide ideal pH levels (e.g., 6.0 - 6.8).  
- Give soil preparation tips (e.g., adding organic matter, avoiding contaminated soil).  

### Temperature:
- Specify the ideal temperature range (e.g., 18°C - 24°C).  
- Mention the effects of extreme temperatures.  

### Humidity:
- Provide the optimal humidity range (e.g., 40% - 60%).  
- Explain how high or low humidity affects the disease.  

### Sunlight:
- Recommend the required sunlight exposure (e.g., full sun, partial shade).  
- Mention the number of sunlight hours needed per day.  

Ensure the response follows this structured format with clear sections and bullet points and Bold the tex in double sterics ** .

    `;

  try {
    // Make API Request
    const response = await axios.post(
      GROQ_URL,
      {
        model: "llama-3.3-70b-versatile",
        messages: [{ role: "user", content: prompt }],
      },
      {
        headers: {
          Authorization: `Bearer ${GROQ_API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    const result = response.data.choices[0].message.content;
    res.json({ remedies: result });
  } catch (error) {
    console.error(
      "Error fetching remedies:",
      error.response ? error.response.data : error.message
    );
    res.status(500).json({ error: "Failed to get remedies from Groq API" });
  }
});

export default router;
