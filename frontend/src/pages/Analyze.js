import React from "react";
import { useSelector, useDispatch } from 'react-redux';
import Button from "../components/Button";
import Toggle from "../components/Toggle";
import { FileUpload } from "../components/FileUpload.js";
import { useNavigate } from "react-router-dom";
 import { ROICanvas } from "../containers/ROICanvas";

export function Analyze() {

  const navigate = useNavigate();
  const data = useSelector((state) => state.analyze.data);

  const handlePageChange = (page) => {
    navigate(`/${page}`);
  };

  var pixelWise = false
  const toggleAnalysisMode = (status) => {
    pixelWise = status;
  };
  
      return(
        <main>
            <header>
                <h2>Vandsburger Lab</h2>
                <p className="header-subtitle">University of California, Berkeley</p>
            </header>
            <div className="page-container analyze-page">
              <div className="side-image"/>
              <div className="analyze-container">
                <h3>Analyze CEST-MRI scans</h3>
                <div className="analyze-subsection">
                  <div>
                    <h4>Upload Images</h4>
                    <p>Select the folder containing the DICOM files for analysis. Make sure to remove all identifying information from the data before upload.</p>
                  </div>
                  <div className="analyze-side-container">
                    <FileUpload/>
                  </div>
                    
                </div>
                <div className="analyze-subsection">
                  <div>
                    <h4>Select Analysis Mode</h4>
                    <p>Explain pixel-wise detection</p>
                  </div>
                  <div className="analyze-side-container">
                    <Toggle action={toggleAnalysisMode}/>
                    <p>Use pixel-wise analysis</p>
                  </div>
                </div>
                </div>
              </div>
              { data.length > 0 ?
              <div style={{marginLeft: "24vw", width: "60vw"}}>
                <h4>Mark ROIs</h4>
                <p>Use the annotation tool to select the region of interest for each image in your dataset.</p>
                <ROICanvas/>
              </div> :
              <div/>
              }
          </main>
        );
      }