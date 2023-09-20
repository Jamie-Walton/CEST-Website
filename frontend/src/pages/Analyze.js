import React from "react";
import { FileUpload } from "../components/FileUpload.js"
import ROICanvas from "../containers/ROICanvas";

class Analyze extends React.Component {

    constructor(props) {
      super(props);
      this.state = {
          directory: '',
      }
    }
  
    render() {
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
                </div>
              </div>
          </main>
        );
      }

}

export default (Analyze);