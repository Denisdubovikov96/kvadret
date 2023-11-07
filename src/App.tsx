import { useRef, useState } from 'react'
import './App.css'

import { Stage, Layer, Star, Text, Rect, Line } from 'react-konva';

125 * 4 * 4

const cellPX = 4
const borderPX = 1
const boardSize = 125
const scaleBy = 1.1;

const maxScale = 10
const minScale = 1


// {
//   // 250
//   {
//     {

//     }
//     {

//     }
//     {

//     }
//     {

//     }
//   }
//   {

//   }
//   {

//   }
//   {

//   }
// }


const generateShapes = () => {
  // return [...Array(1000)].map((_, i) => ({
  //   id: i.toString(),
  //   x: i,
  //   y: Math.random() * window.innerHeight,
  //   // rotation: Math.random() * 180,
  //   // isDragging: false,
  // }));
  const size = boardSize

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
const INITIAL_STATE = generateShapes();

const getXScale = (wScale) => {
  if (wScale >= 1 && wScale < 3) {
    return {
      name: 'x1',
      modifier: 4
    }
  }
  if (wScale >= 3 && wScale < 7) {
    return {
      name: 'x2',
      modifier: 2
    }
  }
  if (wScale >= 7 && wScale <= 10) {
    return {
      name: 'x3',
      modifier: 1
    }
  }
}

function App() {
  const stageRef = useRef(null)
  const [cells, setCells] = useState(INITIAL_STATE);
  const [scale, setScale] = useState(minScale);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [selected, setSelected] = useState(null)
  console.log(scale);

  const a = getXScale(scale)
  // console.table(stars, ['id']);
  // console.log(selected);
  // console.log(cells);
  console.log(a);


  return (
    <div style={{ width: "100%", maxWidth: 1400, margin: "0 auto" }}>
      <Stage
        style={{
          margin: "0 auto"
        }}
        ref={stageRef}
        width={10000}
        height={10000}
        x={position.x}
        y={position.y}
        onWheel={(e) => {
          e.evt.preventDefault();
          const stage = e.currentTarget.getStage()
          
          // how to scale? Zoom in? Or zoom out?
          let direction = e.evt.deltaY > 0 ? 1 : -1;
          
          // when we zoom on trackpad, e.evt.ctrlKey is true
          // in that case lets revert direction
          if (e.evt.ctrlKey) {
            direction = -direction;
          }
          
          const newScale = !(direction > 0) ? scale * scaleBy : scale / scaleBy;
          const nn = maxScale < newScale ? maxScale : newScale < minScale ? minScale : newScale
          setScale(nn);
          if (!stage || !e.currentTarget.x || !e.currentTarget.y) {
            return
          }
          const oldScale = stage.scaleX()
          console.log();


          const pointer = {
            x: stage.getPointerPosition()?.x() ?? 0,
            y: stage.getPointerPosition()?.y() ?? 0,
          };


          const mousePointTo = {
            x: (pointer.x() - stage.x() ?? 0) / oldScale,
            y: (pointer.y() - stage.y() ?? 0) / oldScale,
          };

          const newPos = {
            x: pointer.x() - mousePointTo.x * newScale,
            y: pointer.y() - mousePointTo.y * newScale,
          };
          setPosition(newPos);
        }}
        onClick={(e) => {
          console.log(e.target.attrs);
          setSelected(e.target.attrs)
        }}
        scaleX={scale}
        scaleY={scale}
        offset={{ x: -(cellPX + borderPX) / 4, y: -(cellPX + borderPX) / 4 }}
      >
        <Layer

        >
          <Text />
          {/* TODO: render simple line grid to show 1000  x 1000 instead of 1000000 */}
          {/* {[...Array(1000)].fill(0).map((_, i) => {

            return (
              <>
                <Line
                  // strokeEnabled
                  width={1}
                  strokeWidth={1}
                  points={[
                    i , 0,
                    i , 1000,
                    i + 1 , 1000 + i,
                    i + 1, 1000 + i,

                  ]}
                  fill='blue'
                  stroke={'red'}
                />

              </>
            )
          })} */}
          {/* Render 4 x 250 | 4 x 125 */}
          {/* cells modifier */}
          {cells.map((cell) => (
            <Rect
              key={cell.id}
              id={cell.id}
              x={cell.x * (cellPX + borderPX)}
              y={cell.y * (cellPX + borderPX)}
              width={cellPX}
              height={cellPX}
              fill='blue'
            />
          ))}

          {
            selected && (
              <Line
                // strokeEnabled
                width={borderPX}
                strokeWidth={borderPX}
                points={[
                  selected.x, selected.y,
                  selected.x + cellPX, selected.y,
                  selected.x + cellPX, selected.y + cellPX,
                  selected.x, selected.y + cellPX,
                  selected.x, selected.y - 0.5,
                ]}
                fill='blue'
                stroke={'red'}
              />
            )
          }
        </Layer>
      </Stage>
    </div>
  )
}

export default App
