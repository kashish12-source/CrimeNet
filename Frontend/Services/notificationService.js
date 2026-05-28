import API from "../src/api/axios";

export const getNotifications = async () => {

    const response = await API.get(
        "/notifications/"
    );

    return response.data;
};