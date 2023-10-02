import React from "react";
import { ROICanvas } from "../containers/ROICanvas";

export function ROISelection() {

    return(
      <main>
          <header>
              <h2>Vandsburger Lab</h2>
              <p className="header-subtitle">University of California, Berkeley</p>
          </header>
          <div className="page-content">
              <h3>Select ROI</h3>
              <ROICanvas/>
            </div>
        </main>
      );
    }