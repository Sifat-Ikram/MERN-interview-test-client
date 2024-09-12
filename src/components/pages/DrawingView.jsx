import { useEffect, useRef, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import * as fabric from "fabric";

const DrawingView = () => {
  const [drawing, setDrawing] = useState(null);
  const canvasRef = useRef(null);
  const canvasInstanceRef = useRef(null); // Store the fabric canvas instance
  const { id } = useParams();

  useEffect(() => {
    // Fetch the drawing data when component mounts or when id changes
    axios
      .get(`http://localhost:4321/drawings/${id}`)
      .then((response) => {
        setDrawing(response.data);
        initializeCanvas(response.data);
      })
      .catch((error) => console.error(error));

    // Cleanup function to dispose of the canvas instance before component unmounts or before reinitializing
    return () => {
      if (canvasInstanceRef.current) {
        canvasInstanceRef.current.dispose();
        canvasInstanceRef.current = null;
      }
    };
  }, [id]);

  const initializeCanvas = (drawingData) => {
    // Dispose of the previous canvas instance before creating a new one
    if (canvasInstanceRef.current) {
      canvasInstanceRef.current.dispose();
    }

    const canvas = new fabric.Canvas(canvasRef.current);
    canvasInstanceRef.current = canvas; // Store the fabric canvas instance in the ref

    // Render lines
    if (drawingData && drawingData.lines) {
      drawingData.lines.forEach((line) => {
        const fabricLine = new fabric.Line(
          [line.start.x, line.start.y, line.end.x, line.end.y],
          {
            stroke: line.color,
            strokeWidth: line.thickness,
          }
        );
        canvas.add(fabricLine);
      });
    }

    // Render shapes (rectangles, etc.)
    if (drawingData && drawingData.shapes) {
      drawingData.shapes.forEach((shape) => {
        if (shape.type === "rectangle") {
          const fabricRect = new fabric.Rect({
            left: shape.position.x,
            top: shape.position.y,
            width: shape.dimensions.width,
            height: shape.dimensions.height,
            fill: shape.color,
          });
          canvas.add(fabricRect);
        }
      });
    }

    // Render text annotations
    if (drawingData && drawingData.textAnnotations) {
      drawingData.textAnnotations.forEach((text) => {
        const fabricText = new fabric.Text(text.content, {
          left: text.position.x,
          top: text.position.y,
          fontSize: text.fontSize,
          fill: text.color,
        });
        canvas.add(fabricText);
      });
    }
  };

  const saveChanges = () => {
    if (!canvasInstanceRef.current) return;

    const canvas = canvasInstanceRef.current;
    const objects = canvas.getObjects();

    // Extract lines, shapes, and text from canvas objects
    const updatedDrawing = {
      lines: [],
      shapes: [],
      textAnnotations: [],
    };

    objects.forEach((obj) => {
      if (obj.type === "line") {
        updatedDrawing.lines.push({
          start: { x: obj.x1, y: obj.y1 },
          end: { x: obj.x2, y: obj.y2 },
          color: obj.stroke,
          thickness: obj.strokeWidth,
        });
      } else if (obj.type === "rect") {
        updatedDrawing.shapes.push({
          type: "rectangle",
          position: { x: obj.left, y: obj.top },
          dimensions: { width: obj.width, height: obj.height },
          color: obj.fill,
        });
      } else if (obj.type === "text") {
        updatedDrawing.textAnnotations.push({
          content: obj.text,
          position: { x: obj.left, y: obj.top },
          fontSize: obj.fontSize,
          color: obj.fill,
        });
      }
    });

    // Send the updated drawing data to the server
    axios
      .patch(`http://localhost:4321/drawings/${id}`, updatedDrawing)
      .then((response) => {
        console.log("Drawing updated successfully:", response.data);
      })
      .catch((error) => console.error("Error updating drawing:", error));
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-indigo-100 to-blue-200 flex items-center justify-center">
      <div className="max-w-4xl w-full bg-white rounded-lg shadow-lg p-6 space-y-4">
        {/* Header Section */}
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-700 mb-2">
            {drawing ? drawing.name : "Loading..."}
          </h1>
          <p className="text-gray-500">
            View and interact with the saved drawing below.
          </p>
        </div>

        {/* Canvas Section */}
        <div className="border border-gray-300 shadow-md rounded-lg overflow-hidden">
          <canvas ref={canvasRef} width={800} height={600} />
        </div>

        {/* Footer Section */}
        <div className="text-center pt-4">
          <button onClick={saveChanges} className="btn btn-primary">
            Save Changes
          </button>
          <p className="text-sm text-gray-400 mt-2">
            Any modifications you make will be automatically saved.
          </p>
        </div>
      </div>
    </div>
  );
};

export default DrawingView;
