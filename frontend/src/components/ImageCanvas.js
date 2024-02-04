import React, { useMemo, useRef, useState, useEffect } from "react";
import { useSelector, useDispatch } from 'react-redux';
import { Stage, Layer, Image } from "react-konva";
import Button from "./Button";
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

const colorScheme = {
  Epicardium: {stroke: "#ED6A5A", fill: "#F5ADA3"},
  Endocardium: {stroke: "#FFC15E", fill: "#FFE8C2"},
  ARV: {stroke: "#06BCC1", fill: "#74F6FB"},
  IRV: {stroke: "#228B22", fill: "#9CE79C"}
}

export function ImageCanvas() {

  const data = useSelector((state) => state.analyze.data);
  const height = useSelector((state) => state.analyze.height);
  const width = useSelector((state) => state.analyze.width);
  const [gallery, setGallery] = useState(true);
  const [imageNum, setImageNum] = useState(0);
  const imageRef = useRef(null);
  const layerRef = useRef(null);
  const stageRef = useRef(null);
  const [scale, setScale] = useState({ x: 1, y: 1 });
  const [stagePos, setStagePos] = useState({ x: 0, y: 0 });
  const [position, setPosition] = useState([0, 0]);
  const [isMouseOverPoint, setMouseOverPoint] = useState(false);
  const [isPolyComplete, setPolyComplete] = useState(false);

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
    width: width * 4,
    height: height * 4,
  };

  const handleImageClick = (i) => {
    setGallery(false);
    setImageNum(i);
  }

  const renderGallery = () => {
    return(
      <div>
        <div style={{display:"flex"}}>
          <h4 className="stats-heading">Images</h4>
          <div className="button open-button" 
            style={{margin: "2px 0 0 20px", height:"fit-content"}}
            onClick={() => handleGalleryChange()}
            >{"Scroll View"}
          </div>
        </div>
        <div className="img-gallery">
          {data.map((d,i) => 
            <img 
              src={`/media/uploads/${d.id}/images/${d.image}.png`}
              onClick={() => handleImageClick(i)}
              width="100px"
              className="img-gallery-item"
            />)}
        </div>
      </div>
    );
  }

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

  const handleZoom = (e) => {
    e.evt.preventDefault();

    const stage = e.currentTarget;
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
    }

  useEffect(() => {
    if (image && imageNum > 0) {
      imageRef.current.cache();
    }
  }, [image]);

  const handleGalleryChange = () => {
    if (gallery) {
      setImageNum(0);
    }
    setGallery(!gallery);
  }

  if (gallery) {
    return renderGallery();
  } else {
    return (
      <div>
        <div style={{display:"flex"}}>
          <h4 className="stats-heading">Images</h4>
          <div className="button open-button" 
            style={{margin: "2px 0 0 20px", height:"fit-content"}}
            onClick={() => handleGalleryChange()}
            >{"Gallery View"}
          </div>
        </div>
        <div style={wrapperStyle}>
          <div style={columnStyle}>
            <Stage
              ref={stageRef}
              width={size.width || 650}
              height={size.height || 400}
              onWheel={handleZoom}
            >
              <Layer ref={layerRef}>
                <Image
                  ref={imageRef}
                  image={image}
                  x={0}
                  y={0}
                  width={size.width}
                  height={size.height}
                  scale={scale}
                  position={stagePos}
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
        </div>
      </div>
    );
  };
  }
