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
        this.setState({ directory: event.target.files });
    }

    onDirectoryUpload = () => {
        const formData = new FormData();
        for (let i = 0; i < this.state.directory.length; i++) {
            formData.append("file", this.state.directory[i], this.state.directory[i].name);
        }
        console.log(formData);
        // this.props.uploadFiles(formData);
        // fileText.reset();

        const config = {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        }
    
        axios
            .post(`/upload/`, formData, config)
            .catch((err) => {
                console.log(err);
            });

    };
    
    render() {
        return(
            <div>
                <div className="landing-background">
                    <div className="landing-hero-text">
                        <h1 className="landing-title">Analyze CEST MRI images in seconds.</h1>
                        <p className="landing-subtitle">The SomethingTool is a robust, standardized tool for automatically segmenting and analyzing CEST MRI myocardium scans.</p>
                        <form>
                            <input
                                id='directory-upload'
                                type='file'
                                webkitdirectory='true'
                                onChange={this.handleDirectoryUpload}
                            />
                        </form>
                        <div className="large-button" onClick={this.onDirectoryUpload}>Upload</div>
                    </div>
                </div>
                <img className="landing-main-image" src={MainImage} alt="Segmentation of a CEST MRI scan"/>
            </div>
        );
    }

}

export default (Landing);