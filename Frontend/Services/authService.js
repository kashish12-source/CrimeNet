import API from "../src/api/axios";

export const loginUser = async (data) => {
    return await API.post("/auth/login", data);
};

export const registerUser = async (data) => {
    return await API.post("/auth/register", data);
};
