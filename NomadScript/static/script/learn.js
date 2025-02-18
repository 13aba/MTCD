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

canvas.width = 300;
canvas.height = 300;
ctx.lineWidth = 5;
ctx.lineCap = "round";

let drawing = false;

canvas.addEventListener("mousedown", () => (drawing = true));
canvas.addEventListener("mouseup", () => (drawing = false));
canvas.addEventListener("mousemove", draw);

function draw(e) {
    if (!drawing) return;
    ctx.lineTo(e.offsetX, e.offsetY);
    ctx.stroke();
}

document.getElementById("clearCanvas").addEventListener("click", () => {
    ctx.fillStyle = "#FFFFFF"; 
    ctx.fillRect(0, 0, canvas.width, canvas.height);
});