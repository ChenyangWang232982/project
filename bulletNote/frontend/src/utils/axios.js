import axios from 'axios'; //Enables the front-end to easily send HTTP requests to the back-end.

const api = axios.create({
    baseURL: 'http://localhost:5000/api',
    timeout: 5000,
    headers: {
    'Content-Type': 'application/json'
   }
});

api.interceptors.request.use(
    (config) => {
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
)

api.interceptors.response.use(
    (response) => {
        return response.data;
    },
    (errpr) => {
        console.error('Failure to request', error.message);
        alert('Failure to request: ' +  (error.response?.data?.message || error.message));
        return Promise.reject(error);
    }
)

export default api;