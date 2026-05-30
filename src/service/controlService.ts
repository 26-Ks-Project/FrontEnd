import api from './api';

export const controlService = {
  controlWaterPump: async (deviceId: number): Promise<void> => {
    await api.post(`/devices/${deviceId}/water-pump-control`);
  },

  controlSupplement: async (deviceId: number): Promise<void> => {
    await api.post(`/devices/${deviceId}/supplement-control`);
  }
};
