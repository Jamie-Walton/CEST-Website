import React from "react";
import Button from "../components/Button";
import { FileUpload } from "../components/FileUpload.js";
import { useNavigate } from "react-router-dom";

export function Analyze() {

  const navigate = useNavigate();

  const handlePageChange = (page) => {
    navigate(`/${page}`);
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
                    <p>Upload Images</p>
                  </div>
                  <div className="small-button analyze-button">Select Directory</div>
                    <FileUpload/>
                  </div>
                  <Button name="Annotate" onClick={() => handlePageChange('roi')} />
                </div>
              </div>
          </main>
        );
      }