import axios from "axios";


export const uploadFiles = (data) => (dispatch, getState) => {
    const config = {
        headers: {
            'Content-Type': 'application/json'
        }
    }
    axios
        .post('/upload/', data, config)
        .then(dispatch({ type: UPLOAD_SUCCESS }))
        .catch((err) => console.log(err)); // TODO: Change to dispatch UI error
}
