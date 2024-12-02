document.addEventListener("DOMContentLoaded", () => {
    const canvas = document.getElementById('drawingCanvas');
    const ctx = canvas.getContext('2d');
    const saveButton = document.getElementById('saveDrawing');
    const referenceImage = document.getElementById('referenceImage');
    const clearButton = document.getElementById('clearCanvas');
    const toggleEraserButton = document.getElementById('eraserToggle');
    const labelElement = document.getElementById('letterLabel');
    const brushSizeSlider = document.getElementById('toolSize');

    let isDrawing = false;
    let isEraser = false;
    let brushSize = brushSizeSlider.value;

    ctx.fillStyle = "#FFFFFF"; 
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Set up canvas drawing
    canvas.addEventListener('mousedown', (e) => {
        isDrawing = true;
        ctx.beginPath();
        ctx.moveTo(e.offsetX, e.offsetY);
    });

    canvas.addEventListener('mousemove', (e) => {
        if (isDrawing) {
            ctx.lineWidth = brushSize;
            ctx.lineCap = 'round';
            ctx.strokeStyle = isEraser ? '#FFFFFF' : '#000000';
            ctx.lineTo(e.offsetX, e.offsetY);
            ctx.stroke();
        }
    });

    canvas.addEventListener('mouseup', () => {
        isDrawing = false;
        ctx.closePath();
    });

    // Clear canvas
    clearButton.addEventListener('click', () => {
        ctx.fillStyle = "#FFFFFF"; 
        ctx.fillRect(0, 0, canvas.width, canvas.height);
    });

    // Toggle eraser/draw mode
    toggleEraserButton.addEventListener('click', () => {
        isEraser = !isEraser;
        toggleEraserButton.textContent = isEraser ? 'Draw' : 'Eraser';
    });

    // Update brush size
    brushSizeSlider.addEventListener('input', (e) => {
        brushSize = e.target.value;
    });

    // Save drawing and load the next reference
    saveButton.addEventListener('click', () => {
        const dataUrl = canvas.toDataURL();
        const label = referenceLabel;

        const formData = new FormData();
        formData.append('drawing', dataUrl);
        formData.append('label', label);

        ctx.fillStyle = "#FFFFFF"; 
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        fetch('/canvas/save/', {
            method: 'POST',
            body: formData
        })
        .then(response => response.json())
        .then(data => {
            if (data.message) {
                alert(data.message);

                if (data.next_reference) {
                    // Update reference image and label
                    referenceImage.src = data.next_reference.image;
                    referenceLabel = data.next_reference.label;
                    console.log(referenceLabel);
                    labelElement.textContent = 'Letter to Draw: ' + referenceLabel;
                } else {
                    // End of sequence
                    referenceImage.style.display = 'none';
                    referenceLabel = '';
                    labelElement.textContent = 'No more letters to draw. Thank you!';
                }
            }
        })
        .catch(error => console.error('Error:', error));
    });


});