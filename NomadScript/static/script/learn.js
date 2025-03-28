//Scroll on learn page that changes between two "Soyombo"
document.addEventListener("scroll", function() {
    let scrollPosition = window.scrollY;
    let threshold = 200; // Adjust when transition should happen

    if (scrollPosition > threshold) {
        document.querySelector(".right-image").classList.add("scrolled");
    } else {
        document.querySelector(".right-image").classList.remove("scrolled");
    }
});

function playAudio(letter) {
    let audio = new Audio(`/media/audio/${letter}.wav`);
    audio.play();
}

const canvas = document.getElementById("drawingCanvas");
const ctx = canvas.getContext("2d");

const scale = window.devicePixelRatio || 1; 
const width = canvas.offsetWidth;
const height = canvas.offsetHeight;

canvas.width = width * scale;
canvas.height = height * scale;
ctx.scale(scale, scale);

ctx.lineWidth = 5;
ctx.lineCap = "round";

let isDrawing = false;
let isEraser = false;

function getMousePos(e) {
    const rect = canvas.getBoundingClientRect();
    const scale = window.devicePixelRatio || 1;
    return {
        x: (e.clientX - rect.left) * (canvas.width / rect.width) / scale,
        y: (e.clientY - rect.top) * (canvas.height / rect.height) / scale
    };
}

//Draw logic
canvas.addEventListener('mousedown', (e) => {
    isDrawing = true;
    const pos = getMousePos(e);
    ctx.beginPath();
    ctx.moveTo(pos.x, pos.y);
});

canvas.addEventListener('mousemove', (e) => {
    if (!isDrawing) return;
    const pos = getMousePos(e);
    ctx.lineWidth = isEraser ? 20 : 10;
    ctx.lineCap = "round";
    ctx.strokeStyle = isEraser ? "#FFFFFF" : "#000000";
    ctx.lineTo(pos.x, pos.y);
    ctx.stroke();
});

canvas.addEventListener('mouseup', () => {
    isDrawing = false;
    ctx.closePath();
});


document.getElementById("clearCanvas").addEventListener("click", () => {
    clearCanvas();
});

document.getElementById("predictImage").addEventListener("click", () => {
    const dataUrl = canvas.toDataURL();
    const label = 'a';

    // Create new form data from user drawing
    const formData = new FormData();
    formData.append('drawing', dataUrl);
    formData.append('label', label);

    // Use POST API to send the data into middleware
    fetch('predict/', {
        method: 'POST',
        body: formData
    })
    .then(response => response.json())
    .then(data => {
        const predictedIndex = data.prediction_index;  
        console.log(predictedIndex)
        clearCanvas();
        // Check if the prediction was correct at this beta stage we are only checking if its 0 since learning page has image of letter a
        if (predictedIndex === 0) {
            // Draw green checkmark icon
            drawIcon("checkmark");
        } else {
            // Draw red X icon
            drawIcon("x");
        }

        // Set a timeout to clear the canvas after 3 seconds
        setTimeout(() => {
            clearCanvas();
        }, 1500); 
    });
});



// Function to draw an icon (checkmark or X)
function drawIcon(iconId) {
    const icon = document.getElementById(iconId);
    ctx.drawImage(icon, 0, 0, canvas.width*0.75, canvas.height*0.75);
}

// Function to clear the canvas
function clearCanvas() {
    ctx.fillStyle = "#FFFFFF"; 
    ctx.fillRect(0, 0, canvas.width, canvas.height);
}


