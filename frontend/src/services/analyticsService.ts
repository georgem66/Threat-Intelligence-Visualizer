import { apiClient } from './apiClient';

class AnalyticsService {
  async getDashboard() {
    const response = await apiClient.get('/analytics/dashboard');
    return response.data;
  }

  async getTimeSeries(days: number = 30) {
    const response = await apiClient.get('/analytics/timeseries', {
      params: { days },
    });
    return response.data;
  }

  async getGeographic() {
    const response = await apiClient.get('/analytics/geographic');
    return response.data;
  }
}

export const analyticsService = new AnalyticsService();