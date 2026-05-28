import API from "../src/api/axios";

export const getAllOfficers = async () => {
    const response = await API.get("/admin/officers");
    return response.data;
};

export const assignOfficer = async (
    crimeId,
    officerId
) => {

    const response = await API.post(
        `/admin/assign-officer/${crimeId}`,
        {
            officer_id: officerId
        }
    );

    return response.data;
};