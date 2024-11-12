let videoElement = document.getElementById('video');
let outputCanvas = document.getElementById('outputCanvas');
let currencyNameElement = document.getElementById('currencyName');
let outputCtx = outputCanvas.getContext('2d');

// Load the model from Teachable Machine (replace the URL with your hosted model)
let model;
async function loadModel() {
    model = await tf.loadGraphModel('https://your-model-url/model.json');  // Use the actual URL for your model
    console.log("Model loaded successfully");
}

// Start the camera and display the feed
function startCamera() {
    if (navigator.mediaDevices.getUserMedia) {
        navigator.mediaDevices.getUserMedia({ video: true })
            .then(function (stream) {
                videoElement.srcObject = stream;
            })
            .catch(function (error) {
                console.log("Error accessing webcam: ", error);
            });
    }
}

// Function to classify the frame
async function classifyFrame() {
    if (!model) return; // Wait for the model to load

    // Capture the current frame from the video
    let image = tf.browser.fromPixels(videoElement);
    
    // Resize the image to match the input size of the model (use the size from Teachable Machine)
    const resizedImage = tf.image.resizeBilinear(image, [224, 224]);  // Assuming 224x224 is the input size, modify if different
    const input = resizedImage.expandDims(0).div(tf.scalar(255));  // Normalize the image to 0-1 range and expand dims

    // Get the prediction from the model
    const prediction = await model.predict(input).data();
    
    // Assuming the output is an array of class probabilities, find the highest probability
    const maxIndex = prediction.indexOf(Math.max(...prediction));
    
    // Map the index to the corresponding currency denomination
    let detectedCurrency = "None";
    if (maxIndex === 0) {
        detectedCurrency = "₹10";
    } else if (maxIndex === 1) {
        detectedCurrency = "₹50";
    } else if (maxIndex === 2) {
        detectedCurrency = "₹100";
    } else if (maxIndex === 3) {
        detectedCurrency = "₹500";
    } else if (maxIndex === 4) {
        detectedCurrency = "₹2000";
    }

    // Update the UI with the detected currency name
    currencyNameElement.textContent = `Detected Currency: ${detectedCurrency}`;

    // Clean up memory
    image.dispose();
    resizedImage.dispose();

    // Call classifyFrame again for the next frame
    requestAnimationFrame(classifyFrame);
}

// Start the camera and load the model
loadModel().then(() => {
    startCamera();
    classifyFrame();
});
