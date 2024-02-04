import React, { useState } from "react";
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from "react-router-dom";
import CanvasJSReact from '@canvasjs/react-charts';
import SegmentNav from "../components/SegmentNav";
import LabelButton from "../components/LabelButton";
import { ImageCanvas } from "../components/ImageCanvas";
import useImage from 'use-image';

var CanvasJS = CanvasJSReact.CanvasJS;
var CanvasJSChart = CanvasJSReact.CanvasJSChart;

export function Report() {

  const dispatch = useDispatch()
  const navigate = useNavigate();
  const images = useSelector((state) => state.analyze.data);
  const height = useSelector((state) => state.analyze.height);
  const width = useSelector((state) => state.analyze.width);
  const zspec = useSelector((state) => state.report.zspec);

  const segments = [
    "Anterior", 
    "Anteroseptal", 
    "Inferoseptal", 
    "Inferior", 
    "Inferolateral", 
    "Anterolateral",
  ];

  const zspecLine = {
        type: "line",
        color: "#0054A8",
        dataPoints: zspec,
        toolTipContent: `{x} ppm, {y}`,
        showInLegend: true,
        legendText: "Image Data",
  }

  var tempData = [zspecLine];
  const [data, setData] = useState([zspecLine]);
  const [imageNum, setImageNum] = useState(0);
  const [segment, setSegment] = useState(0);

  // TODO: Add all curves
  const water = [{'x': -10.0, 'y': 0.9935720662632676}, {'x': -9.591836734693878, 'y': 0.9930182444006661}, {'x': -9.183673469387756, 'y': 0.9923898875202555}, {'x': -8.775510204081632, 'y': 0.9916730467386277}, {'x': -8.36734693877551, 'y': 0.9908503646774047}, {'x': -7.959183673469388, 'y': 0.9899000297381002}, {'x': -7.551020408163265, 'y': 0.9887943380814882}, {'x': -7.142857142857142, 'y': 0.9874976867255453}, {'x': -6.73469387755102, 'y': 0.9859637271244364}, {'x': -6.326530612244898, 'y': 0.9841312559022757}, 
  {'x': -5.918367346938775, 'y': 0.9819181656627518}, {'x': -5.5102040816326525, 'y': 0.9792123461867296}, {'x': -5.1020408163265305, 'y': 0.9758576679797799}, {'x': -4.6938775510204085, 'y': 0.9716318098284961}, {'x': -4.285714285714286, 'y': 0.9662101331290106}, {'x': -3.8775510204081627, 'y': 0.9591048555637418}, {'x': -3.4693877551020407, 'y': 0.9495588398826253}, {'x': -3.0612244897959187, 'y': 0.936352624544842}, {'x': -2.6530612244897958, 'y': 0.9174389128890129}, {'x': -2.244897959183673, 'y': 0.8892225669126175}, {'x': -1.8367346938775508, 'y': 0.845109265381824}, {'x': -1.4285714285714288, 'y': 0.7726966855179326}, {'x': -1.020408163265305, 'y': 0.6499629905440273}, {'x': -0.612244897959183, 'y': 0.4530924736625641}, {'x': -0.204081632653061, 'y': 0.23912343934155234}, {'x': 0.204081632653061, 'y': 0.23912343934155234}, {'x': 0.612244897959183, 'y': 0.4530924736625641}, {'x': 1.0204081632653068, 'y': 0.649962990544028}, {'x': 1.4285714285714288, 'y': 0.7726966855179326}, {'x': 1.8367346938775508, 'y': 0.845109265381824}, {'x': 2.2448979591836746, 'y': 0.8892225669126176}, {'x': 2.6530612244897966, 'y': 0.917438912889013}, {'x': 3.0612244897959187, 'y': 0.936352624544842}, {'x': 3.4693877551020407, 'y': 0.9495588398826253}, {'x': 3.8775510204081627, 'y': 0.9591048555637418}, {'x': 4.2857142857142865, 'y': 0.9662101331290106}, {'x': 4.6938775510204085, 'y': 0.9716318098284961}, {'x': 5.1020408163265305, 'y': 0.9758576679797799}, {'x': 5.510204081632654, 'y': 0.9792123461867296}, {'x': 5.918367346938776, 'y': 0.9819181656627518}, {'x': 6.326530612244898, 'y': 0.9841312559022757}, {'x': 6.73469387755102, 'y': 0.9859637271244364}, {'x': 7.142857142857142, 'y': 0.9874976867255453}, {'x': 7.551020408163264, 'y': 0.9887943380814882}, {'x': 7.95918367346939, 'y': 0.9899000297381002}, {'x': 8.367346938775512, 'y': 0.9908503646774047}, {'x': 8.775510204081634, 'y': 0.9916730467386277}, {'x': 9.183673469387756, 'y': 0.9923898875202555}, {'x': 9.591836734693878, 'y': 0.9930182444006661}, {'x': 10.0, 'y': 0.9935720662632676}]
  const amide = []

  var img = null;
  if (images && images.length > 0 && images.length > imageNum) {
    img = `/media/uploads/${images[imageNum].id}/images/${images[imageNum].image}.png`;
  }

  const ImageObj = (url) => {
    const [image] = useImage(url);
    return image;
  };

  const image = ImageObj(img);
  const size = {
    width: width,
    height: height,
  };
  
  const handlePageChange = (page) => {
    navigate(`/${page}`);
  };

  const initialVisibility = {
    amide: false,
    creatine: false,
    mt: false,
    noe: false,
    water: false
  };
  const [visibleMolecules, setVisibleMolecules] = useState(initialVisibility);

  const toggleMolecule = (name, datapoints, color) => {
    const capitalize = (str) => {return str.slice(0,1).toUpperCase() + str.slice(1)}
    if (!visibleMolecules[name]) {
        tempData = [... data]
        tempData.push({
            type: "line",
            color: color,
            dataPoints: datapoints,
            markerType: null,
            toolTipContent: null,
            showInLegend: true,
            legendText: capitalize(name),
        });
    } else {
        tempData = data.filter(item => item.color != color);
    }
    setData(tempData);
    var newVisibility = visibleMolecules;
    newVisibility[name] = !newVisibility[name];
    setVisibleMolecules(newVisibility);
  };

  function getOptions(title, subtitle, data, axisX, axisY) {
    return {
      theme: "light2",
      animationEnabled: true,
      exportEnabled: true,
      zoomEnabled: true,
      title: { text: title, fontFamily: "proxima-nova, sans-serif", fontSize: 20},
      subtitles: [{ text: subtitle, fontFamily: "proxima-nova, sans-serif"}],
      axisX:{ 
          title: axisX,
          titleFontFamily: "proxima-nova, sans-serif",
          titleFontSize: 16,
          labelFontFamily: "proxima-nova, sans-serif",
      },
      axisY:{ 
          title: axisY,
          titleFontFamily: "proxima-nova, sans-serif",
          titleFontSize: 16,
          labelFontFamily: "proxima-nova, sans-serif",
      },
      legend: {
          fontFamily: "proxima-nova, sans-serif"
      },
      data: data,
  
      toolTip:{
          fontFamily: "proxima-nova, sans-serif",
        },
  
      toolbar: {
          itemBackgroundColor: "#d5dee9",
          itemBackgroundColorOnHover: "#0054A8",
          buttonBorderColor: null
        },
    }
  }

  const lorDiff = {
    theme: "light2",
    animationEnabled: true,
    exportEnabled: true,
    zoomEnabled: true,
    title: { text: "Lorentzian Difference", fontFamily: "proxima-nova, sans-serif", fontSize: 20},
    subtitles: [{ text: "Basal Anterior Segment", fontFamily: "proxima-nova, sans-serif"}],
    axisX:{ 
        title:"Offset (ppm)",
        titleFontFamily: "proxima-nova, sans-serif",
        titleFontSize: 16,
        labelFontFamily: "proxima-nova, sans-serif",
    },
    axisY:{ 
        title:"CEST Contrast (%)",
        titleFontFamily: "proxima-nova, sans-serif",
        titleFontSize: 16,
        labelFontFamily: "proxima-nova, sans-serif",
    },
    legend: {
        fontFamily: "proxima-nova, sans-serif"
    },
    data: data,
    toolTip:{
        fontFamily: "proxima-nova, sans-serif",
      },

    toolbar: {
        itemBackgroundColor: "#d5dee9",
        itemBackgroundColorOnHover: "#0054A8",
        buttonBorderColor: null
      },
  }

  function handleSegmentChange(seg) {
    setSegment(seg);
  }


  function renderGraph(type) {
    var subtitle, axisX, axisY, legendClass;
    if (type === "zspec") {
      subtitle = "Z-Spectra"
      axisX = "Offset (ppm)";
      axisY = "Normalized Signal Intensity";
      legendClass = "molecule-label";
    } else if (type === "lor") {
      subtitle = "Lorentzian Difference"
      axisX = "Offset (ppm)";
      axisY = "CEST Contrast (%)";
      legendClass = "legend-label";
    }

    if (segment === 6) {
      return (
        <div className="graph-container">
          <div className="graph-grid">
            {segments.map(s =>
              <div className="grouped-zspec">
                <CanvasJSChart 
                  options={getOptions(s, subtitle, data, axisX, axisY)} 
                />
              </div>
            )}
          </div>
          <div className="molecules">
              <LabelButton name="Amide" color="#E83151" selected={visibleMolecules.amide} className={legendClass} onClick={() => toggleMolecule("amide", amide, "#E83151")}/>
              <LabelButton name="Creatine" color="#F0A202" selected={false} className={legendClass} />
              <LabelButton name="MT" color="#BED558" selected={false} className={legendClass} />
              <LabelButton name="NOE" color="#5E3BC6" selected={false} className={legendClass} />
              <LabelButton name="Water" color="#41ccc3" selected={visibleMolecules.water} className={legendClass} onClick={() => toggleMolecule("water", water, "#41ccc3")} />
              {legendClass === "molecule-label" ? <p className="report-edit-label">+ Add Molecule</p> : <div/>}
          </div>
        </div>
      );
    } else {
      return(
        <div className="graph-container">
            <div className="zspec">
              <CanvasJSChart 
                options={getOptions(segments[segment], subtitle, data, axisX, axisY)}  
              />
            </div>
          <div className="molecules">
              <LabelButton name="Amide" color="#E83151" selected={visibleMolecules.amide} className={legendClass} onClick={() => toggleMolecule("amide", amide, "#E83151")}/>
              <LabelButton name="Creatine" color="#F0A202" selected={false} className={legendClass} />
              <LabelButton name="MT" color="#BED558" selected={false} className={legendClass} />
              <LabelButton name="NOE" color="#5E3BC6" selected={false} className={legendClass} />
              <LabelButton name="Water" color="#41ccc3" selected={visibleMolecules.water} className={legendClass} onClick={() => toggleMolecule("water", water, "#41ccc3")} />
              {legendClass === "molecule-label" ? <p className="report-edit-label">+ Add Molecule</p> : <div/>}
          </div>
        </div>
      );
    }
  }
  
  return(
    <main>
        <header>
            <h2 onClick={() => handlePageChange('')}>Vandsburger Lab</h2>
            <p className="header-subtitle">University of California, Berkeley</p>
        </header>
        <div className="page-container report-page">
            <h3>Data Analysis Results</h3>
            <div className="zspec-container">
                <div style={{display:'flex', flexDirection:'column'}}>
                    <SegmentNav active={segment} handleSegmentChange={handleSegmentChange}/>
                </div>
                <div style={{display:'flex', flexDirection:'column', rowGap:'50px'}}>
                  {renderGraph("zspec")}
                  {segment == 6 ? <br/> : <div/>}
                  {renderGraph("lor")}
                  <div className="stats-container">
                    <h4 className="stats-heading">Statistics</h4>
                    <p>Insert statistics here</p>
                  </div>
                  <ImageCanvas />
              </div>
            </div>
        </div>
      </main>
    );
  }