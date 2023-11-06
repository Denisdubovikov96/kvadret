import { useState } from 'react'
import './App.css'

import { Stage, Layer, Star, Text, Rect } from 'react-konva';


const INITIAL_STATE = generateShapes();

const cellPX = 10
const borderPX = 2


function generateShapes() {
  // return [...Array(1000)].map((_, i) => ({
  //   id: i.toString(),
  //   x: i,
  //   y: Math.random() * window.innerHeight,
  //   // rotation: Math.random() * 180,
  //   // isDragging: false,
  // }));
  const size = 500

  const board = {};
  for (let x = 0; x < size; x++) {
    for (let y = 0; y < size; y++) {
      const key = `${x}-${y}`
      board[key] = {
        id: key,
        x,
        y,
      };
    }
  }

  return Object.values(board)
}

function App() {
  const [stars, setStars] = useState(INITIAL_STATE);

  // const handleDragStart = (e) => {
  //   const id = e.target.id();
  //   setStars(
  //     stars.map((star) => {
  //       return {
  //         ...star,
  //         isDragging: star.id === id,
  //       };
  //     })
  //   );
  // };
  // const handleDragEnd = (e) => {
  //   setStars(
  //     stars.map((star) => {
  //       return {
  //         ...star,
  //         isDragging: false,
  //       };
  //     })
  //   );
  // };

  console.table(stars, ['id']);


  return (
    <div style={{ width: "100%" }}>
      <Stage width={window.innerWidth} height={window.innerHeight}>
        <Layer>
          <Text text="Try to drag a star" />
          {stars.map((star) => (
            <Rect
              key={star.id}
              id={star.id}
              x={star.x * (cellPX + borderPX)}
              y={star.y * (cellPX + borderPX)}
              width={cellPX}
              height={cellPX}
              fill='red'
            />
          ))}
        </Layer>
      </Stage>
    </div>
  )
}

export default App
