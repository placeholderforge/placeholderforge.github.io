function generateAndDownload() {
    const input = document.getElementById('imageInput');
  
    if (input.files.length === 0) {
      alert('Please select one or more images.');
      return;
    }
  
    const zip = new JSZip();
  
    // Function to process each file
    function processFile(file) {
      return new Promise((resolve) => {
        const img = new Image();
  
        img.onload = function() {
          const width = this.width;
          const height = this.height;
  
          // Create a canvas
          const canvas = document.createElement('canvas');
          canvas.width = width;
          canvas.height = height;
          const context = canvas.getContext('2d');
  
          // Fill the canvas with #afafaf color
          context.fillStyle = '#afafaf'; // #afafaf color
          context.fillRect(0, 0, width, height);
  
          // Calculate the font size as 10% of the image height or width, whichever is smaller
          const fontSize = Math.min(width, height) * 0.1;
  
          // Draw the centered watermark with dynamically calculated font size
          context.font = `bold ${fontSize}px Arial`;
          context.fillStyle = 'black';
          const text = `${width}x${height}`;
          const textWidth = context.measureText(text).width;
          const x = (width - textWidth) / 2;
          const y = height / 2;
          context.fillText(text, x, y);
  
          // Convert the canvas content to a data URL
          const dataUrl = canvas.toDataURL('image/png');
  
          // Add the watermarked image to the zip file
          zip.file(file.name.replace(/\.[^/.]+$/, '_pf.png'), dataUrl.substr(dataUrl.indexOf(',') + 1), { base64: true });
  
          resolve();
        };
  
        // Load the uploaded image
        const reader = new FileReader();
        reader.onload = function(e) {
          img.src = e.target.result;
        };
        reader.readAsDataURL(file);
      });
    }
  
    // Process each file and then download the zip file
    Promise.all(Array.from(input.files).map(processFile))
      .then(() => {
        // Generate the zip file
        zip.generateAsync({ type: 'blob' })
          .then((blob) => {
            // Create a temporary link and trigger the download
            const link = document.createElement('a');
            link.href = URL.createObjectURL(blob);
            link.download = 'images.zip';
            link.click();
          });
      });
  }