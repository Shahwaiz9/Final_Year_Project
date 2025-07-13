/* eslint-disable no-unused-vars */
import { useState, useRef } from "react";
import Webcam from "react-webcam";
import AIPlantImage from "../../assets/AIPlant.png";
import { useNavigate } from "react-router-dom";
import ReactMarkdown from "react-markdown";
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
import CameraAltIcon from "@mui/icons-material/CameraAlt";
import ProductCard from "../../components/ProductCard";
import "./modelstyles.css";

const ImageChatbot = () => {
  const navigate = useNavigate();
  const [image, setImage] = useState(null);
  const [base64Image, setBase64Image] = useState("");
  const [preview, setPreview] = useState(null);
  const [response, setResponse] = useState("");
  const [remediesResponse, setRemediesResponse] = useState("");
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingRemedies, setLoadingRemedies] = useState(false);
  const [flag, setFlag] = useState(true);
  const [showCamera, setShowCamera] = useState(false);
  const [diseaseDetected, setDiseaseDetected] = useState(false); // 👈 new state

  const webcamRef = useRef(null);

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      setImage(file);
      setBase64Image("");
      setPreview(URL.createObjectURL(file));
      setResponse("");
      setRemediesResponse("");
      setProducts([]);
      setDiseaseDetected(false); // reset when new image uploaded
    }
  };

  const captureFromCamera = () => {
    const imageSrc = webcamRef.current.getScreenshot();
    setBase64Image(imageSrc);
    setImage(null);
    setPreview(imageSrc);
    setShowCamera(false);
    setResponse("");
    setRemediesResponse("");
    setProducts([]);
    setDiseaseDetected(false); // reset when new capture
  };

  const handleSubmit = async () => {
    if (!image && !base64Image) {
      alert("Please upload or capture an image.");
      return;
    }

    setLoading(true);
    try {
      let res;
      if (image) {
        const formData = new FormData();
        formData.append("image", image);
        res = await fetch("http://localhost:5000/predict", {
          method: "POST",
          body: formData,
        });
      } else {
        res = await fetch("http://localhost:5000/predict", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ imageBase64: base64Image }),
        });
      }

      const data = await res.json();

      if (data.prediction.length > 0) {
        const label = data.prediction[0];
        setResponse(`${label}`);
        setDiseaseDetected(true); // set true after prediction
        await fetchProducts(label);
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

  const fetchRemedies = async (disease) => {
    if (!disease || typeof disease !== "string") {
      setRemediesResponse("Invalid disease name.");
      return;
    }
    const userToken = localStorage.getItem("authToken");
    if (!userToken) {
      setFlag(false);
      setRemediesResponse("");
      return;
    }
    setLoadingRemedies(true);
    try {
      const res = await fetch("http://localhost:5000/predict/remedies", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ disease }),
      });
      const data = await res.json();
      if (data.remedies) {
        setRemediesResponse(data.remedies);
      } else {
        setRemediesResponse("No remedies found.");
      }
    } catch (error) {
      setRemediesResponse("Error fetching remedies");
    }
    setLoadingRemedies(false);
  };

  const fetchProducts = async (disease) => {
    try {
      const res = await fetch("http://localhost:5000/predict/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ disease }),
      });
      const data = await res.json();
      if (data.products) {
        setProducts(data.products);
      } else {
        setProducts([]);
      }
    } catch (error) {
      console.error("Error fetching products:", error);
      setProducts([]);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-500 to-gray-200 py-12 px-4 sm:px-6 lg:px-8">
      <div className="overlay"></div>
      <Container
        maxWidth="sm"
        sx={{ mt: 10, mb: 10, position: "relative", zIndex: 1 }}
      >
        <Card
          className="modelcard"
          sx={{
            p: 3,
            mt: 8,
            textAlign: "center",
            backgroundColor: "rgba(255,255,255,0.2)",
            backdropFilter: "blur(10px)",
            borderRadius: "12px",
            boxShadow: "0px 4px 10px rgba(0,0,0,0.2)",
            border: "1px solid rgba(255,255,255,0.3)",
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
            <Button
              variant="outlined"
              startIcon={<CameraAltIcon />}
              onClick={() => setShowCamera(!showCamera)}
              sx={{
                mt: 2,
                backgroundColor: "#26A66b",
                color: "white",
                borderColor: "#26A66b",
              }}
            >
              {showCamera ? "Close Camera" : "Open Camera"}
            </Button>
            {showCamera && (
              <Box sx={{ mt: 2 }}>
                <Webcam
                  audio={false}
                  ref={webcamRef}
                  screenshotFormat="image/jpeg"
                  videoConstraints={{ facingMode: "environment" }}
                  style={{
                    width: "100%",
                    borderRadius: "12px",
                    border: "2px solid rgba(255,255,255,0.3)",
                  }}
                />
                <Button
                  variant="contained"
                  color="success"
                  onClick={captureFromCamera}
                  sx={{ mt: 2 }}
                >
                  Capture
                </Button>
              </Box>
            )}
            {preview && (
              <Box sx={{ mt: 2, display: "flex", justifyContent: "center" }}>
                <img
                  src={preview}
                  alt="Preview"
                  style={{
                    width: "200px",
                    height: "200px",
                    borderRadius: "12px",
                    border: "2px solid rgba(255,255,255,0.3)",
                  }}
                />
              </Box>
            )}
            <Button
              variant="contained"
              color="primary"
              onClick={handleSubmit}
              sx={{ mt: 2, backgroundColor: "#26A66b" }}
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
          </CardContent>
        </Card>
      </Container>

      {diseaseDetected && flag ? (
        <div className="modelProducts">
          <Box sx={{ mt: 3 }}>
            <Typography
              variant="h6"
              sx={{
                color: "black",
                fontWeight: "bold",
                mb: 2,
                fontSize: "1.7rem",
              }}
            >
              Recommended Featured Products:
            </Typography>
            <div className="flex flex-wrap gap-6 justify-center">
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
                {products.map((product) => (
                  <ProductCard key={product._id} product={product} />
                ))}
              </div>
            </div>
          </Box>

          <Fade in={!!remediesResponse} timeout={1000}>
            <Box
              sx={{
                mt: 3,
                p: 2,
                backgroundColor: "rgba(255, 255, 255, 0.28)",
                borderRadius: "8px",
                textAlign: "left",
                width: "100%",
              }}
            >
              <Typography
                variant="h6"
                sx={{
                  color: "black",
                  fontWeight: "bold",
                  mb: 2,
                  fontSize: "1.7rem",
                }}
              >
                Remedies & Treatments:
              </Typography>
              {loadingRemedies ? (
                <CircularProgress size={24} />
              ) : (
                <ReactMarkdown>{remediesResponse}</ReactMarkdown>
              )}
            </Box>
          </Fade>
        </div>
      ) : diseaseDetected && !flag ? (
        <Box sx={{ mt: 2, mb: 4, textAlign: "center" }}>
          <Button
            variant="contained"
            color="error"
            onClick={() => navigate("/login")}
            sx={{ fontWeight: "bold" }}
          >
            Log In to view remedies
          </Button>
        </Box>
      ) : null}
    </div>
  );
};

export default ImageChatbot;
