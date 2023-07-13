import React, { useState, useRef, useEffect } from "react";

import {
  FaEraser,
  FaUpload,
  FaPen,
  FaEdit,
  FaDownload,
  FaTimes,
  FaBars,
  FaSearchPlus,
  FaSearchMinus,
  FaRegEdit,
  FaTextHeight
} from "react-icons/fa";

import { AiOutlineClear } from "react-icons/ai";
import { IoColorPalette } from "react-icons/io5";
import { FiMaximize, FiMinimize } from "react-icons/fi";
import { Document, Page, pdfjs } from "react-pdf";
import "./Whiteboard.css";
import Api from "./Api";
pdfjs.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;

const Whiteboard = ({
  canvasSize,
  increaseCanvasSize,
  decreaseCanvasSize,
}) => {
  const canvasRef = useRef(null);
  const pdfContainerRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [penColor, setPenColor] = useState("#000000");
  const [penSize, setPenSize] = useState(3);
  const [currentTool, setCurrentTool] = useState("pen");
  const [uploadedImage, setUploadedImage] = useState(null);
  const [uploadedPdf, setUploadedPdf] = useState(null);
  const [numPages, setNumPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [fullscreen, setFullscreen] = useState(false);
  const [isCanvasOnTop, setIsCanvasOnTop] = useState(true);
  
  const [context, setContext] = useState(null);

  const toggleZIndex = () => {
    setIsCanvasOnTop((prevIsCanvasOnTop) => !prevIsCanvasOnTop);
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    setContext(ctx);
  }, []);

  const toggleMenu = () => {
    setIsMenuOpen((prevIsMenuOpen) => !prevIsMenuOpen);
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    setContext(ctx);
    ctx.strokeStyle = "#000000";
    ctx.lineWidth = 3;
    ctx.lineCap = "round";
    ctx.font = "12px Arial";
  }, []);

  useEffect(() => {
    if (context) {
      context.strokeStyle = penColor;
      context.lineWidth = penSize;
    }
  }, [context, penColor, penSize]);

  const startDrawing = (event) => {
    const { offsetX, offsetY } = getCoordinates(event);
    if (currentTool === "pen") {
      context.beginPath();
      context.moveTo(offsetX, offsetY);
      setIsDrawing(true);
    } else if (currentTool === "eraser") {
      context.globalCompositeOperation = "destination-out";
      context.beginPath();
      context.arc(offsetX, offsetY, penSize, 0, 2 * Math.PI);
      context.fill();
      setIsDrawing(true);
    }
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
      setFullscreen(true);
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
        setFullscreen(false);
      }
    }
  };

  const draw = (event) => {
    event.preventDefault();
    let clientX, clientY;
    if (
      (event.type === "touchstart" ||
        event.type === "touchmove" ||
        event.type === "touchend") &&
      event.touches.length === 1
    ) {
      // Touch event
      clientX = event.touches[0].clientX;
      clientY = event.touches[0].clientY;
    } else {
      // Mouse event
      clientX = event.clientX;
      clientY = event.clientY;
    }

    if (
      !isDrawing ||
      (event.buttons !== 1 && event.which !== 1 && event.type !== "touchmove")
    )
      return;

    const canvasRect = canvasRef.current.getBoundingClientRect();
    const offsetX = clientX - canvasRect.left;
    const offsetY = clientY - canvasRect.top;

    if (currentTool === "pen") {
      context.lineTo(offsetX, offsetY);
      context.stroke();
    } else if (currentTool === "eraser") {
      context.globalCompositeOperation = "destination-out";
      context.beginPath();
      context.arc(offsetX, offsetY, penSize, 0, 2 * Math.PI);
      context.fill();
    }
  };

  const stopDrawing = () => {
    if (currentTool === "pen") {
      context.closePath();
      setIsDrawing(false);
    }
  };

  const getCoordinates = (event) => {
    let clientX, clientY;
    if (
      event.type === "touchstart" ||
      event.type === "touchmove" ||
      event.type === "touchend"
    ) {
      clientX = event.touches[0].clientX;
      clientY = event.touches[0].clientY;
    } else {
      clientX = event.clientX;
      clientY = event.clientY;
    }
    const canvasRect = canvasRef.current.getBoundingClientRect();
    const offsetX = clientX - canvasRect.left;
    const offsetY = clientY - canvasRect.top;
    return { offsetX, offsetY };
  };

  const clearWhiteboard = () => {
    const canva = document.getElementById("can");
    const textBox = document.querySelector(".textbox");
    if (textBox) {
      canva.removeChild(textBox);
    }
    context.clearRect(0, 0, context.canvas.width, context.canvas.height);
  };

  const changePenColor = (color) => {
    setPenColor(color);
    context.strokeStyle = color;
  };

  const changePenSize = (size) => {
    setPenSize(size);
    context.lineWidth = size;
  };

  const handleTextSelected = () => {
    setCurrentTool("text");

    const canvas = document.getElementById("can");
    const canvasRect = canvas.getBoundingClientRect();

    const textBox = document.createElement("div");
    textBox.classList.add("textbox");
    textBox.contentEditable = true; // Enable text editing
    textBox.innerText = "hello";
    canvas.appendChild(textBox);

    textBox.style.left = `${canvasRect.left + 50}px`;
    textBox.style.top = `${canvasRect.top + 50}px`;

    let isDragging = false;
    let isResizing = false;
    let startX, startY, startWidth, startHeight;

    textBox.addEventListener("mousedown", (event) => {
      const target = event.target;
      if (
        event.offsetX > target.offsetWidth - 10 &&
        event.offsetY > target.offsetHeight - 10
      ) {
        isResizing = true;
        startX = event.clientX;
        startY = event.clientY;
        startWidth = target.offsetWidth;
        startHeight = target.offsetHeight;
      } else {
        isDragging = true;
        startX = event.clientX - parseInt(textBox.style.left);
        startY = event.clientY - parseInt(textBox.style.top);
      }
    });

    document.addEventListener("mouseup", () => {
      isDragging = false;
      isResizing = false;
    });

    document.addEventListener("mousemove", (event) => {
      if (isDragging) {
        textBox.style.left = `${event.clientX - startX}px`;
        textBox.style.top = `${event.clientY - startY}px`;
      } else if (isResizing) {
        const width = startWidth + event.clientX - startX;
        const height = startHeight + event.clientY - startY;
        textBox.style.width = `${width}px`;
        textBox.style.height = `${height}px`;

        // Decrease font size as the box size decreases
        const fontSize = Math.max(10, 16 - (width - startWidth) / 10);
        textBox.style.fontSize = `${fontSize}px`;
      }
    });
  };

  const handlePenSelected = () => {
    setCurrentTool("pen");
  };

  const handleEraserSelected = () => {
    setCurrentTool("eraser");
  };

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    const fileName = file.name;
    const fileExtension = fileName.split(".").pop().toLowerCase();

    if (file) {
      if (fileExtension === "pdf") {
        setUploadedPdf(URL.createObjectURL(file));
      } else if (file.type.includes("image/")) {
        const reader = new FileReader();
        reader.onload = (e) => {
          const img = new Image();
          img.onload = () => {
            context.drawImage(img, 0, 0, canvasSize.width, canvasSize.height);
          };
          img.src = e.target.result;
          setUploadedImage(img);
        };
        reader.readAsDataURL(file);
      } else {
        console.error("Unsupported file format");
      }
    }
  };
  const handlePdfLoadSuccess = ({ numPages }) => {
    setNumPages(numPages);
    setCurrentPage(1);
  };

  const goToPrevPage = () => {
    setCurrentPage((prevPage) => prevPage - 1);
  };

  const goToNextPage = () => {
    setCurrentPage((prevPage) => prevPage + 1);
  };

  const insertTextOnCanvas = () => {
    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");
    const textBox = document.querySelector(".textbox");

    if (!textBox) {
      return;
    }

    const textBoxRect = textBox.getBoundingClientRect();

    const text = textBox.innerText;
    const fontSize = parseInt(getComputedStyle(textBox).fontSize);
    const left = textBoxRect.left - canvas.getBoundingClientRect().left;
    const top = textBoxRect.top - canvas.getBoundingClientRect().top;

    context.font = `${fontSize}px Arial`;
    context.fillText(text, left, top);
  };

  const downloadCanvas = () => {
    const canvas = canvasRef.current;
    const dataURL = canvas.toDataURL("image/png");
    const link = document.createElement("a");
    link.href = dataURL;
    link.download = "whiteboard.png";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Call insertTextOnCanvas before downloading the canvas
  const handleDownloadCanvas = () => {
    insertTextOnCanvas();
    downloadCanvas();
  };

  const saveeWork = async () => {
    insertTextOnCanvas();
    const canvas = canvasRef.current;
    const dataURL = canvas.toDataURL("image/png");
    const data = dataURL.replace(/^data:image\/(png|jpeg);base64,/, "");

    await Api.saveCanvasData({ data });
  };

  const saveWork = async () => {
    try {
      const response = await Api.getCanvasData();
      const canvasData = response.data;

      const canvas = canvasRef.current;
      const context = canvas.getContext("2d");

      const image = new Image();
      image.src = "data:image/png;base64," + canvasData; // Add the base64 prefix and MIME type

      image.onload = () => {
        context.clearRect(0, 0, canvas.width, canvas.height);
        context.drawImage(image, 0, 0);
      };
    } catch (error) {
      console.error("Failed to fetch the canvas:", error);
    }
  };
  
  const colorPickerRef = useRef();
  const [showColorPicker, setShowColorPicker] = useState(true);

  const handleColorButtonClick = () => {
    if (showColorPicker) {
      colorPickerRef.current.click();
    }
    setShowColorPicker(!showColorPicker);
  };
  const [showRangeSelector, setShowRangeSelector] = useState(false);
 

  
  const toggleRangeSelector = () => {
    setShowRangeSelector(!showRangeSelector);
  };

  return (
    <div
      className={`whiteboard-container ${
        isCanvasOnTop ? "canvas-on-top" : "pdf-on-top"
      }`}
    >
      <div className="canvas-container" id="can">
        <canvas
          ref={canvasRef}
          width={canvasSize.width}
          height={canvasSize.height}
          onMouseDown={startDrawing}
          onMouseMove={draw}
          onMouseUp={stopDrawing}
          onMouseOut={stopDrawing}
          onTouchStart={startDrawing}
          onTouchMove={draw}
          onTouchEnd={stopDrawing}
        />

        {uploadedPdf && (
          <div className="pdf-container" ref={pdfContainerRef}>
            <Document
              file={uploadedPdf}
              onLoadSuccess={handlePdfLoadSuccess}
              onLoadError={console.error}
            >
              <Page pageNumber={currentPage} width={canvasSize.width} />
            </Document>
            <div className="pdf-navigation">
              <button disabled={currentPage <= 1} onClick={goToPrevPage}>
                Previous
              </button>
              <span>
                Page {currentPage} of {numPages}
              </span>
              <button disabled={currentPage >= numPages} onClick={goToNextPage}>
                Next
              </button>
            </div>
          </div>
        )}
      </div>

      <div className={`toolbar ${isMenuOpen ? "open" : ""}`}>
       <div style={{ display: 'flex', alignItems: 'center' }}>
      
      {showRangeSelector && (
        <div className="pen-sizes">
          <input
            type="range"
            min="1"
            max="20"
            value={penSize}
            onChange={(e) => changePenSize(Number(e.target.value))}
          />
        </div>
      )}
      <button className="canvas-size-button2" onClick={toggleRangeSelector}>
        <FaTextHeight />
      </button>
    </div>

        <div>
        
        <input
          type="color"
          value={penColor}
          onChange={(e) => changePenColor(e.target.value)}
          id="color-picker"
          ref={colorPickerRef}
          style={{ display:'none' }}
        />
        
          <label htmlFor="color-picker">
          <button className="canvas-size-button" onClick={handleColorButtonClick}>
              
            <IoColorPalette style={{ fontSize: "25px" }} />
            </button>          
          </label>
        </div>
        <button
          className={`canvas-size-button tool ${
            currentTool === "pen" ? "selected" : ""
          }`}
          onClick={handlePenSelected}
        >
          <i>
            <FaPen />{" "}
          </i>
        </button>
        <button
          className={`canvas-size-button tool ${
            currentTool === "eraser" ? "selected" : ""
          }`}
          onClick={handleEraserSelected}
        >
          <i className="fas1">
            <FaEraser />
          </i>
        </button>
        <button
          className={`canvas-size-button tool ${
            currentTool === "text" ? "selected" : ""
          }`}
          onClick={handleTextSelected}
        >
          <i>
            <FaEdit />
          </i>
        </button>
        <button className="canvas-size-button" onClick={increaseCanvasSize}>
          <FaSearchPlus />
        </button>
        <button className="canvas-size-button" onClick={decreaseCanvasSize}>
          <FaSearchMinus />
        </button>
      </div>
      <button className="menu-toggle" onClick={toggleMenu}>
        {isMenuOpen ? (
          <FaTimes className="cross" />
        ) : (
          <FaBars className="str" />
        )}
      </button>
      <div className="extra-buttons">
        <button className="canvas-size-button" onClick={clearWhiteboard}>
          <AiOutlineClear />
        </button>
        <button className="canvas-size-button">
          <label htmlFor="upload-button">
            <i>
              <FaUpload />
            </i>
          </label>
          <input
            type="file"
            id="upload-button"
            onChange={handleFileUpload}
            style={{ display: "none" }}
          />
        </button>

        <button className="canvas-size-button" onClick={handleDownloadCanvas}>
          <i>
            <FaDownload />
          </i>
        </button>
        <button className="canvas-size-button" onClick={toggleFullscreen}>
          {fullscreen ? (
            <i>
              <FiMinimize />
            </i>
          ) : (
            <i>
              <FiMaximize />
            </i>
          )}
        </button>
        <button className="canvas-size-button" onClick={toggleZIndex}>
          <FaRegEdit />
        </button>
        <button className="canvas-size-button" onClick={saveWork}>
          <FaUpload />
        </button>
        <button className="canvas-size-button" onClick={saveeWork}>
          <FaDownload />
        </button>
      </div>
    </div>
  );
};

export default Whiteboard;
