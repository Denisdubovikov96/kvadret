import { useRef, useState } from 'react'
import './App.css'

import { Stage, Layer, Star, Text, Rect, Line, Group } from 'react-konva';

125 * 4 * 4

const cellPX = 7
const borderPX = 1
const boardSize = 100
const scaleBy = 1.2;

const maxScale = 20
const minScale = 1


const segments = [
  // 
  { x1: 0, y1: 0, x2: 10, y2: 10, color: 'red' },
  { x1: 10, y1: 0, x2: 20, y2: 10, color: 'green' },
  { x1: 20, y1: 0, x2: 30, y2: 10, color: 'blue' },
  { x1: 30, y1: 0, x2: 40, y2: 10, color: 'black' },
  { x1: 40, y1: 0, x2: 50, y2: 10, color: 'red' },
  // 
  { x1: 0, y1: 10, x2: 10, y2: 20, color: 'blue' },
  { x1: 10, y1: 10, x2: 20, y2: 20, color: 'yellow' },
  { x1: 20, y1: 10, x2: 30, y2: 20, color: 'red' },
  { x1: 30, y1: 10, x2: 40, y2: 20, color: 'blue' },
  { x1: 40, y1: 10, x2: 50, y2: 20, color: 'yellow' },
  // 
  { x1: 0, y1: 20, x2: 10, y2: 30, color: 'red' },
  { x1: 10, y1: 20, x2: 20, y2: 30, color: 'blue' },
  { x1: 20, y1: 20, x2: 30, y2: 30, color: 'yellow' },
  { x1: 30, y1: 20, x2: 40, y2: 30, color: 'red' },
  { x1: 40, y1: 20, x2: 50, y2: 30, color: 'green' },
  // 
  { x1: 0, y1: 30, x2: 10, y2: 40, color: 'blue' },
  { x1: 10, y1: 30, x2: 20, y2: 40, color: 'yellow' },
  { x1: 20, y1: 30, x2: 30, y2: 40, color: 'red' },
  { x1: 30, y1: 30, x2: 40, y2: 40, color: 'blue' },
  { x1: 40, y1: 30, x2: 50, y2: 40, color: 'red' },
  // 
  { x1: 0, y1: 40, x2: 10, y2: 50, color: 'red' },
  { x1: 10, y1: 40, x2: 20, y2: 50, color: 'green' },
  { x1: 20, y1: 40, x2: 30, y2: 50, color: 'blue' },
  { x1: 30, y1: 40, x2: 40, y2: 50, color: 'yellow' },
  { x1: 40, y1: 40, x2: 50, y2: 50, color: 'green' },
]


const generateShapes = (xStart, yStart) => {
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
  // 0-9
  // 10-19
  // 20-29
  const s = segments.map((v) => {
    console.log(v);

    const board = {};
    for (let x = v.x1; x < v.x2; x++) {
      for (let y = v.y1; y < v.y2; y++) {
        const key = `${x}-${y}`
        board[key] = {
          id: key,
          x,
          y,
          color: v.color
        };
      }
    }

    return Object.values(board)
  })
  // console.log(s);
  // log
  return {
    // full: Object.values(board),
    full: [],
    segments: s
  }
}
const { full: INITIAL_STATE, segments: segmented } = generateShapes();

const getXScale = (wScale) => {
  if (wScale >= 1 && wScale < 3) {
    return {
      name: 'x1',
      modifier: 1
    }
  }
  if (wScale >= 3 && wScale < 7) {
    return {
      name: 'x2',
      modifier: 4
    }
  }
  if (wScale >= 7 && wScale <= 10) {
    return {
      name: 'x3',
      modifier: 8
    }
  }
}

function App() {
  const stageRef = useRef(null)
  const [cells, setCells] = useState(segmented.flat(3));
  // const [scale, setScale] = useState(minScale);
  // const [position, setPosition] = useState({ x: window.innerWidth / 10, y: window.innerHeight / 10 });
  const [selected, setSelected] = useState(null)
  const [{ scale, ...position }, setStage] = useState({
    scale: 1,
    x: 0,
    y: 0
  });

  // console.log(segmented);

  const a = getXScale(scale)
  // console.table(stars, ['id']);
  // console.log(cells);
  // console.log(cells);
  // console.log(a);

  // const onWheelChange = (e) => {
  //   e.evt.preventDefault();
  //   const stage = e.target.getStage();
  //   // const visibleArea = stage?.getClientRect()
  //   const visibleArea1 = stage?.getAttrs()
  //   const c = stage?.context()

  //   const xS = visibleArea1.x / cellPX
  //   const xE = visibleArea1?.width / cellPX
  //   // console.log('Start',Math.floor(xS), Math.round(xE));
  //   console.log('Start', c);

  //   const oldScale = stage.scaleX();
  //   const mousePointTo = {
  //     x: stage.getPointerPosition().x / oldScale - stage.x() / oldScale,
  //     y: stage.getPointerPosition().y / oldScale - stage.y() / oldScale
  //   };

  //   const calcScale = e.evt.deltaY < 0 ? oldScale * scaleBy : oldScale / scaleBy;

  //   const newScale = calcScale >= maxScale ? maxScale : calcScale <= minScale ? minScale : calcScale
  //   setStage({
  //     scale: newScale,
  //     x:
  //       -(mousePointTo.x - stage.getPointerPosition().x / newScale) * newScale,
  //     y:
  //       -(mousePointTo.y - stage.getPointerPosition().y / newScale) * newScale
  //   });

  // }


  return (
    <div style={{ width: "100%", maxWidth: 1400, margin: "0 auto" }}>
      <Stage
        style={{
          margin: "0 auto"
        }}
        ref={stageRef}
        width={window.innerWidth}
        height={window.innerHeight}
        // x={position.x}
        // y={position.y}
        x={0}
        y={0}
        onWheel={(e) => {
          e.evt.preventDefault();
          const stage = e.target.getStage();


          const oldScale = stage.scaleX();
          const mousePointTo = {
            x: stage.getPointerPosition().x / oldScale - stage.x() / oldScale,
            y: stage.getPointerPosition().y / oldScale - stage.y() / oldScale
          };

          const calcScale = e.evt.deltaY < 0 ? oldScale * scaleBy : oldScale / scaleBy;

          const newScale = calcScale >= maxScale ? maxScale : calcScale <= minScale ? minScale : calcScale
          setStage({
            scale: newScale,
            x:
              -(mousePointTo.x - stage.getPointerPosition().x / newScale) * newScale,
            y:
              -(mousePointTo.y - stage.getPointerPosition().y / newScale) * newScale
          });

          // const visibleArea = stage?.getClientRect()
          const visibleArea1 = stage?.getAttrs()
          const c = stage?.position()

          const xS = visibleArea1.x / cellPX
          const xE = visibleArea1?.width / cellPX
          // console.log('Start',Math.floor(xS), Math.round(xE));
          // xStart
          const { x: visibleX1, y: visibleY1 } = stage?.position()
          const { x: visibleX2, y: visibleY2 } = {
            x: (Math.max(visibleX1, 0) + window.innerWidth) / newScale,
            y: (Math.max(visibleY1, 0) + window.innerHeight) / newScale
          }
          const xStart = Math.floor(Math.abs((visibleX1 / cellPX) / newScale))
          const cellCount = Math.round(visibleX2 / cellPX)
          const xEnd = xStart + cellCount
          console.log('Start', {
            visibleX1: visibleX1 / newScale,
            visibleY1,
            visibleX2,
            visibleY2,
            cellCount,
            xStart,
            xEnd
          });
        }}
        onClick={(e) => {
          console.log("onClick", e.target.attrs);
          setSelected(e.target.attrs)
        }}
        scaleX={scale}
        scaleY={scale}
        offset={{ x: -(cellPX + borderPX) / 4, y: -(cellPX + borderPX) / 4 }}
        draggable
      >
        <Layer

        >
          {/* <Text /> */}
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
          {segmented.map((grop) => {
            return (
              <Group>
                {grop.map((cell) => {
                  return (
                    <Rect
                      // ref={(node) => {
                      //   console.log('node',              node?.visible());
                      //   // node?.visible()
                      // }}
                      key={cell.id}
                      id={cell.id}
                      x={cell.x * (cellPX + borderPX)}
                      y={cell.y * (cellPX + borderPX)}
                      width={cellPX}
                      height={cellPX}
                      fill={cell.color}
                    />
                  )
                })}
              </Group>
            )
          })}


          {cells.map((cell) => (
            <Rect
              // ref={(node) => {
              //   console.log('node',              node?.visible());
              //   // node?.visible()
              // }}
              key={cell.id}
              id={cell.id}
              x={cell.x * (cellPX + borderPX)}
              y={cell.y * (cellPX + borderPX)}
              width={cellPX}
              height={cellPX}
              fill={cell.color}
            />
          ))}

          {
            selected && (
              <Line
                // strokeEnabled
                width={borderPX}
                strokeWidth={0.2}
                points={[
                  selected.x + 0.25, selected.y + 0.25,
                  selected.x - 0.25 + cellPX, selected.y + 0.25,
                  selected.x + cellPX - 0.25, selected.y - 0.25 + cellPX,
                  selected.x + 0.25, selected.y - 0.25 + cellPX,
                  selected.x + 0.25, selected.y + 0.15,
                ]}
                fill='#696969'
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
