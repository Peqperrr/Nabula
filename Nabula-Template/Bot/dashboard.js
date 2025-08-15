/*
 * @author Maik
 * @version 1.0.0
 */
// bot/api/dashboard.js
const axios = require('axios');
const config = require('../config');

// Custom error class for API errors
class DashboardAPIError extends Error {
  constructor(message, statusCode, originalError) {
    super(message);
    this.name = 'DashboardAPIError';
    this.statusCode = statusCode;
    this.originalError = originalError;
  }
}

// Retry configuration
const MAX_RETRIES = 3;
const RETRY_DELAY = 1000; // 1 second
const RETRY_STATUS_CODES = [408, 429, 500, 502, 503, 504];

// Helper function to implement delay
const delay = ms => new Promise(resolve => setTimeout(resolve, ms));

// Create an instance of axios with default configuration
const apiClient = axios.create({
  baseURL: config.dashboardApiUrl,
  timeout: 10000, // 10 second timeout
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
});

// Add a request interceptor to add authentication headers
apiClient.interceptors.request.use(
  (config) => {
    // Add the API key to the headers
    if (config.apiSecretKey) {
      config.headers['X-API-Key'] = config.apiSecretKey;
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(new DashboardAPIError('Request configuration error', null, error));
  }
);

// Add a response interceptor for error handling and retries
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const { config, response } = error;
    
    // Skip retry for specific error types
    if (!config || !RETRY_STATUS_CODES.includes(response?.status)) {
      throw new DashboardAPIError(
        response?.data?.message || error.message,
        response?.status,
        error
      );
    }
    
    // Initialize retry count
    config.__retryCount = config.__retryCount || 0;
    
    // Check if we should retry
    if (config.__retryCount >= MAX_RETRIES) {
      throw new DashboardAPIError(
        `Failed after ${MAX_RETRIES} retries`,
        response.status,
        error
      );
    }
    
    // Increment retry count
    config.__retryCount += 1;
    
    // Exponential backoff delay
    const backoffDelay = RETRY_DELAY * Math.pow(2, config.__retryCount - 1);
    await delay(backoffDelay);
    
    // Retry request
    return apiClient(config);
  }
);

// API methods
const api = {
  /**
   * Get server configuration
   * @param {string} guildId - Discord guild ID
   * @returns {Promise<Object>} Server configuration
   */
  async getServerConfig(guildId) {
    try {
      const response = await apiClient.get(`/servers/${guildId}/config`);
      return response.data;
    } catch (error) {
      throw new DashboardAPIError(
        `Failed to get server config for guild ${guildId}`,
        error.statusCode,
        error
      );
    }
  },
  
  /**
   * Update server configuration
   * @param {string} guildId - Discord guild ID
   * @param {Object} config - New configuration
   * @returns {Promise<Object>} Updated configuration
   */
  async updateServerConfig(guildId, config) {
    try {
      const response = await apiClient.put(`/servers/${guildId}/config`, config);
      return response.data;
    } catch (error) {
      throw new DashboardAPIError(
        `Failed to update server config for guild ${guildId}`,
        error.statusCode,
        error
      );
    }
  },
  
  /**
   * Log an event to the dashboard
   * @param {string} guildId - Discord guild ID
   * @param {string} eventType - Type of event
   * @param {Object} eventData - Event data
   * @returns {Promise<Object>} Logged event
   */
  async logEvent(guildId, eventType, eventData) {
    try {
      const response = await apiClient.post(`/servers/${guildId}/logs`, {
        type: eventType,
        data: eventData,
        timestamp: new Date().toISOString()
      });
      return response.data;
    } catch (error) {
      throw new DashboardAPIError(
        `Failed to log event for guild ${guildId}`,
        error.statusCode,
        error
      );
    }
  }
};

module.exports = {
  api,
  DashboardAPIError
};