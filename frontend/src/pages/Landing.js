import React from "react";
import axios from "axios";

class Landing extends React.Component {
  
    render() {
        return(
            <div>
                <div className="landing-background">
                    <div className="landing-hero-text">
                        <h1 className="landing-title">Analyze CEST MRI images in seconds.</h1>
                        <div className="large-button">Upload Images</div>
                    </div>
                </div>
            </div>
        );
    }

}

export default (Landing);