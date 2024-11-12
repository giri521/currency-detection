let video;
let model;
let isModelLoaded = false;

// Initialize the video and the model
async function setup() {
    video = document.getElementById('video');
    const stream = await navigator.mediaDevices.getUserMedia({
        video: true
    });
    video.srcObject = stream;

    // Load the model
    model = await tf.loadGraphModel('https://your-username.github.io/currency-detection/model/model.json');
    isModelLoaded = true;
    console.log("Model loaded successfully!");
    detectCurrency();
}

// Start detecting currency notes from the live video
async function detectCurrency() {
    if (isModelLoaded) {
        const predictions = await model.predict(tf.browser.fromPixels(video));

        // Get the prediction with the highest confidence
        const topPrediction = predictions.arraySync()[0];

        // Display the detected currency name
        const currencyName = topPrediction.label;
        document.getElementById('currency-name').innerText = currencyName;

        // Request the next frame
        requestAnimationFrame(detectCurrency);
    } else {
        console.log("Model is still loading...");
    }
}

// Run the setup function when the page loads
window.onload = setup;
