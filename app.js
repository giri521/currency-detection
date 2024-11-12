let video;
let model;
let isModelLoaded = false;

// Function to initialize the video and load the model
async function setup() {
    // Access the webcam
    video = document.getElementById('video');
    const stream = await navigator.mediaDevices.getUserMedia({
        video: true
    });
    video.srcObject = stream;

    // Load the Teachable Machine model
    model = await tf.loadGraphModel('https://your-username.github.io/currency-detection/model/model.json');
    isModelLoaded = true;
    console.log("Model loaded successfully!");
    
    // Start detecting
    detectCurrency();
}

// Function to detect currency notes from the live video feed
async function detectCurrency() {
    if (isModelLoaded) {
        // Pre-process the video frame for prediction
        const predictions = await model.predict(tf.browser.fromPixels(video));

        // Get the prediction with the highest confidence
        const topPrediction = predictions.arraySync()[0];
        
        // Display the predicted currency
        const currencyName = topPrediction.label || "Unknown";
        document.getElementById('currency-name').innerText = currencyName;

        // Keep calling detectCurrency to update predictions
        requestAnimationFrame(detectCurrency);
    } else {
        console.log("Model is still loading...");
    }
}

// Call setup when the page loads
window.onload = setup;
