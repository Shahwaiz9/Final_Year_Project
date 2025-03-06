import fs from "fs";
import express from "express";
import { Client } from "@gradio/client";
import multer from "multer";
const router = express.Router();
const upload = multer({ dest: "uploads/" });


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
  export default router;