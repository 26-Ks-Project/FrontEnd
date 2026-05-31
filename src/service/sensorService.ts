import api from './api';

export interface SensorData {
  temperature: number;
  humidity: number;
  soilMoisture: number;
  illuminance: number;
  isAbnormal: boolean;
  createdAt: string;
}

export interface SensorAvgResponse {
  timeRange: string;
  avgTemperature: number;
  avgHumidity: number;
  avgSoilMoisture: number;
  avgIlluminance: number;
}

interface SensorApiResponse {
  deviceId: string;
  data: SensorData[];
}

export const sensorService = {
  getLatestSensorData: async (deviceId: number = 1): Promise<SensorData> => {
    const response = await api.get<SensorApiResponse>(`/devices/${deviceId}/sensors`);
    if (response.data.data && response.data.data.length > 0) {
      return response.data.data[0];
    }
    throw new Error('No sensor data available');
  },

  getTodayAvgSensorData: async (deviceId: number = 1): Promise<SensorAvgResponse[]> => {
    const response = await api.get<SensorAvgResponse[]>(`/devices/${deviceId}/today-avg`);
    return response.data;
  },

  getSensorHistory: async (deviceId: number, day: string): Promise<SensorHistoryResponse> => {
    const response = await api.get<SensorHistoryResponse>(`/devices/${deviceId}/${day}/history`);
    return response.data;
  }
};

export interface SensorHistoryResponse {
  deviceId: string;
  searchDate: string;
  logs: SensorData[];
}
