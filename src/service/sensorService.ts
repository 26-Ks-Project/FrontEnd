import api from './api';

export interface SensorData {
  temperature: number;
  humidity: number;
  soilMoisture: number;
  illuminance: number;
  isAbnormal: boolean;
  createdAt: string;
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
  }
};
