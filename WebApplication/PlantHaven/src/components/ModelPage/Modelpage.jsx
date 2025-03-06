import { useState } from "react";
import {
  Container,
  Card,
  CardContent,
  Typography,
  Button,
  TextField,
  Box,
  CircularProgress,
} from "@mui/material";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";

const ImageChatbot = () => {
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [response, setResponse] = useState("");
  const [loading, setLoading] = useState(false);

  const handleImageUpload = async (event) => {
    const file = event.target.files[0];
    if (file) {
      setImage(file);
      setPreview(URL.createObjectURL(file));
      setResponse("");
    }
  };

  const handleSubmit = async () => {
    if (!image) {
      alert("Please upload an image first.");
      return;
    }
  
    setLoading(true);
    const formData = new FormData();
    formData.append("image", image);
  
    try {
      const res = await fetch("http://localhost:5000/predict", {
        method: "POST",
        body: formData,
      });
  
      const data = await res.json();
      console.log("Received data:", data); // Debugging
  
      if (Array.isArray(data.prediction) && data.prediction.length > 1) {
        const label = data.prediction[0].label || "Unknown";
        const confidence = data.prediction[1] || "Confidence unavailable";
        setResponse(`${label}, ${confidence}`);
      } else {
        setResponse("Invalid response format.");
      }
    } catch (error) {
      console.error("Error:", error);
      setResponse("Error processing the image.");
    }
  
    setLoading(false);
  };
  
  
  
  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      <Container maxWidth="sm" sx={{ mt: 10, mb: 10 }}>
        <Card sx={{ p: 3, textAlign: "center" }}>
          <CardContent>
            <Typography variant="h5" gutterBottom>
              Upload Image & Get AI Response
            </Typography>

            <input
              accept="image/*"
              type="file"
              id="upload-button"
              style={{ display: "none" }}
              onChange={handleImageUpload}
            />
            <label htmlFor="upload-button">
              <Button
                variant="contained"
                component="span"
                startIcon={<CloudUploadIcon />}
                sx={{ mb: 2 }}
              >
                Upload Image
              </Button>
            </label>

            {preview && (
              <Box sx={{ mt: 2 }}>
                <img src={preview} alt="Uploaded" width="100%" style={{ borderRadius: 8 }} />
              </Box>
            )}

            <Button
              variant="contained"
              color="primary"
              onClick={handleSubmit}
              sx={{ mt: 2 }}
              disabled={loading}
            >
              {loading ? <CircularProgress size={24} color="inherit" /> : "Get Prediction"}
            </Button>

            <TextField
              fullWidth
              multiline
              rows={3}
              variant="outlined"
              margin="normal"
              value={response}
              placeholder="AI response will appear here..."
              disabled
            />
          </CardContent>
        </Card>
      </Container>
    </div>
  );
};

export default ImageChatbot;
