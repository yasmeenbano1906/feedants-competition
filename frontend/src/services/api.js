import axios from "axios";

const api = axios.create({
  baseURL: "http://192.168.0.114:5000/api/v1",
  headers: {
    "Content-Type": "application/json",
  },
});

export const getCompetition = async (competitionId) => {
  const response = await api.get(`/competitions/${competitionId}`);
  return response.data;
};

export const getRegistrationStatus = async (competitionId, userId) => {
  const response = await api.get(
    `/competitions/${competitionId}/registration?userId=${userId}`
  );
  return response.data;
};

export const joinCompetition = async (competitionId, userId) => {
  const response = await api.post(`/competitions/${competitionId}/join`, {
    userId,
  });
  return response.data;
};

export default api;