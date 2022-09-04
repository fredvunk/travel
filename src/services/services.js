import axios from "axios";

export const getTravelData = () => {
    return axios.get('http://127.0.0.1:5555/data')
        .then(response => response.data)
        .catch(error => Promise.reject(error));
};
