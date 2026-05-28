import API from "../src/api/axios";

// ADD INVESTIGATION NOTE
export const addInvestigationNote = async (
    officerId,
    crimeId,
    note
) => {

    const response = await API.post(
        `/investigationbook/investigation/${officerId}/${crimeId}`,
        {
            note
        }
    );

    return response.data;
};