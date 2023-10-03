import React from "react";

import MainImage from "../assets/landing-main.png";

class Landing extends React.Component {
  
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
                    <div>
                        <div className="landing-background">
                            <div className="landing-hero-text">
                                <h1 className="landing-title">Analyze CEST MRI images in seconds.</h1>
                                <p className="landing-subtitle">The SomethingTool is a robust, standardized tool for automatically segmenting and analyzing CEST MRI myocardium scans.</p>
                                <div className="large-button" onClick={() => console.log()}>Get Started</div>
                            </div>
                        </div>
                        <img className="landing-main-image" src={MainImage} alt="Segmentation of a CEST MRI scan"/>
                    </div>
                </header>
            </main>
        );
    }

}

export default (Landing);