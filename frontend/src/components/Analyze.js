import React from "react";
import axios from "axios";

class Analyze extends React.Component {

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
                  <form>
                      <input
                          id='directory-upload'
                          type='file'
                          webkitdirectory='true'
                          onChange={this.handleDirectoryUpload}
                      />
                  </form>
                </div>
              </div>
            </div>
        </main>
      );
    }

}

export default (Analyze);