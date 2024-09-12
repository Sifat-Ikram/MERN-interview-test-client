import * as fabric from "fabric";
import { useState, useEffect, useRef } from "react";
import axios from "axios";

const AddDrawing = () => {
  const [title, setTitle] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const canvasRef = useRef(null); // Reference to the canvas element
  const [canvas, setCanvas] = useState(null);
  const [isDrawingMode, setIsDrawingMode] = useState(false);
  const [brushColor, setBrushColor] = useState("#ff0000");
  const [brushWidth, setBrushWidth] = useState(5);

  useEffect(() => {
    const fabricCanvas = new fabric.Canvas("drawing-canvas", {
      isDrawingMode: false,
    });
    setCanvas(fabricCanvas);

    return () => {
      fabricCanvas.dispose();
    };
  }, []);

  const toggleFreeDrawing = () => {
    if (canvas) {
      canvas.isDrawingMode = !canvas.isDrawingMode;
      setIsDrawingMode(canvas.isDrawingMode);
    }
  };

  const handleBrushColorChange = (e) => {
    const color = e.target.value;
    setBrushColor(color);
    if (canvas) {
      canvas.freeDrawingBrush.color = color;
    }
  };

  const handleBrushWidthChange = (e) => {
    const width = parseInt(e.target.value, 10);
    setBrushWidth(width);
    if (canvas) {
      canvas.freeDrawingBrush.width = width;
    }
  };

  const addCircle = () => {
    if (canvas) {
      const circle = new fabric.Circle({
        radius: 50,
        fill: "green",
        left: 100,
        top: 100,
      });
      canvas.add(circle);
    }
  };

  const addText = () => {
    if (canvas) {
      const text = new fabric.Textbox("Hello World", {
        left: 200,
        top: 200,
        fontSize: 24,
        fill: "#0000ff",
      });
      canvas.add(text);
    }
  };

  const clearCanvas = () => {
    if (canvas) {
      canvas.clear();
    }
  };

  const undoLastAction = () => {
    if (canvas) {
      const lastObject = canvas.getObjects().pop();
      if (lastObject) {
        canvas.remove(lastObject);
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);

    const drawingData = canvas.toJSON();

    const newDrawing = {
      title,
      drawingData,
    };

    try {
      await axios.post("http://localhost:4321/drawings", newDrawing);
      alert("Drawing saved successfully!");
    } catch (error) {
      console.error("Error saving drawing:", error);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto mt-10 p-8 bg-base-100 shadow-lg rounded-lg">
      <h1 className="text-3xl font-bold mb-6 text-center">
        Create a New Drawing
      </h1>
      <form onSubmit={handleSubmit}>
        <div className="mb-6">
          <label className="block mb-2 text-lg font-semibold text-gray-700">
            Title
          </label>
          <input
            type="text"
            className="input input-bordered w-full"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            placeholder="Enter drawing title"
          />
        </div>

        <div className="flex mb-6">
          <div className="flex-grow">
            <canvas
              id="drawing-canvas"
              ref={canvasRef}
              width={600}
              height={400}
              className="border border-gray-300"
            ></canvas>

            <div className="flex justify-center gap-8 mt-4">
              <div className="flex justify-center items-center gap-5">
                <label className="mr-2">Brush Color:</label>
                <input
                  type="color"
                  value={brushColor}
                  onChange={handleBrushColorChange}
                  className="input input-primary h-8 w-14"
                />
              </div>

              <div className="flex justify-center items-center gap-5">
                <label className="mr-2">Brush Width:</label>
                <input
                  type="range"
                  min="1"
                  max="30"
                  value={brushWidth}
                  onChange={handleBrushWidthChange}
                  className="input input-bordered"
                />
                {brushWidth}px
              </div>
            </div>
          </div>

          <div className="ml-4 flex flex-col space-y-4">
            <button
              type="button"
              className="btn btn-primary"
              onClick={toggleFreeDrawing}
            >
              {isDrawingMode ? "Disable Free Draw" : "Enable Free Draw"}
            </button>
            <button
              type="button"
              className="btn btn-primary"
              onClick={addCircle}
            >
              Add Circle
            </button>
            <button type="button" className="btn btn-primary" onClick={addText}>
              Add Text
            </button>
            <button
              type="button"
              className="btn btn-primary"
              onClick={undoLastAction}
            >
              Undo Last Action
            </button>
            <button
              type="button"
              className="btn btn-primary"
              onClick={clearCanvas}
            >
              Clear Canvas
            </button>
          </div>
        </div>

        <div className="flex justify-center">
          <button
            type="submit"
            className={`btn btn-primary text-white ${
              isSaving ? "loading" : ""
            }`}
            disabled={isSaving}
          >
            {isSaving ? "Saving..." : "Save Drawing"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddDrawing;
