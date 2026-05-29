import API from "../src/api/axios";

// ==============================
// GET ASSIGNED CRIMES
// ==============================
export const getAssignedCrimes = async () => {
  const response = await API.get("/officers/crimes");
  return response.data;
};

// ==============================
// GET ALL CRIMES
// ==============================
export const getAllCrimes = async (
  status,
  location,
  page = 1,
  limit = 5,
  sort = "latest"
) => {
  const response = await API.get("/crime/all", {
    params: {
      status,
      location,
      page,
      limit,
      sort,
    },
  });

  return response.data;
};

// ==============================
// GET SINGLE CRIME BY ID
// ==============================
export const getCrimeById = async (crimeId) => {
  const response = await API.get(`/crime/${crimeId}`);
  return response.data;
};

// ==============================
// CREATE CRIME
// ==============================
export const createCrime = async (crimeData) => {
  const response = await API.post("/crime/crime", crimeData);
  return response.data;
};

// ==============================
// REPORT CRIME
// ==============================
export const reportCrime = async (crimeData) => {
  const response = await API.post("/crime/crime", crimeData);
  return response.data;
};

// ==============================
// UPDATE CRIME STATUS
// ==============================
export const updateCrimeStatus = async (crimeId, status) => {
  const response = await API.put(
    `/crime/update-status/${crimeId}`,
    {
      status,
    }
  );

  return response.data;
};

// ==============================
// GET MY CRIMES
// ==============================
export const getMyCrimes = async () => {
  const response = await API.get("/crime/my-crimes");
  return response.data;
};

// ==============================
// GET CRIME TIMELINE
// ==============================
export const getCrimeTimeline = async (crimeId) => {
  const response = await API.get(`/timeline/${crimeId}`);
  return response.data;
};

// ==============================
// ADD INVESTIGATION NOTE
// ==============================
export const addInvestigationNote = async (
  crimeId,
  note
) => {
  const response = await API.post(
    `/crime/${crimeId}/note`,
    {
      note,
    }
  );

  return response.data;
};