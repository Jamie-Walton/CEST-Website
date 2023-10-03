import React from "react";
import { useDispatch } from 'react-redux'
import { filesUploaded } from '../reducers/analyze'
import axios from "axios";
import Button from "../components/Button";


export function FileUpload() {

    const dispatch = useDispatch()
    var directory = '';
  
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
        <div style={{display: 'flex', alignItems: "center"}}>
            <form>
                <input
                    id='directory-upload'
                    type='file'
                    webkitdirectory='true'
                    onChange={handleDirectoryUpload}
                />
            </form>
            <Button name="Upload" onClick={onDirectoryUpload} />
        </div>
        );
}