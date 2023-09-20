import React from "react";
import ROICanvas from "../containers/ROICanvas";
import { useSelector, useDispatch } from 'react-redux'

export function ROISelection() {
  const data = useSelector((state) => state.analyze.data);
  console.log(data[0]);

    return(
      <main>
          <header>
              <h2>Vandsburger Lab</h2>
              <p className="header-subtitle">University of California, Berkeley</p>
          </header>
          <div className="page-content">
              <h3>Select ROI</h3>
              <img src={'data:image/jpeg;base64,' + btoa('your-binary-data')}></img>
              <ROICanvas />
            </div>
        </main>
      );
    }