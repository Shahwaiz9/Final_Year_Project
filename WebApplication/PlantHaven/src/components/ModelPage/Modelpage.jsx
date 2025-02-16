import { useState } from "react";
import PropTypes from "prop-types";
import {
  Container,
  Card,
  CardContent,
  Typography,
  Button,
  TextField,
  Box,
} from "@mui/material";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";

const ImageChatbot = () => {
  const [image, setImage] = useState(null);
  const [response, setResponse] = useState("");

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      setImage(URL.createObjectURL(file));
      // Simulate chatbot response (replace with API call)
      setResponse("Processing image and generating response...");
    }
  };

  return (
    <div
      style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}
    >
      <Container maxWidth="sm" sx={{ mt: 20, mb: 20 }}>
        <Card sx={{ p: 3, textAlign: "center" }}>
          <CardContent>
            <Typography variant="h5" gutterBottom>
              Upload Image & Get Chatbot Response
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
            {image && (
              <Box sx={{ mt: 2 }}>
                <img
                  src={image}
                  alt="Uploaded"
                  width="100%"
                  style={{ borderRadius: 8 }}
                />
              </Box>
            )}
            <TextField
              fullWidth
              multiline
              rows={3}
              variant="outlined"
              margin="normal"
              value={response}
              placeholder="Chatbot response will appear here..."
              disabled
            />
          </CardContent>
        </Card>
      </Container>
    </div>
  );
};
ImageChatbot.propTypes = {
  Header: PropTypes.element,
  Footer: PropTypes.element,
};

export default ImageChatbot;
