import API from "../src/api/axios";

// GET ASSIGNED CRIMES
export const getAssignedCrimes = async () => {


const response = await API.get(
    "/crime/all"
);

return response.data;


};

// UPDATE CRIME STATUS
export const updateCrimeStatus = async (
crimeId,
status
) => {


const response = await API.put(
    `/crime/update-status/${crimeId}`,
    {
        status
    }
);

return response.data;


};
