import { useRef, useState } from "react";
import "./App.css";

import { Stage, Layer, Rect, Line, Group, Image } from "react-konva";
import useImage from "use-image";

const cellPX = 100;
const borderPX = 0;
// const boardSize = 100;
const scaleBy = 1;

const maxScale = 10;
const minScale = 1;

type Cell = {
  id: string; // [x]-[y],
  x: number;
  y: number;
  color: string;
};

// const segments = [
//   //
//   { x1: 0, y1: 0, x2: 10, y2: 10, color: "red" },
//   { x1: 10, y1: 0, x2: 20, y2: 10, color: "green" },
//   { x1: 20, y1: 0, x2: 30, y2: 10, color: "blue" },
//   { x1: 30, y1: 0, x2: 40, y2: 10, color: "black" },
//   { x1: 40, y1: 0, x2: 50, y2: 10, color: "red" },
//   //
//   { x1: 0, y1: 10, x2: 10, y2: 20, color: "blue" },
//   { x1: 10, y1: 10, x2: 20, y2: 20, color: "yellow" },
//   { x1: 20, y1: 10, x2: 30, y2: 20, color: "red" },
//   { x1: 30, y1: 10, x2: 40, y2: 20, color: "blue" },
//   { x1: 40, y1: 10, x2: 50, y2: 20, color: "yellow" },
//   //
//   { x1: 0, y1: 20, x2: 10, y2: 30, color: "red" },
//   { x1: 10, y1: 20, x2: 20, y2: 30, color: "blue" },
//   { x1: 20, y1: 20, x2: 30, y2: 30, color: "yellow" },
//   { x1: 30, y1: 20, x2: 40, y2: 30, color: "red" },
//   { x1: 40, y1: 20, x2: 50, y2: 30, color: "green" },
//   //
//   { x1: 0, y1: 30, x2: 10, y2: 40, color: "blue" },
//   { x1: 10, y1: 30, x2: 20, y2: 40, color: "yellow" },
//   { x1: 20, y1: 30, x2: 30, y2: 40, color: "red" },
//   { x1: 30, y1: 30, x2: 40, y2: 40, color: "blue" },
//   { x1: 40, y1: 30, x2: 50, y2: 40, color: "red" },
//   //
//   { x1: 0, y1: 40, x2: 10, y2: 50, color: "red" },
//   { x1: 10, y1: 40, x2: 20, y2: 50, color: "green" },
//   { x1: 20, y1: 40, x2: 30, y2: 50, color: "blue" },
//   { x1: 30, y1: 40, x2: 40, y2: 50, color: "yellow" },
//   { x1: 40, y1: 40, x2: 50, y2: 50, color: "green" },
// ];

// const generateShapes = (xStart, yStart) => {
//   // const size = boardSize

//   // const board = {};
//   // for (let x = 0; x < size; x++) {
//   //   for (let y = 0; y < size; y++) {
//   //     const key = `${x}-${y}`
//   //     board[key] = {
//   //       id: key,
//   //       x,
//   //       y,
//   //     };
//   //   }
//   // }
//   // [][][][][]
//   // [][][][][]
//   // [][][][][]
//   // [][][][][]
//   // [][][][][]
//   //
//   const s = segments.map((v) => {
//     // console.log(v);

//     const board = {};
//     for (let x = v.x1; x < v.x2; x++) {
//       for (let y = v.y1; y < v.y2; y++) {
//         const key = `${x}-${y}`;
//         board[key] = {
//           id: key,
//           x,
//           y,
//           color: v.color,
//         };
//       }
//     }

//     return Object.values(board);
//   });
//   // console.log(s);
//   return {
//     // full: Object.values(board),
//     full: [],
//     segments: s,
//   };
// };

// const { full: INITIAL_STATE, segments: segmented } = generateShapes();

// const getXScale = (wScale) => {
//   if (wScale >= 1 && wScale < 3) {
//     return {
//       name: "x1",
//       modifier: 1,
//     };
//   }
//   if (wScale >= 3 && wScale < 7) {
//     return {
//       name: "x2",
//       modifier: 4,
//     };
//   }
//   if (wScale >= 7 && wScale <= 10) {
//     return {
//       name: "x3",
//       modifier: 8,
//     };
//   }
// };

const Cell = ({ cell }) => {
  const [image] = useImage(cell.image);
  return (
    <Group>
      {cell.image ? (
        <Image
          key={`${cell.id}-img`}
          id={`${cell.id}-img`}
          x={cell.x * (cellPX + borderPX)}
          y={cell.y * (cellPX + borderPX)}
          width={cellPX}
          height={cellPX}
          image={image}
        />
      ) : (
        <Rect
          key={cell.id}
          id={cell.id}
          x={cell.x * (cellPX + borderPX)}
          y={cell.y * (cellPX + borderPX)}
          width={cellPX}
          height={cellPX}
          fill={cell.color}
        />
      )}
    </Group>
  );
};

function App() {
  const stageRef = useRef(null);
  // const [cells, setCells] = useState(segmented.flat(3));
  const [visibleSegment, setVisibleSegment] = useState(["0-0", "40-30"]);
  // const [scale, setScale] = useState(minScale);
  const [selected, setSelected] = useState(null);
  const [{ scale, ...position }, setStage] = useState({
    scale: 1,
    x: 0,
    y: 0,
  });

  const windowArea = {
    // width: window.screen.availWidth,
    // height: window.screen.availHeight,
    width: window.innerWidth,
    height: window.innerHeight,
  };

  // console.log(window.innerWidth, window.screen.availWidth);
  // console.log('visibleSegment',visibleSegment);

  const calculateVisibleArea = (stage, scale) => {
    // const visibleArea = stage?.getClientRect()
    // const stage = e.target.getStage();
    // console.log('Start',Math.floor(xS), Math.round(xE));
    // xStart
    const { x: visibleX1, y: visibleY1 } = stage?.position();
    const { x: visibleX2, y: visibleY2 } = {
      x: visibleX1 + windowArea.width,
      y: visibleY1 + windowArea.height,
    };

    const xStart = Math.floor(
      Math.max(Math.abs(visibleX1 / cellPX / scale), 0)
    );

    const yStart = Math.floor(
      Math.max(Math.abs(visibleY1 / cellPX / scale), 0)
    );

    const cellCountX = Math.round(
      (visibleX2 - visibleX1) / (cellPX + borderPX) / scale
    );

    const cellCountY = Math.round(
      (visibleY2 - visibleY1) / (cellPX + borderPX) / scale
    );

    const koefMinusX = Math.floor(
      Math.abs(stage.getAbsolutePosition().x / 1000 / scale)
    );
    const koefMinusY = Math.floor(
      Math.abs(stage.getAbsolutePosition().y / 1000 / scale)
    );
    const koefPlusX = 5;
    const koefPlusY = 5;

    const xStartWithKoef = xStart > 10 ? xStart - koefMinusX : xStart;
    const yStartWithKoef = yStart > 10 ? yStart - koefMinusY : yStart;

    const xEnd = xStart + cellCountX + koefPlusX;
    const yEnd = yStart + cellCountY + koefPlusY;

    const startId = `${xStartWithKoef}-${yStartWithKoef}`;

    const endId = `${xEnd}-${yEnd}`;
    setVisibleSegment([startId, endId]);
    // console.log("dra-Start", {
    //   visibleX1,
    //   visibleY1,
    //   visibleX2,
    //   visibleY2,
    //   cellCountX,
    //   cellCountY,
    //   xStart,
    // xStartWithKoef,
    // yStartWithKoef,
    //   yStart,
    //   xEnd,
    //   yEnd,
    //   windowArea,
    //   startId,
    //   endId,
    //   koefMinusX,
    //   koefMinusY
    // });
  };

  const generateVisibleGrid = (x1, y1, x2, y2) => {
    const boardA = {};
    for (let x = x1; x < x2; x++) {
      for (let y = y1; y < y2; y++) {
        const key = `${x}-${y}`;
        boardA[key] = {
          id: key,
          x,
          y,
          color: "green",
          image: `https://fakeimg.pl/50x50/?text=${x}-${y}&font=lobster`,
        };
      }
    }

    return Object.values(boardA);
  };

  const [x1, y1] = visibleSegment[0].split("-").map((v) => Number(v));
  const [x2, y2] = visibleSegment[1].split("-").map((v) => Number(v));

  const generatedVisibleCells = generateVisibleGrid(x1, y1, x2, y2);
  // console.log(aA);

  // const stageCoords = aA[0]

  console.log(scale);
  

  return (
    <div style={{ width: "100%", maxWidth: 1400, margin: "0 auto" }}>
      <Stage
        style={{
          margin: "0 auto",
        }}
        ref={stageRef}
        width={windowArea.width}
        height={windowArea.height}
        x={position.x}
        y={position.y}
        onWheel={(e) => {
          e.evt.preventDefault();
          const stage = e.target.getStage();
          // console.log("stage", stage.getPosition());

          const oldScale = stage.scaleX();
          const mousePointTo = {
            x: stage.getPointerPosition().x / oldScale - stage.x() / oldScale,
            y: stage.getPointerPosition().y / oldScale - stage.y() / oldScale,
          };

          const calcScale =
            e.evt.deltaY < 0 ? oldScale + scaleBy : oldScale - scaleBy;

          const newScale =
            calcScale >= maxScale
              ? maxScale
              : calcScale <= minScale
              ? minScale
              : calcScale;

          setStage({
            scale: newScale,
            x:
              -(mousePointTo.x - stage.getPointerPosition().x / newScale) *
              newScale,
            y:
              -(mousePointTo.y - stage.getPointerPosition().y / newScale) *
              newScale,
          });
          calculateVisibleArea(stage, newScale);
        }}
        onDragEnd={(e) => {
          const stage = e.target.getStage();
          calculateVisibleArea(stage, scale);
        }}
        onClick={(e) => {
          console.log("onClick", e.target.attrs);
          // if (!e.target.attrs.id) return;
          setSelected(e.target.attrs);
        }}
        onTouchStart={(e) => {
          console.log("onTouch", e.target.attrs);
          // if (!e.target.attrs.id) return;
          setSelected(e.target.attrs);
        }}
        scaleX={scale}
        scaleY={scale}
        draggable
        dragBoundFunc={(v) => {
          // do not go to -x -y
          // TODO implement max x and max y
          const allowedCoords = {
            x: v.x > 0 ? 0 : v.x,
            y: v.y > 0 ? 0 : v.y,
          };
          // console.log('dragBoundFunc',allowedCoords);

          return allowedCoords;
        }}
      >
        <Layer>
          {generatedVisibleCells.map((cell) => (
            <Cell cell={cell} key={cell.id} />
            // <Group>
            //   {/* <Rect
            //     key={cell.id}
            //     id={cell.id}
            //     x={cell.x * (cellPX + borderPX)}
            //     y={cell.y * (cellPX + borderPX)}
            //     width={cellPX}
            //     height={cellPX}
            //     fill={cell.color}
            //   /> */}
            //   <Image
            //     key={`${cell.id}-img`}
            //     id={`${cell.id}-img`}
            //     x={cell.x * (cellPX + borderPX)}
            //     y={cell.y * (cellPX + borderPX)}
            //     width={cellPX}
            //     height={cellPX}
            //     image={}
            //   />
            // </Group>
          ))}

          {selected && (
            <Line
              // strokeEnabled
              width={borderPX}
              strokeWidth={5}
              points={[
                selected.x + 0.25,
                selected.y + 0.25,
                selected.x - 0.25 + cellPX,
                selected.y + 0.25,
                selected.x + cellPX - 0.25,
                selected.y - 0.25 + cellPX,
                selected.x + 0.25,
                selected.y - 0.25 + cellPX,
                selected.x + 0.25,
                selected.y + 0.15,
              ]}
              fill="#696969"
              stroke={"#000"}
            />
          )}
        </Layer>
      </Stage>
    </div>
  );
}

export default App;
