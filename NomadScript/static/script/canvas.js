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

    // Set up canvas drawing area and clear it
    ctx.fillStyle = "#FFFFFF"; 
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    //Draw logic
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

    // Clear canvas by drawing white rectangle
    clearButton.addEventListener('click', () => {
        ctx.fillStyle = "#FFFFFF"; 
        ctx.fillRect(0, 0, canvas.width, canvas.height);
    });

    // Toggle eraser/draw mode
    toggleEraserButton.addEventListener('click', () => {
        isEraser = !isEraser;
        //Change button depending on draw/eraser mode
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

        //Create new form data from user drawing
        const formData = new FormData();
        formData.append('drawing', dataUrl);
        formData.append('label', label);

        //Clear the canvas for next drawing
        ctx.fillStyle = "#FFFFFF"; 
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        //Use POST API to send the data into middleware
        fetch('/canvas/save/', {
            method: 'POST',
            body: formData
        })
        .then(response => response.json())
        .then(data => {
            if (data.message) {
                alert(data.message);
                //If middleaware sent back next reference draw it
                if (data.next_reference) {
                    // Update reference image and label
                    referenceImage.src = data.next_reference.image;
                    referenceLabel = data.next_reference.label;
                    console.log(referenceLabel);
                    labelElement.textContent = 'Letter to Draw: ' + referenceLabel;
                //If there is no reference picture, alert the user
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