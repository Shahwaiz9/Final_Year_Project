import fs from "fs";
import express from "express";
import { Client } from "@gradio/client";
import multer from "multer";
import axios from "axios";
import dotenv from "dotenv";
import path from "path";
import product from "../models/product.js";

dotenv.config();

const router = express.Router();
const upload = multer({ dest: "uploads/" });

const GROQ_API_KEY = process.env.GROQ_API_KEY;
const GROQ_URL = "https://api.groq.com/openai/v1/chat/completions";

router.post("/", upload.single("image"), async (req, res) => {
  try {
    let imageBlob;

    if (req.file) {
      const imageBuffer = fs.readFileSync(req.file.path);
      imageBlob = new Blob([imageBuffer]);
      fs.unlinkSync(req.file.path);
    } else if (req.body.imageBase64) {
      const base64Data = req.body.imageBase64.replace(/^data:image\/\w+;base64,/, "");
      const buffer = Buffer.from(base64Data, "base64");
      imageBlob = new Blob([buffer]);
    } else {
      return res.status(400).json({ error: "No image provided" });
    }

    const client = await Client.connect("WhiteFrost99/EfficeintNet");
    const result = await client.predict("/predict", {
      image: imageBlob,
    });

    res.json({ prediction: result.data });
  } catch (error) {
    console.error("Prediction Error:", error);
    res.status(500).json({ error: "Failed to get prediction." });
  }
});

router.post("/remedies", async (req, res) => {
  const { disease } = req.body;

  const prompt = `
Provide a structured and well-formatted response for the following plant disease:

**Disease:** ${disease}

## Cause(s):
- List possible causes.

## Remedies & Treatments:
### Chemical Treatments:
- Chemical Name (Formula)

### Organic Remedies:
- Neem oil
- Compost tea

### Recommended Pesticides & Fertilizers (Available in Pakistan):
- Pesticides: Name1, Name2
- Fertilizers: Name1, Name2

## Ideal Growing Conditions:
- Watering: Best practices
- Soil: Type and pH
- Temperature: Ideal range
- Humidity: Optimal range
- Sunlight: Hours required
`;

  try {
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
    console.error("Remedies Error:", error.response?.data || error.message);
    res.status(500).json({ error: "Failed to get remedies." });
  }
});

router.post("/products", async (req, res) => {
  try {
    const { disease } = req.body;

    const diseaseNameOnly = disease.split(" (")[0].replace(/_/g, " ");
    const words = diseaseNameOnly.split(" ");
    const cleanedDisease = words.slice(1).join(" ");  // removes crop name

    const finalRegex = new RegExp(cleanedDisease, "i");

    console.log("Searching for products for:", cleanedDisease);

    const products = await product.find({
      isFeatured: true,
      $or: [
        { description: finalRegex },
        { keywords: finalRegex },
      ],
    }).limit(4);

    res.json({ products });
  } catch (error) {
    console.error("Product Fetch Error:", error);
    res.status(500).json({ error: "Failed to fetch products." });
  }
});




export default router;