import axios from 'axios';
import { API_BASE_URL } from '../constants/config';
import { getToken, clearToken } from '../utils/storage';

const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// ═══════════════════════════════════════════════════════════
// REQUEST INTERCEPTOR - Log all outgoing requests
// ═══════════════════════════════════════════════════════════
axiosInstance.interceptors.request.use(
  async (config) => {
    const startTime = Date.now();
    config.metadata = { startTime };

    // Add auth token
    const token = await getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // Log Request
    console.log('╔════════════════════════════════════════════════════════════');
    console.log('║ 📤 OUTGOING REQUEST');
    console.log('╠════════════════════════════════════════════════════════════');
    console.log('║ Method      :', config.method?.toUpperCase());
    console.log('║ URL         :', config.baseURL + config.url);
    console.log('║ Timeout     :', config.timeout, 'ms');
    console.log('╠════════════════════════════════════════════════════════════');
    console.log('║ HEADERS:');
    
    Object.keys(config.headers).forEach(key => {
      let value = config.headers[key];
      
      // Mask authorization token
      if (key.toLowerCase() === 'authorization' && value) {
        value = value.substring(0, 15) + '...' + value.substring(value.length - 5);
      }
      
      console.log(`║   ${key}: ${value}`);
    });

    // Log Request Body
    if (config.data) {
      console.log('╠════════════════════════════════════════════════════════════');
      console.log('║ REQUEST BODY:');
      console.log('║', JSON.stringify(config.data, null, 2).split('\n').join('\n║ '));
    }

    console.log('╚════════════════════════════════════════════════════════════');

    return config;
  },
  (error) => {
    console.error('❌ REQUEST ERROR:', error.message);
    return Promise.reject(error);
  }
);

// ═══════════════════════════════════════════════════════════
// RESPONSE INTERCEPTOR - Log all incoming responses
// ═══════════════════════════════════════════════════════════
axiosInstance.interceptors.response.use(
  (response) => {
    const duration = Date.now() - response.config.metadata.startTime;

    // Log Response
    console.log('╔════════════════════════════════════════════════════════════');
    console.log('║ 📥 INCOMING RESPONSE');
    console.log('╠════════════════════════════════════════════════════════════');
    console.log('║ Status      :', response.status, response.statusText);
    console.log('║ Duration    :', duration, 'ms');
    console.log('║ URL         :', response.config.baseURL + response.config.url);
    console.log('╠════════════════════════════════════════════════════════════');
    console.log('║ RESPONSE HEADERS:');
    
    Object.keys(response.headers).forEach(key => {
      console.log(`║   ${key}: ${response.headers[key]}`);
    });

    // Log Response Data
    console.log('╠════════════════════════════════════════════════════════════');
    console.log('║ RESPONSE DATA:');
    
    if (response.data) {
      const dataStr = typeof response.data === 'string' 
        ? response.data 
        : JSON.stringify(response.data, null, 2);
      console.log('║', dataStr.split('\n').join('\n║ '));
    }

    console.log('╚════════════════════════════════════════════════════════════');
    console.log('✅ Request completed successfully\n');

    return response;
  },
  async (error) => {
    const duration = error.config?.metadata?.startTime 
      ? Date.now() - error.config.metadata.startTime 
      : 0;

    // Log Error Response
    console.log('╔════════════════════════════════════════════════════════════');
    console.log('║ ❌ ERROR RESPONSE');
    console.log('╠════════════════════════════════════════════════════════════');
    console.log('║ Duration    :', duration, 'ms');

    if (error.response) {
      // Server responded with error
      console.log('║ Status      :', error.response.status, error.response.statusText);
      console.log('║ URL         :', error.config?.baseURL + error.config?.url);
      console.log('╠════════════════════════════════════════════════════════════');
      console.log('║ ERROR DATA:');
      
      if (error.response.data) {
        const dataStr = typeof error.response.data === 'string'
          ? error.response.data
          : JSON.stringify(error.response.data, null, 2);
        console.log('║', dataStr.split('\n').join('\n║ '));
      }

      // Handle 401 Unauthorized
      if (error.response.status === 401) {
        console.log('║ ⚠️  Unauthorized - Clearing token');
        await clearToken();
      }

      const errorMessage = error.response.data?.message 
        || error.response.data?.error 
        || 'An error occurred';
      
      console.log('╚════════════════════════════════════════════════════════════');
      return Promise.reject(new Error(errorMessage));

    } else if (error.request) {
      // Request made but no response
      console.log('║ Type        : Network Error');
      console.log('║ Message     : No response received from server');
      console.log('║ URL         :', error.config?.baseURL + error.config?.url);
      console.log('╚════════════════════════════════════════════════════════════');
      return Promise.reject(new Error('Network error. Please check your connection.'));

    } else {
      // Something else happened
      console.log('║ Type        : Request Setup Error');
      console.log('║ Message     :', error.message);
      console.log('╚════════════════════════════════════════════════════════════');
      return Promise.reject(new Error(error.message || 'An error occurred'));
    }
  }
);

export default axiosInstance;