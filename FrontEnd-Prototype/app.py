import streamlit as st
import numpy as np
import cv2
from tensorflow.keras.applications.resnet50 import preprocess_input
from rembg import remove
from skimage.measure import label, regionprops
from tensorflow.keras.models import load_model
from PIL import Image
import io

# Load the trained model
model = load_model("newresnet.keras")

# Class names for prediction
class_names = [
    "Bacterial Spot",
    "Early Blight",
    "Late Blight",
    "Leaf Mold",
    "Septoria Leaf Spot",
    "Spider Mites",
    "Target Spot",
    "Tomato Yellow Leaf Curl Virus",
    "Tomato Mosaic Virus",
    "Healthy"
]

# Preprocess the image to remove background, crop the leaf, and resize it
def preprocess_image(image):
    # Convert the image to RGB (from BGR if using OpenCV)
    image = np.array(image)
    image_rgb = cv2.cvtColor(image, cv2.COLOR_BGR2RGB)

    # Remove the background using rembg
    image_no_bg = remove(image_rgb)

    # Convert to grayscale and threshold to isolate objects
    gray = cv2.cvtColor(image_no_bg, cv2.COLOR_BGR2GRAY)
    _, binary = cv2.threshold(gray, 20, 255, cv2.THRESH_BINARY)

    # Label connected regions in the binary image
    labeled_image = label(binary)
    regions = regionprops(labeled_image)

    # Find the largest region (assumes it's the leaf)
    largest_region = max(regions, key=lambda x: x.area, default=None)

    if largest_region:
        # Crop to the largest region (leaf)
        min_row, min_col, max_row, max_col = largest_region.bbox
        image_cropped = image_rgb[min_row:max_row, min_col:max_col]
    else:
        raise ValueError("No leaf detected in the image!")

    # Resize the cropped image to match the input shape of the model (224x224 for ResNet50)
    image_resized = cv2.resize(image_cropped, (224, 224))

    # Preprocess for ResNet50
    image_preprocessed = preprocess_input(image_resized)
    image_preprocessed = np.expand_dims(image_preprocessed, axis=0)

    return image_preprocessed, image_resized

# Function to predict disease
def predict_disease(image):
    try:
        print("in predict")
        # Preprocess the image
        preprocessed_image, display_image = preprocess_image(image)

        # Make a prediction using the model
        predictions = model.predict(preprocessed_image)
        predicted_class = np.argmax(predictions, axis=1)[0]
        confidence = predictions[0][predicted_class]

        # Display the processed image and the prediction result
        st.image(display_image, caption="Processed Image", use_column_width=True)
        st.success(f"Predicted Disease: **{class_names[predicted_class]}** with confidence {confidence*100:.2f}%")
        
        return class_names[predicted_class], confidence

    except ValueError as e:
        st.error(f"Error: {e}")
        return None, 0

# Streamlit UI for interaction
st.title("Tomato Disease Detection")
st.write("Upload an image of a tomato leaf to predict its disease.")

# File uploader widget (no need for additional buttons)
uploaded_file = st.file_uploader("Upload an image file", type=["jpg", "jpeg", "png"])

# Handle uploaded file
if uploaded_file is not None:
    # Read the uploaded file as a PIL image
    image = Image.open(uploaded_file)
    st.image(image, caption="Uploaded Image", use_column_width=True)

    # Predict disease
    predicted_class, confidence = predict_disease(image)

# Camera input widget (for capturing images)
st.write("Or capture an image using your camera:")
camera_image = st.camera_input("Capture Image from Camera")


# Handle camera input
if camera_image is not None:
    # Read the camera image as a PIL image
    image = Image.open(io.BytesIO(camera_image.read()))
    st.image(image, caption="Captured Image", use_column_width=True)

    # Predict disease
    predicted_class, confidence = predict_disease(image)