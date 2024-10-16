import React, { useMemo, useRef, useState, useEffect } from "react";
import { useSelector, useDispatch } from 'react-redux';
import PolygonAnnotation from "./PolygonAnnotation";
import StaticPolygon from "./StaticPolygon";
import { Stage, Layer, Image } from "react-konva";
import Konva from 'konva';
import Button from "./Button";
import LabelButton from "./LabelButton";
import useImage from 'use-image';
import cmap from 'colormap';


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

const colorScheme = {
  Epicardium: {stroke: "#ED6A5A", fill: "#F5ADA3"},
  Endocardium: {stroke: "#FFC15E", fill: "#FFE8C2"},
  ARV: {stroke: "#06BCC1", fill: "#74F6FB"},
  IRV: {stroke: "#228B22", fill: "#9CE79C"}
}

export function ROICanvas({ save, isPixelWise }) {

  const data = useSelector((state) => state.analyze.data);
  const height = useSelector((state) => state.analyze.height);
  const width = useSelector((state) => state.analyze.width);
  const levels = useSelector((state) => state.analyze.levels);
  const [imageNum, setImageNum] = useState(0);
  const [roiMode, setROIMode] = useState("Epicardium");
  const [epiROIs, setEpiROIs] = useState([...Array.from({length: data.length}, e => ({points: [], flattenedPoints: [], isPolyComplete: false}))]);
  const [endoROIs, setEndoROIs] = useState([...epiROIs]);
  const [arvs, setARVs] = useState([...epiROIs]);
  const [irvs, setIRVs] = useState([...epiROIs]);
  const [selectedROIs, setSelectedROIs] = useState([...epiROIs]);
  const [roiEmpty, setROIEmpty] = useState(true);
  const imageRef = useRef(null);
  const layerRef = useRef(null);
  const stageRef = useRef(null);
  const [scale, setScale] = useState({ x: 1, y: 1 });
  const [stagePos, setStagePos] = useState({ x: 0, y: 0 });
  const [points, setPoints] = useState([]);
  const [flattenedPoints, setFlattenedPoints] = useState();
  const [position, setPosition] = useState([0, 0]);
  const [isMouseOverPoint, setMouseOverPoint] = useState(false);
  const [isPolyComplete, setPolyComplete] = useState(false);
  const [windowLevel, setWindowLevel] = useState(levels[0][0]);
  const [windowWidth, setWindowWidth] = useState(levels[0][1]);
  var img = null;
  if (data && data.length > 0 && data.length > imageNum) {
    img = `/media/uploads/${data[imageNum].id}/images/${data[imageNum].image}.png`;
  }

  const initialWL = windowLevel;
  const initialWW = windowWidth;

  const ImageObj = (url) => {
    const [image] = useImage(url);
    return image;
  };

  const image = ImageObj(img);
  const size = {
    width: width * 4,
    height: height * 4,
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
    if (isPolyComplete && (roiMode !== 'ARV' && roiMode !== 'IRV')) return;
    const stage = e.target.getStage();
    const mousePos = getMousePos(stage);
    if (isMouseOverPoint && points.length >= 3) {
      setPolyComplete(true);
    } else if (roiMode === 'ARV' || roiMode === 'IRV') {
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

  const handleDblClick = (e) => {
    e.evt.preventDefault();

    const stage = e.currentTarget;
    var oldScale = scale.x;
    var pointer = stage.getPointerPosition();

    var mousePointTo = {
      x: (pointer.x - stageRef.current.x()),
      y: (pointer.y - stageRef.current.y()),
    };

    var direction = e.evt.deltaY > 0 ? 1 : -1;
    if (e.evt.ctrlKey) {
      direction = -direction;
    }

    var newScale = scale.x + e.evt.deltaY * -0.01;
    if (newScale < 1 || newScale > 2) {
      return;
    }

    setScale({ x: newScale, y: newScale });
    var newPos = {
      x: pointer.x - mousePointTo.x * newScale,
      y: pointer.y - mousePointTo.y * newScale,
    };
    setStagePos(newPos);
    if (points) {
      const pointScale = newScale / oldScale;
      var newPoints = points.map(coord => [
        (coord[0] * pointScale) + ((pointer.x - mousePointTo.x) / pointScale), 
        (coord[1] * pointScale) + ((pointer.y - mousePointTo.y) / pointScale)
      ]);
      setPoints(newPoints);
    }
  };

  const setROIs = (rois) => {
    switch(roiMode) {
      case ('Epicardium'):
        setEpiROIs([...rois]);
        break;
      case ('Endocardium'):
        setEndoROIs([...rois]);
        break;
      case ('ARV'):
        setARVs([...rois]);
        break;
      case ('IRV'):
        setIRVs([...rois]);
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
    setARVs([...Array.from({length: data.length}, e => ({points: [], flattenedPoints: [], isPolyComplete: false}))]);
    setIRVs([...Array.from({length: data.length}, e => ({points: [], flattenedPoints: [], isPolyComplete: false}))]);
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
      setARVs(newROIs);
      setIRVs(newROIs);
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
  };

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
      case ('ARV'):
        newROIs = [...arvs];
        break;
      case ('IRV'):
        newROIs = [...irvs];
        break;
    }
    setSelectedROIs(newROIs);
    setPoints(newROIs[imageNum].points);
    setPolyComplete(newROIs[imageNum].isPolyComplete);
    setROIEmpty(newROIs[imageNum].points.length < 1);
  }

  const onLevelChange = (e) => {
    setWindowLevel(e.target.value)
  }

  const onWidthChange = (e) => {
    setWindowWidth(Number(e.target.value))
  }

  const convertPixel = (vmin, vmax, value) => {
    const vmin0 = initialWL - initialWW/2;
    const vmax0 = initialWL + initialWW/2;
    const vminScale = (vmax - vmin) / (vmax - vmin0);
    const vmaxScale = vmax / vmax0;

    const pminScale = vminScale*255 - 255;
    const pmaxScale = vmaxScale*255;

    var newValue = (255/((vmax-vmin)) * value) + vmax;

    if (newValue < 0) {
      newValue = 0;
    } else if (newValue > 255) {
      newValue = 255;
    }
    return newValue;
  }

  var colorMap = function (imageData) {
    //image.clearCache();
    var nPixels = imageData.data.length;
    var vmin = windowLevel - windowWidth/2;
    var vmax = windowLevel + windowWidth/2;
    console.log(`${vmin} to ${vmax}`);
    for (var i = 0; i < nPixels; i += 4) {
      const value = convertPixel(vmin, vmax, imageData.data[i]);
      imageData.data[i]   = value;
      imageData.data[i+1] = value;
      imageData.data[i+2] = value;
      imageData.data[i+3] = 255;
    }
  };

  return (
    <div>
    <div style={wrapperStyle}>
      <div style={columnStyle}>
        <Stage
          ref={stageRef}
          width={size.width || 650}
          height={size.height || 400}
          onMouseMove={handleMouseMove}
          onMouseDown={handleMouseDown}
          // onWheel={handleDblClick}
        >
          <Layer ref={layerRef}>
            <Image
              ref={imageRef}
              image={image}
              x={0}
              y={0}
              width={size.width}
              height={size.height}
              filters={[colorMap]}
              scale={scale}
              position={stagePos}
            />
            {roiMode == 'Epicardium' ? null : 
                <StaticPolygon
                points={epiROIs[imageNum].points}
                flattenedPoints={epiROIs[imageNum].flattenedPoints}
                isFinished={epiROIs[imageNum].isPolyComplete}
                strokeColor={colorScheme['Epicardium'].stroke}
                pointFill={colorScheme['Epicardium'].fill}
                pointOnly={false}
              /> 
            }
            {roiMode == 'Endocardium' ? null : 
                <StaticPolygon
                points={endoROIs[imageNum].points}
                flattenedPoints={endoROIs[imageNum].flattenedPoints}
                isFinished={endoROIs[imageNum].isPolyComplete}
                strokeColor={colorScheme['Endocardium'].stroke}
                pointFill={colorScheme['Endocardium'].fill}
                pointOnly={false}
              /> 
            }
            {roiMode == 'ARV' ? null : 
                <StaticPolygon
                points={arvs[imageNum].points}
                flattenedPoints={arvs[imageNum].flattenedPoints}
                isFinished={arvs[imageNum].isPolyComplete}
                strokeColor={colorScheme['ARV'].stroke}
                pointFill={colorScheme['ARV'].fill}
                pointOnly={true}
              /> 
            }
            {roiMode == 'IRV' ? null : 
                <StaticPolygon
                points={irvs[imageNum].points}
                flattenedPoints={irvs[imageNum].flattenedPoints}
                isFinished={irvs[imageNum].isPolyComplete}
                strokeColor={colorScheme['IRV'].stroke}
                pointFill={colorScheme['IRV'].fill}
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
              strokeColor={colorScheme[roiMode].stroke}
              pointFill={colorScheme[roiMode].fill}
              pointOnly={roiMode === 'ARV' || roiMode === 'IRV'}
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
        <LabelButton name="Epicardium" color={colorScheme['Epicardium'].stroke} selected={roiMode == "Epicardium"} onClick={() => handleModeSwitch("Epicardium")}/>
        <LabelButton name="Endocardium" color={colorScheme['Endocardium'].stroke} selected={roiMode == "Endocardium"} onClick={() => handleModeSwitch("Endocardium")}/>
        {isPixelWise ? <div/> : <LabelButton name="ARV" color={colorScheme['ARV'].stroke} selected={roiMode == "ARV"} onClick={() => handleModeSwitch("ARV")}/>}
        {isPixelWise ? <div/> : <LabelButton name="IRV" color={colorScheme['IRV'].stroke} selected={roiMode == "IRV"} onClick={() => handleModeSwitch("IRV")}/>}
        
        <Button name="Undo" onClick={undo} style={{margin: "50px 10px 10px 30px"}}/>
        <Button name="Reset" onClick={reset} style={{margin: "10px 10px 10px 30px"}}/>
        {isPixelWise ? <Button name="Copy Previous" onClick={copyPrev} style={{margin: "10px 10px 10px 30px"}}/> : <div/>}
        <div>
          <input type="range" id="level" name="level" min="0" max="1000" step="10" value={windowLevel} onChange={onLevelChange} style={{margin: "50px 10px 0px 30px"}}/>
          <label for="level" style={{margin: "0px 10px 10px 30px"}}>WL</label>
          <input type="range" id="width" name="width" min="0" max="1000" step="10" value={windowWidth} onChange={onWidthChange} style={{margin: "10px 10px 0px 30px"}}/>
          <label for="width" style={{margin: "0px 10px 10px 30px"}}>WW</label>
        </div>
      </div>
      </div>
    </div>
  );
};
