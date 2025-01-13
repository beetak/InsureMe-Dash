import axios from "axios";

const baseURL = "http://localhost:8083/api/v1";

const apiClient = axios.create({
  baseURL: baseURL,
  withCredentials: true, // This is important for sending and receiving cookies
});

// Request interceptor
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // If the error is due to an expired access token
    if (error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        // Try to refresh the token
        const response = await axios.post(`${baseURL}/auth/refresh-token`, {}, {
          withCredentials: true
        });
        const { accessToken } = response.data;

        // Update the access token in local storage
        localStorage.setItem('accessToken', accessToken);

        // Update the authorization header
        originalRequest.headers['Authorization'] = `Bearer ${accessToken}`;

        // Retry the original request
        return apiClient(originalRequest);
      } catch (refreshError) {
        // If refreshing the token fails, clear the tokens and redirect to login
        localStorage.removeItem('accessToken');
        // You might want to implement your own logic here for redirection
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default apiClient;