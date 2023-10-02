import React, { useMemo, useRef, useState, useEffect } from "react";
import { useSelector, useDispatch } from 'react-redux';
import PolygonAnnotation from "../components/PolygonAnnotation";
import { Stage, Layer, Image } from "react-konva";
import Konva from 'konva';
import Button from "../components/Button";


const wrapperStyle = {
  display: "flex",
  justifyContent: "center",
  marginTop: 20,
  backgroundColor: "aliceblue",
};
const columnStyle = {
  display: "flex",
  justifyContent: "center",
  flexDirection: "column",
  alignItems: "center",
  marginTop: 20,
  backgroundColor: "aliceblue",
};

export function ROICanvas() {

  const data = useSelector((state) => state.analyze.data);
  const [imageNum, setImageNum] = useState(0);
  const [rois, setROIs] = useState(Array(37).fill({points: [], isPolyComplete: false}));
  const [image, setImage] = useState();
  const imageRef = useRef(null);
  const dataRef = useRef(null);
  const [points, setPoints] = useState([]);
  const [size, setSize] = useState({});
  const [flattenedPoints, setFlattenedPoints] = useState();
  const [position, setPosition] = useState([0, 0]);
  const [isMouseOverPoint, setMouseOverPoint] = useState(false);
  const [isPolyComplete, setPolyComplete] = useState(false);
  var img;
  data.length > 0 ? img = `/media/uploads/${data[imageNum].id}/images/${data[imageNum].image}.png` : img = null
  const videoElement = useMemo(() => {
    const element = new window.Image();
    element.width = 650;
    element.height = 400;
    element.src = img;
    return element;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [img]); //it may come from redux so it may be dependency that's why I left it as dependecny...

  const prevImage = () => {
    if (imageNum > 0) {
      setImageNum(imageNum - 1);
    }
  };

  const nextImage = () => {
    if (imageNum < data.length - 1) {
      setImageNum(imageNum + 1);
    }
  };

  useEffect(() => {
    const onload = function () {
      setSize({
        width: videoElement.width,
        height: videoElement.height,
      });
      setImage(videoElement);
      imageRef.current = videoElement;
    };
    videoElement.addEventListener("load", onload);
    return () => {
      videoElement.removeEventListener("load", onload);
    };
  }, [videoElement]);
  const getMousePos = (stage) => {
    return [stage.getPointerPosition().x, stage.getPointerPosition().y];
  };
  //drawing begins when mousedown event fires.
  const handleMouseDown = (e) => {
    if (isPolyComplete) return;
    const stage = e.target.getStage();
    const mousePos = getMousePos(stage);
    if (isMouseOverPoint && points.length >= 3) {
      setPolyComplete(true);
    } else {
      setPoints([...points, mousePos]);
    }
  };
  const handleMouseMove = (e) => {
    const stage = e.target.getStage();
    const mousePos = getMousePos(stage);
    setPosition(mousePos);
  };
  const handleMouseOverStartPoint = (e) => {
    if (isPolyComplete || points.length < 3) return;
    e.target.scale({ x: 3, y: 3 });
    setMouseOverPoint(true);
  };
  const handleMouseOutStartPoint = (e) => {
    e.target.scale({ x: 1, y: 1 });
    setMouseOverPoint(false);
  };
  const handlePointDragMove = (e) => {
    const stage = e.target.getStage();
    const index = e.target.index - 1;
    const pos = [e.target._lastPos.x, e.target._lastPos.y];
    if (pos[0] < 0) pos[0] = 0;
    if (pos[1] < 0) pos[1] = 0;
    if (pos[0] > stage.width()) pos[0] = stage.width();
    if (pos[1] > stage.height()) pos[1] = stage.height();
    setPoints([...points.slice(0, index), pos, ...points.slice(index + 1)]);
  };

  useEffect(() => {
    setFlattenedPoints(
      points
        .concat(isPolyComplete ? [] : position)
        .reduce((a, b) => a.concat(b), [])
    );
    var newROIs = rois;
    newROIs[imageNum] = {points: points, isPolyComplete: isPolyComplete};
    setROIs(
      newROIs
    );
  }, [points, isPolyComplete, position]);

  useEffect(() => {
    setPoints(
      rois[imageNum].points
    );
    setPolyComplete(
      rois[imageNum].isPolyComplete
    );
    setFlattenedPoints(
      points
        .concat(isPolyComplete ? [] : position)
        .reduce((a, b) => a.concat(b), [])
    );
  }, [imageNum]);

  const undo = () => {
    setPoints(points.slice(0, -1));
    setPolyComplete(false);
    setPosition(points[points.length - 1]);
  };
  const reset = () => {
    setPoints([]);
    var newROIs = rois;
    newROIs[imageNum] = [];
    setROIs(newROIs);
    setPolyComplete(false);
  };
  const copyPrev = () => {
    if (imageNum > 0) {
      const roi = rois[imageNum - 1]
      setPoints(roi.points);
      setPolyComplete(roi.isPolyComplete);
    }
  }

  const handleGroupDragEnd = (e) => {
    //drag end listens other children circles' drag end event
    //...that's, why 'name' attr is added, see in polygon annotation part
    if (e.target.name() === "polygon") {
      let result = [];
      let copyPoints = [...points];
      copyPoints.map((point) =>
        result.push([point[0] + e.target.x(), point[1] + e.target.y()])
      );
      e.target.position({ x: 0, y: 0 }); //needs for mouse position otherwise when click undo you will see that mouse click position is not normal:)
      setPoints(result);
    }
  };

  //imageRef.cache();
  //imageRef.filters([Konva.Filters.Brighten]);
  //imageRef.brightness(0.5);

  return (
    <div>
    <div style={wrapperStyle}>
      <div style={columnStyle}>
        <Stage
          width={size.width || 650}
          height={size.height || 400}
          onMouseMove={handleMouseMove}
          onMouseDown={handleMouseDown}
        >
          <Layer>
            <Image
              ref={imageRef}
              image={image}
              x={0}
              y={0}
              width={size.width}
              height={size.height}
              filters={[Konva.Filters.Brighten]}
              brightness={0.1}
            />
            <PolygonAnnotation
              points={points}
              flattenedPoints={flattenedPoints}
              handlePointDragMove={handlePointDragMove}
              handleGroupDragEnd={handleGroupDragEnd}
              handleMouseOverStartPoint={handleMouseOverStartPoint}
              handleMouseOutStartPoint={handleMouseOutStartPoint}
              isFinished={isPolyComplete}
            />
          </Layer>
        </Stage>
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            padding: "20px",
            gap: "10px"
          }}
        >
          <Button name="Undo" onClick={undo} style={{margin: "20 5 20 20"}}/>
          <Button name="Copy Previous" onClick={copyPrev} style={{margin: "20 5"}}/>
          <Button name="Reset" onClick={reset} style={{margin: "20 5"}}/>
        </div>
      </div>
      </div>
      <div 
        style={{
          display: "flex", 
          justifyContent: "space-between", 
          alignItems: "center",
          marginTop: "20px"}}>
        <Button name="Previous" onClick={() => prevImage()}/>
        <p>{`${imageNum + 1} / ${data.length}`}</p>
        <Button name="Next" onClick={() => nextImage()}/>
      </div>
    </div>
  );
};
