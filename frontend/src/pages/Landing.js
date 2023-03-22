import React from "react";
import axios from "axios";

import MainImage from "../assets/landing-main.png";

class Landing extends React.Component {
  
    constructor(props) {
        super(props);
        this.state = {
            directory: '',
        }
      }
    
    handleDirectoryUpload = event => {
        this.setState({ directory: event.target.file });
    }

    onFileUpload = () => {
        const formData = new FormData();
        formData.append(
            "file",
            this.state.selectedFile,
            this.state.selectedFile.name
        );
        this.props.uploadClasses(this.props.namespace, formData);
        const upload = document.getElementById("file-upload");
        const fileText = document.getElementById("class-file-upload");
        upload.classList.toggle("hide");
        fileText.reset();

        /*
        <form>
            <input
                id='directory-upload'
                type='file'
                webkitdirectory='true'
                onChange={this.handleDirectoryUpload}
            />
        </form>
        */

    };
    
    render() {
        return(
            <div>
                <div className="landing-background">
                    <div className="landing-hero-text">
                        <h1 className="landing-title">Analyze CEST MRI images in seconds.</h1>
                        <p className="landing-subtitle">The SomethingTool is a robust, standardized tool for automatically segmenting and analyzing CEST MRI myocardium scans.</p>
                        <div className="large-button">Upload Images</div>
                    </div>
                </div>
                <img className="landing-main-image" src={MainImage} />
            </div>
        );
    }

}

export default (Landing);