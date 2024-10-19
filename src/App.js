import React, { useState } from 'react';
import { Stage, Layer, Line } from 'react-konva';
import axios from 'axios';

function App() {
  const [blueprint, setBlueprint] = useState(null);
  const [lines, setLines] = useState([]);
  const [isDrawing, setIsDrawing] = useState(false);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    const formData = new FormData();
    formData.append('blueprint', file);

    axios.post('http://localhost:3001/upload', formData)
      .then(response => {
        alert('File uploaded successfully');
        setBlueprint(URL.createObjectURL(file));
      })
      .catch(error => {
        console.error('Error uploading file:', error);
      });
  };

  const handleMouseDown = (e) => {
    setIsDrawing(true);
    const { x, y } = e.target.getStage().getPointerPosition();
    setLines([...lines, { points: [x, y] }]);
  };

  const handleMouseMove = (e) => {
    if (!isDrawing) return;

    const stage = e.target.getStage();
    const point = stage.getPointerPosition();
    const lastLine = lines[lines.length - 1];
    lastLine.points = lastLine.points.concat([point.x, point.y]);

    lines.splice(lines.length - 1, 1, lastLine);
    setLines(lines.concat());
  };

  const handleMouseUp = () => {
    setIsDrawing(false);
  };

  return (
    <div>
      <input type="file" onChange={handleFileChange} />
      {blueprint && (
        <Stage
          width={window.innerWidth}
          height={window.innerHeight}
          onMouseDown={handleMouseDown}
          onMousemove={handleMouseMove}
          onMouseup={handleMouseUp}
        >
          <Layer>
            <Line
              points={[20, 20, 100, 100]}
              stroke="red"
              strokeWidth={5}
              lineCap="round"
              lineJoin="round"
            />
            {lines.map((line, i) => (
              <Line
                key={i}
                points={line.points}
                stroke="black"
                strokeWidth={2}
                tension={0.5}
                lineCap="round"
                lineJoin="round"
              />
            ))}
          </Layer>
        </Stage>
      )}
    </div>
  );
}

export default App;
