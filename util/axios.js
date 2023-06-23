import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: 'http://192.168.164.1:8000',
});

axiosInstance.interceptors.request.use(
  async function (config) {
    try {
      const token = await AsyncStorage.getItem('access_token');
      config.headers.Authorization = `Bearer ${token}`;
    } catch (error) {
      // Handle AsyncStorage errors
      console.error('Error retrieving access token:', error);
    }
    return config;
  },
  function (error) {
    return Promise.reject(error);
  },
);

export default axiosInstance;