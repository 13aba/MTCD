document.addEventListener("DOMContentLoaded", () => {
    const canvas = document.getElementById('drawingCanvas');
    const ctx = canvas.getContext('2d');
    const saveButton = document.getElementById('saveDrawing');
    const referenceImage = document.getElementById('referenceImage');
    const clearButton = document.getElementById('clearCanvas');
    const toggleEraserButton = document.getElementById('eraserToggle');
    const labelElement = document.getElementById('letterLabel');

    let isDrawing = false;
    let isEraser = false;

    const scale = window.devicePixelRatio || 1; 
    const width = canvas.offsetWidth;
    const height = canvas.offsetHeight;

    canvas.width = width * scale;
    canvas.height = height * scale;
    ctx.scale(scale, scale);

    // Set up canvas drawing area and clear it
    ctx.fillStyle = "#FFFFFF"; 
    ctx.fillRect(0, 0, canvas.width, canvas.height);


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

    function getPos(e) {
        const rect = canvas.getBoundingClientRect();
        const scale = window.devicePixelRatio || 1;
        return {
            x: (e.clientX - rect.left) * (canvas.width / rect.width) / scale,
            y: (e.clientY - rect.top) * (canvas.height / rect.height) / scale
        };
    }

    // Add touch event listeners for mobile devices
    canvas.addEventListener('touchstart', (e) => {
        e.preventDefault(); // Prevents screen from scrolling
        isDrawing = true;
        const pos = getPos(e.touches[0]);
        ctx.beginPath();
        ctx.moveTo(pos.x, pos.y);
    });

    canvas.addEventListener('touchmove', (e) => {
        if (!isDrawing) return;
        const pos = getPos(e.touches[0]);
        ctx.lineWidth = isEraser ? 20 : 10;
        ctx.lineCap = "round";
        ctx.strokeStyle = isEraser ? "#FFFFFF" : "#000000";
        ctx.lineTo(pos.x, pos.y);
        ctx.stroke();
    });

    canvas.addEventListener('touchend', () => {
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
        fetch('save/', {
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