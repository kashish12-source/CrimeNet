import API from "../src/api/axios";

export const getDashboardStats = async () => {
    const response = await API.get("/dashboard/stats");
    return response.data;
};