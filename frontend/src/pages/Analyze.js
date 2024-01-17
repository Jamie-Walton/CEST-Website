import React, { useState } from "react";
import { useSelector, useDispatch } from 'react-redux';
import axios from "axios";
import Button from "../components/Button";
import Toggle from "../components/Toggle";
import { FileUpload, generateReport } from "../components/FileUpload.js";
import { useNavigate } from "react-router-dom";
 import { ROICanvas } from "../components/ROICanvas";

export function Analyze() {

  const dispatch = useDispatch()
  const navigate = useNavigate();
  const data = useSelector((state) => state.analyze.data);

  const [epiROIs, setEpiROIs] = useState(Array(data.length).fill({points: [], isPolyComplete: false}));
  const [endoROIs, setEndoROIs] = useState(Array(data.length).fill({points: [], isPolyComplete: false}));
  const [arvs, setARVs] = useState(Array(data.length).fill([]));
  const [irvs, setIRVs] = useState(Array(data.length).fill([]));
  const [pixelWise, setPixelWise] = useState(false);

  const handlePageChange = (page) => {
    navigate(`/${page}`);
  };

  const onUpload = (len) => {
    setEpiROIs(Array(len).fill({points: [], isPolyComplete: false}));
    setEndoROIs(Array(len).fill({points: [], isPolyComplete: false}));
    setARVs(Array(len).fill({points: [], isPolyComplete: false}));
    setIRVs(Array(len).fill({points: [], isPolyComplete: false}));
  }

  const saveROIs = (rois, type) => {
    switch (type) {
      case ("Epicardium"):
        setEpiROIs(rois);
        break;
      case ("Endocardium"):
        setEndoROIs(rois);
        break;
      case ("ARV"):
        setARVs(rois);
        break;
      case ("IRV"):
        setIRVs(rois);
        break;
    }
  };

  const toggleAnalysisMode = (status) => {
    setPixelWise(status);
  };

  const generateReport = () => {
    const config = {
      headers: {
          'Content-Type': 'application/json'
        }
    }
    var id = data[0].id;
    const report = JSON.stringify({ id, epiROIs, endoROIs, arvs, irvs, pixelWise });
    axios
        .post(`/report/`, report, config)
        .then((res) => {
            // dispatch(generateReport(res.data));
        })
        .catch((err) => {
            console.log(err);
        });
  }
  
      return(
        <main>
            <header>
                <h2 onClick={() => handlePageChange('')}>Vandsburger Lab</h2>
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
                    <FileUpload onUpload={onUpload}/>
                  </div>
                    
                </div>
                <div className="analyze-subsection">
                  <div>
                    <h4>Select Analysis Mode</h4>
                    <p>
                      By default, SomethingTool uses segment-wise analysis, averaging pixel 
                      intensity across a full region of interest. Optionally, you may switch to 
                      pixel-wise detection to generate z-spectra for each voxel. Note that this 
                      may result in a longer processing time.
                    </p>
                  </div>
                  <div className="analyze-side-container">
                    <Toggle action={toggleAnalysisMode}/>
                    <p>Use pixel-wise analysis</p>
                  </div>
                </div>
                </div>
              </div>
              { data.length > 0 ?
              <div style={{marginLeft: "10vw", marginTop: "5vw", width: "80vw"}}>
                <h4>Mark ROIs</h4>
                <p>Use the annotation tool to select the region of interest for each image in your dataset.</p>
                <ROICanvas save={saveROIs} isPixelWise={pixelWise}/>
                <Button className="major-button" name="Generate Report" onClick={generateReport}/>
              </div> :
              <div/>
              }
          </main>
        );
      }