let model;

async function loadModel() {
    // Load the model from the root directory of your GitHub Pages
    model = await tf.loadGraphModel('https://giri521.github.io/currency-detection/model.json');
    document.getElementById('status').innerText = 'Model Loaded!';
}

async function setupCamera() {
    const video = document.createElement('video');
    const stream = await navigator.mediaDevices.getUserMedia({
        video: true
    });

    video.srcObject = stream;
    video.play();

    video.onloadeddata = () => {
        const canvas = document.getElementById('canvas');
        const context = canvas.getContext('2d');
        context.drawImage(video, 0, 0, canvas.width, canvas.height);

        // Perform detection every frame
        detectCurrency(canvas);
    };
}

async function detectCurrency(canvas) {
    if (model) {
        const image = tf.browser.fromPixels(canvas);
        const prediction = await model.predict(image.expandDims(0));
        
        // Process the prediction and display the result
        const label = prediction[0].argMax(-1).dataSync()[0];
        const currency = getCurrencyName(label);
        document.getElementById('status').innerText = `Detected: ${currency}`;
    }
}

function getCurrencyName(label) {
    // You can define your labels here
    const labels = ['10', '20', '50', '100', '200', '500', '2000']; // Example labels for INR notes
    return labels[label] || 'Unknown Currency';
}

// Initialize the model and camera
loadModel();
setupCamera();
