/*
*
*    Postavlja AXIOS klijent
*
*/

import axios from 'axios';
import config from '../config';

const axiosService = axios.create( {
  baseURL: config.server.url,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
} );

export default axiosService;