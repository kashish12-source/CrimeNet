import axios from 'axios';

const API = axios.create({
    baseURL: "http://127.0.0.1:8000",
});

API.interceptors.request.use((req)=>{
    const  token= localStorage.getItem("token");

    if(token)
    {
        req.headers.Authorization = `Bearer ${token}`;

    }
    return req;
});
export const getAllCrimes = async ( )=> {
    const response = await API.get("/crimes/all");
    return response.data;
};
export const createcrime = async (crimedata) => {
    const response = await API.post("/crime/crime",crimedata);
    return response.data;
};
export const getAssignedCrimes= async () => {
    const response = await API.get("/officers/crimes");
    return response.data;
};
export const updateCrimeStatus = async (crimeId, status) => {
    const response= await API.put(`/crime/update-status/${crimeId}`, { status });
    return response.data;
};
