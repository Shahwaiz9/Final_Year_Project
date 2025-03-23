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
  Fade,
} from "@mui/material";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import "./modelstyles.css"; // Import external CSS

const ImageChatbot = () => {
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [response, setResponse] = useState("");
  const [remediesResponse, setRemediesResponse] = useState("");
  const [loading, setLoading] = useState(false);
  const [loadingRemedies, setLoadingRemedies] = useState(false);
 
  const [flag, setFlag] = useState(true);

  // Handle image upload
  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      setImage(file);
      setPreview(URL.createObjectURL(file));
      setResponse("");
      setRemediesResponse(""); // Clear previous remedies response
    }
  };

  // Send image to backend for prediction
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
      console.log("Received data:", data);
  
      if (Array.isArray(data.prediction) && data.prediction.length > 1) {
        const label = data.prediction[0].label || "Unknown";
        const confidence = data.prediction[1] || "Confidence unavailable";
        
        // Update response first
        setResponse(`${label}, ${confidence}`);
  
        // Ensure we wait for remedies to be fetched
        await fetchRemedies(label);
      } else {
        setResponse("Invalid response format.");
      }
    } catch (error) {
      console.error("Error:", error);
      setResponse("Error processing the image.");
    }
  
    setLoading(false);
  };
  
  // Fetch remedies based on detected disease
  const fetchRemedies = async (disease) => {
    if (!disease || typeof disease !== "string") {
      console.error("Invalid disease name:", disease);
      setRemediesResponse("Error: Invalid disease name.");
      return;
    }
  
    const userToken = localStorage.getItem("authToken");
    if (!userToken) {
      setFlag(false);
      return;
    }
  
    setLoadingRemedies(true);
  
    try {
      console.log("Fetching remedies for:", disease);
      const res = await fetch("http://localhost:5000/predict/remedies", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ disease }),
      });
  
      const data = await res.json();
      console.log("Received remedies:", data);
  
      if (data.remedies) {
        setRemediesResponse(data.remedies);
      } else {
        setRemediesResponse("No remedies found.");
      }
    } catch (error) {
      console.error("Error:", error);
      setRemediesResponse("Error fetching remedies.");
    }
  
    setLoadingRemedies(false);
  };
  
  return (
    <div className="background">
      <div className="overlay"></div>

      <Container
        maxWidth="sm"
        sx={{ mt: 10, mb: 10, position: "relative", zIndex: 1 }}
      >
        <Card
          className="card"
          sx={{
            p: 3,
            mt: 8,
            textAlign: "center",
            backgroundColor: "rgba(255, 255, 255, 0.2)",
            backdropFilter: "blur(10px)",
            borderRadius: "12px",
            boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.2)",
            border: "1px solid rgba(255, 255, 255, 0.3)",
          }}
        >
          <CardContent>
            <Typography
              variant="h4"
              gutterBottom
              sx={{ color: "black", fontWeight: "bold" }}
            >
              Detect Disease
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
                sx={{ mr: 1, mt: 2, backgroundColor: "#26A66b" }}
              >
                Upload Image
              </Button>
            </label>

            {preview && (
              <Box sx={{ mt: 2, display: "flex", justifyContent: "center" }}>
                <img
                  src={preview}
                  alt="Uploaded"
                  style={{
                    width: "200px",
                    height: "200px",
                    objectFit: "cover",
                    borderRadius: "12px",
                    border: "2px solid rgba(255, 255, 255, 0.3)",
                  }}
                />
              </Box>
            )}

            <Button
              variant="contained"
              color="primary"
              onClick={handleSubmit}
              sx={{ ml: 1, mt: 2, backgroundColor: "#26A66b" }}
              disabled={loading}
            >
              {loading ? (
                <CircularProgress size={24} color="inherit" />
              ) : (
                "Get Prediction"
              )}
            </Button>

            <TextField
              fullWidth
              variant="outlined"
              value={response}
              sx={{
                color: "black",
                borderRadius: "50px",
                "& .MuiInputBase-input": { fontWeight: "bold" },
                height: "3em",
                mt: 2,
                textAlign: "center",
              }}
              placeholder="AI response will appear here..."
            />

            
            {/* Remedies Section - Only shows if user is logged in */}
            {flag ? (
              <Fade in={!!remediesResponse} timeout={1000}>
                <Box
                  sx={{
                    mt: 3,
                    p: 2,
                    backgroundColor: "rgba(0, 0, 0, 0.05)",
                    borderRadius: "8px",
                  }}
                >
                  <Typography
                    variant="h6"
                    sx={{ color: "black", fontWeight: "bold" }}
                  >
                    Remedies & Treatments:
                  </Typography>
                  {loadingRemedies ? (
                    <CircularProgress size={24} />
                  ) : (
                    <Typography sx={{ mt: 1, color: "black" }}>
                      {remediesResponse}
                    </Typography>
                  )}
                </Box>
              </Fade>
            ) : (
              <Typography sx={{ mt: 2, color: "red", fontWeight: "bold" }}>
                Log in to view remedies.
              </Typography>
            )}
          </CardContent>
        </Card>
      </Container>
    </div>
  );
};

export default ImageChatbot;
