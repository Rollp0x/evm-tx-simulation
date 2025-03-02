import axios from 'axios';
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL_EXTERNAL

const instance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 300000,
  headers: {
    'Content-Type': 'application/json',
  },
});

instance.interceptors.response.use(
  response => response.data,
  error =>  Promise.reject(error)
);

export default instance; 