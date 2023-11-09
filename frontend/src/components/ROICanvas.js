import React, { useMemo, useRef, useState, useEffect } from "react";
import { useSelector, useDispatch } from 'react-redux';
import PolygonAnnotation from "./PolygonAnnotation";
import StaticPolygon from "./StaticPolygon";
import { Stage, Layer, Image } from "react-konva";
import Konva from 'konva';
import Button from "./Button";
import LabelButton from "./LabelButton";
import useImage from 'use-image';


const wrapperStyle = {
  display: "flex",
  marginTop: 20,
  backgroundColor: "white",
};
const columnStyle = {
  display: "flex",
  flexDirection: "column",
  marginTop: 20,
  backgroundColor: "white",
};

export function ROICanvas({ save, isPixelWise }) {

  const data = useSelector((state) => state.analyze.data);
  const [imageNum, setImageNum] = useState(0);
  const [roiMode, setROIMode] = useState("Epicardium");
  const [epiROIs, setEpiROIs] = useState([...Array.from({length: data.length}, e => ({points: [], flattenedPoints: [], isPolyComplete: false}))]);
  const [endoROIs, setEndoROIs] = useState([...epiROIs]);
  const [insertions, setInsertions] = useState([...epiROIs]);
  const [selectedROIs, setSelectedROIs] = useState([...epiROIs]);
  const [roiEmpty, setROIEmpty] = useState(true);
  const imageRef = useRef(null);
  const dataRef = useRef(null);
  const [points, setPoints] = useState([]);
  const [flattenedPoints, setFlattenedPoints] = useState();
  const [position, setPosition] = useState([0, 0]);
  const [isMouseOverPoint, setMouseOverPoint] = useState(false);
  const [isPolyComplete, setPolyComplete] = useState(false);
  const [brightness, setBrightness] = useState(0);
  const [contrast, setContrast] = useState(0);
  var img = null;
  if (data && data.length > 0 && data.length > imageNum) {
    img = `/media/uploads/${data[imageNum].id}/images/${data[imageNum].image}.png`;
  }

  const ImageObj = (url) => {
    const [image] = useImage(url);
    return image;
  };

  const image = ImageObj(img);
  const size = {
    width: 650,
    height: 400,
  };

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

  const getMousePos = (stage) => {
    return [stage.getPointerPosition().x, stage.getPointerPosition().y];
  };
  //drawing begins when mousedown event fires.
  const handleMouseDown = (e) => {
    if (isPolyComplete && roiMode !== 'Insertion') return;
    const stage = e.target.getStage();
    const mousePos = getMousePos(stage);
    if (isMouseOverPoint && points.length >= 3) {
      setPolyComplete(true);
    } else if (roiMode === 'Insertion') {
      setPoints([points, mousePos]);
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

  const setROIs = (rois) => {
    switch(roiMode) {
      case ('Epicardium'):
        setEpiROIs([...rois]);
        break;
      case ('Endocardium'):
        setEndoROIs([...rois]);
        break;
      case ('Insertion'):
        setInsertions([...rois]);
        break;
    }
    setSelectedROIs([...rois]);
  }

  useEffect(() => {
    if (image) {
      imageRef.current.cache();
    }
  }, [image]);

  useEffect(() => {
    setImageNum(0);
    setPoints([]);

    setSelectedROIs([...Array.from({length: data.length}, e => ({points: [], flattenedPoints: [], isPolyComplete: false}))]);
    setEpiROIs([...Array.from({length: data.length}, e => ({points: [], flattenedPoints: [], isPolyComplete: false}))]);
    setEndoROIs([...Array.from({length: data.length}, e => ({points: [], flattenedPoints: [], isPolyComplete: false}))]);
    setInsertions([...Array.from({length: data.length}, e => ({points: [], flattenedPoints: [], isPolyComplete: false}))]);
    setROIEmpty(true);
    setPolyComplete(false);
  }, [data])

  useEffect(() => {
    const flattened = 
      points
        .concat(isPolyComplete ? [] : position)
        .reduce((a, b) => a.concat(b), []);

    setFlattenedPoints(flattened);

    var newROIs = selectedROIs;
    if (!isPixelWise && roiEmpty && isPolyComplete) {
      newROIs.fill({points: points, flattenedPoints: [...flattened], isPolyComplete: true});
      setROIEmpty(false);
    } else {
      newROIs[imageNum] = {points: points, flattenedPoints: [...flattened], isPolyComplete: isPolyComplete};
    }
    setROIs(newROIs);
    save(newROIs, roiMode);

  }, [points, isPolyComplete, position]);

  useEffect(() => {
    setPoints(
      selectedROIs[imageNum].points
    );
    setPolyComplete(
      selectedROIs[imageNum].isPolyComplete
    );
    setFlattenedPoints(
      points
        .concat(isPolyComplete ? [] : position)
        .reduce((a, b) => a.concat(b), [])
    );
  }, [imageNum]);

  useEffect(() => {
    var newROIs = selectedROIs;
    if (!isPixelWise) {
      setPoints([]);
      newROIs.fill({points: [], flattenedPoints: [], isPolyComplete: false, roiEmpty: true});
      setEpiROIs(newROIs);
      setEndoROIs(newROIs);
      setInsertions(newROIs);
      setPolyComplete(false);
    }
  }, [isPixelWise]);

  const undo = () => {
    setPoints(points.slice(0, -1));
    setPolyComplete(false);
    setPosition(points[points.length - 1]);
    // TODO: Adjust for ROI selections
  };
  const reset = () => {
    setPoints([]);
    var newROIs = selectedROIs;
    if (!isPixelWise) {
      newROIs.fill({points: [], flattenedPoints: [], isPolyComplete: false});
    } else {
      newROIs[imageNum] = {points: [], flattenedPoints: [], isPolyComplete: false};
    }
    setROIs(newROIs);
    setROIEmpty(true);
    setPolyComplete(false);
  };
  const copyPrev = () => {
    if (imageNum > 0) {
      const roi = selectedROIs[imageNum - 1];
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

  const handleModeSwitch = (mode) => {
    setROIMode(mode);
    var newROIs;
    switch(mode) {
      case ('Epicardium'):
        newROIs = [...epiROIs];
        break;
      case ('Endocardium'):
        newROIs = [...endoROIs];
        break;
      case ('Insertion'):
        newROIs = [...insertions];
        break;
    }
    setSelectedROIs(newROIs);
    setPoints(newROIs[imageNum].points);
    setPolyComplete(newROIs[imageNum].isPolyComplete);
    setROIEmpty(newROIs[imageNum].points.length < 1);
  }

  const onBrightnessChange = (e) => {
    setBrightness(e.target.value)
  }

  const onContrastChange = (e) => {
    setContrast(Number(e.target.value))
  }

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
              filters={[Konva.Filters.Brighten, Konva.Filters.Contrast]}
              brightness={brightness}
              contrast={contrast}
            />
            {roiMode == 'Epicardium' ? null : 
                <StaticPolygon
                points={epiROIs[imageNum].points}
                flattenedPoints={epiROIs[imageNum].flattenedPoints}
                isFinished={epiROIs[imageNum].isPolyComplete}
                strokeColor={'#00F1FF'}
                fillColor={'rgb(10, 242, 255, 0.5)'}
                pointFill={'#0054A8'}
                pointOnly={false}
              /> 
            }
            {roiMode == 'Endocardium' ? null : 
                <StaticPolygon
                points={endoROIs[imageNum].points}
                flattenedPoints={endoROIs[imageNum].flattenedPoints}
                isFinished={endoROIs[imageNum].isPolyComplete}
                strokeColor={'#03ff0a'}
                fillColor={'rgb(63, 255, 10, 0.5)'}
                pointFill={'#1e7d04'}
                pointOnly={false}
              /> 
            }
            {roiMode == 'Insertion' ? null : 
                <StaticPolygon
                points={insertions[imageNum].points}
                flattenedPoints={insertions[imageNum].flattenedPoints}
                isFinished={insertions[imageNum].isPolyComplete}
                strokeColor={'#b14aff'}
                fillColor={null}
                pointFill={'#6400b0'}
                pointOnly={true}
              /> 
            }
            <PolygonAnnotation
              points={points}
              flattenedPoints={flattenedPoints}
              handlePointDragMove={handlePointDragMove}
              handleGroupDragEnd={handleGroupDragEnd}
              handleMouseOverStartPoint={handleMouseOverStartPoint}
              handleMouseOutStartPoint={handleMouseOutStartPoint}
              isFinished={isPolyComplete}
              strokeColor={roiMode == 'Epicardium' ? '#00F1FF' : (roiMode == 'Endocardium' ? '#03ff0a' : '#b14aff')}
              fillColor={roiMode == 'Epicardium' ? 'rgb(10, 242, 255, 0.5)' : (roiMode == 'Endocardium' ? 'rgb(63, 255, 10, 0.5)' : null)}
              pointFill={roiMode == 'Epicardium' ? '#0054A8' : (roiMode == 'Endocardium' ? '#1e7d04' : '#6400b0')}
              pointOnly={roiMode === 'Insertion'}
            />
          </Layer>
        </Stage>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between", 
            alignItems: "center",
            padding: "20px 0",
            width: "100%",
          }}
        >
          <Button name="Previous" onClick={() => prevImage()}/>
            <p>{`${imageNum + 1} / ${data.length}`}</p>
          <Button name="Next" onClick={() => nextImage()}/>
        </div>
      </div>
      <div>
        <LabelButton name="Epicardium" color="blue" selected={roiMode == "Epicardium"} onClick={() => handleModeSwitch("Epicardium")}/>
        <LabelButton name="Endocardium" color="green" selected={roiMode == "Endocardium"} onClick={() => handleModeSwitch("Endocardium")}/>
        {isPixelWise ? <div/> : <LabelButton name="Insertion Point" color="purple" selected={roiMode == "Insertion"} onClick={() => handleModeSwitch("Insertion")}/>}
        
        <Button name="Undo" onClick={undo} style={{margin: "50px 10px 10px 30px"}}/>
        <Button name="Reset" onClick={reset} style={{margin: "10px 10px 10px 30px"}}/>
        {isPixelWise ? <Button name="Copy Previous" onClick={copyPrev} style={{margin: "10px 10px 10px 30px"}}/> : <div/>}
        <div>
          <input type="range" id="brightness" name="brightness" min="-0.5" max="0.5" step="0.01" value={brightness} onChange={onBrightnessChange} style={{margin: "50px 10px 0px 30px"}}/>
          <label for="brightness" style={{margin: "0px 10px 10px 30px"}}>Brightness</label>
          <input type="range" id="contrast" name="contrast" min="-100" max="100" step="1" value={contrast} onChange={onContrastChange} style={{margin: "10px 10px 0px 30px"}}/>
          <label for="contrast" style={{margin: "0px 10px 10px 30px"}}>Contrast</label>
        </div>
      </div>
      </div>
    </div>
  );
};
