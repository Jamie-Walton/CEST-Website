import React from "react";
import ROICanvas from "../containers/ROICanvas";

class ROISelection extends React.Component {

    constructor(props) {
      super(props);
      this.state = {
      }
    }
  

    render() {
      return(
        <main>
            <header>
                <h2>Vandsburger Lab</h2>
                <p className="header-subtitle">University of California, Berkeley</p>
            </header>
            <div className="page-container">
                <h3>Select ROI</h3>
                <ROICanvas />
              </div>
          </main>
        );
      }

}

export default (ROISelection);