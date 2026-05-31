import API from "../src/api/axios";

export const getDashboardStats = async () => {
  const response = await API.get("/dashboard/stats");
  return response.data;
};

export const getDashboardChartData = async () => {
  const response = await API.get("/dashboard/chart-data");
  return response.data;
};

export const getRecentCrimes= async() => {
  const response = await API.get("/dashboard/recent-crimes");
  return response.data;
}
export const getRecentLogs = async()=>{
  const response= await API.get("/dashboard/recent-logs");
  return response.data;
}
export const getInvestigationProgress = async() => {
  const response = await API.get("/dashboard/investigation-progress");
  return response.data;
}
export const searchCrimes = async(query) => { 
  const response = await API.get(`/dashboard/search?q=${query}`);
  return response.data;
}