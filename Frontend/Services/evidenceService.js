 import API from "../src/api/axios";

// UPLOAD EVIDENCE
export const uploadEvidence = async (
    crimeId,
    formData
) => {

    const response = await API.post(
        `/evidence/uploads/${crimeId}`,
        formData,
        {
            headers: {
                "Content-Type":
                    "multipart/form-data"
            }
        }
    );

    return response.data;
};