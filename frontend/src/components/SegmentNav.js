import React from "react";

const SegmentNav = ({ active, handleSegmentChange }) => {
  const segments = [
    "Anterior", 
    "Anteroseptal", 
    "Inferoseptal", 
    "Inferior", 
    "Inferolateral", 
    "Anterolateral",
    "All"
  ];

  function onMouseOver(seg) {
    const label = document.getElementById('seg-label');
    label.innerHTML = segments[seg];
  }

  function onMouseOut() {
    const label = document.getElementById('seg-label');
    label.innerHTML = segments[active];
  }

  return (
    <div style={{display:"flex", flexDirection:"column", alignItems:"center"}}>
      <svg 
          id="segNav" 
          viewBox="0 0 434 434"
          className="segment-nav">
          <defs>
          </defs>
          <g id="segNavG">
              <path className={"segment" + (active == 1 ? " active-segment" : "")} onClick={() => handleSegmentChange(1)} onMouseEnter={() => onMouseOver(1)} onMouseLeave={() => onMouseOut()} d="M166.28,120.78c-31.49,16.54-53.83,48.13-57.46,85.22H.27C4.13,128.84,48.28,62.29,112.12,26.99l54.16,93.79Z"/>
              <path className={"segment" + (active == 2 ? " active-segment" : "")} onClick={() => handleSegmentChange(2)} onMouseEnter={() => onMouseOver(2)} onMouseLeave={() => onMouseOut()} d="M163.67,311.2l-54.4,94.21C43.98,368.01,0,297.64,0,217H108.29c.11,40.46,22.41,75.71,55.38,94.2Z"/>
              <path className={"segment" + (active == 3 ? " active-segment" : "")} onClick={() => handleSegmentChange(3)} onMouseEnter={() => onMouseOver(3)} onMouseLeave={() => onMouseOut()} d="M329.11,402.82c-32.72,19.79-71.09,31.18-112.11,31.18-35.28,0-68.6-8.42-98.05-23.37l54.59-94.53c13.19,5.73,27.75,8.9,43.05,8.9,21.3,0,41.17-6.15,57.91-16.77l54.61,94.59Z"/>
              <path className={"segment" + (active == 4 ? " active-segment" : "")} onClick={() => handleSegmentChange(4)} onMouseEnter={() => onMouseOver(4)} onMouseLeave={() => onMouseOut()} d="M434,217c0,74.88-37.92,140.9-95.61,179.9l-54.88-95.05c25.13-19.77,41.29-50.42,41.38-84.85h109.11Z"/>
              <path className={"segment" + (active == 5 ? " active-segment" : "")} onClick={() => handleSegmentChange(5)} onMouseEnter={() => onMouseOver(5)} onMouseLeave={() => onMouseOut()} d="M433.73,206h-109.37c-3.05-31.21-19.36-58.53-43.22-76.27l54.52-94.44c56.35,36.86,94.5,99.23,98.07,170.71Z"/>
              <path className={"segment" + (active == 0 ? " active-segment" : "")} onClick={() => handleSegmentChange(0)} onMouseEnter={() => onMouseOver(0)} onMouseLeave={() => onMouseOut()} d="M326.31,29.5l-54.34,94.12c-16.2-9.67-35.14-15.22-55.38-15.22-14.24,0-27.84,2.75-40.29,7.75L121.89,21.91C150.61,7.87,182.89,0,217,0c39.86,0,77.21,10.75,109.31,29.5Z"/>
          </g>
      </svg>
      <p className="seg-label" id="seg-label">{segments[active]}</p>
      {active == 6 ? <div/> :
      <div className="button segment-button" onClick={() => handleSegmentChange(6)}>Show All</div>
      }
    </div>
  );
};

export default SegmentNav;