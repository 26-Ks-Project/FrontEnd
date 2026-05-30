import api from './api';

export interface UserDailyQuestResponse {
  dailyQuestId: number;
  questId: number;
  title: string;
  description: string;
  xpReward: number;
  iconType: string;
  isCompleted: boolean;
}

export const questService = {
  getDailyQuests: async (userId: number = 1): Promise<UserDailyQuestResponse[]> => {
    const response = await api.get<UserDailyQuestResponse[]>(`/quests/user/${userId}`);
    return response.data;
  },

  completeQuest: async (userId: number, dailyQuestId: number): Promise<void> => {
    await api.patch(`/quests/user/${userId}/complete/${dailyQuestId}`);
  },
};
