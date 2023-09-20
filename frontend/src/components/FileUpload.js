import React from "react";
import { useSelector, useDispatch } from 'react-redux'
import { filesUploaded } from '../reducers/analyze'
import axios from "axios";


export function FileUpload() {

    // const data = useSelector((state) => state.analyze.data)
    const dispatch = useDispatch()
    var directory = '';
    var data = useSelector((state) => state.analyze.data);
  
    const handleDirectoryUpload = event => {
      directory = event.target.files;
    }

    const onDirectoryUpload = () => {
        const formData = new FormData();
        for (let i = 0; i < directory.length; i++) {
            formData.append("file", directory[i], directory[i].name);
        }

        const config = {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        }
    
        axios
            .post(`/upload/`, formData, config)
            .then((res) => {
                dispatch(filesUploaded(res.data));
            })
            .catch((err) => {
                console.log(err);
            });

    };
  
      return(
        <div className="analyze-container">
            <form>
                <input
                    id='directory-upload'
                    type='file'
                    webkitdirectory='true'
                    onChange={handleDirectoryUpload}
                />
            </form>
            <div className="large-button" onClick={onDirectoryUpload}>Upload</div>
        </div>
        );
}