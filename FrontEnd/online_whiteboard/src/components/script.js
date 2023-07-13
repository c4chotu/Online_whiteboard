/*const canvas = canvasRef.current;
      const context = canvas.getContext('2d');
      const capturedData = {
        canvasData: {
          width: canvas.width,
          height: canvas.height,
        },
        imageData: context.getImageData(0, 0, canvas.width, canvas.height).data,
      };
  
      // Convert the captured data to JSON string
      const jsonString = JSON.stringify(capturedData);
  
      try {
        // Send the JSON data to the server
        const data="shubham";
        await Api.saveCanvasData(data);
        alert('Work saved successfully!');
      } catch (error) {
        console.error('Failed to save work:', error);
        alert(jsonString);
      }*/