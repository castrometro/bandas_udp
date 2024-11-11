import axios from 'axios';
import {getCSRFToken} from "../../utils/csrf.tsx";

const csrfToken = getCSRFToken();

const axiosInstance = axios.create({
  baseURL: 'http://localhost:8000',
  headers: {
    'Content-Type': 'application/json',
    'X-CSRFToken': csrfToken || '',
  },
  withCredentials: true,
});

export default axiosInstance;