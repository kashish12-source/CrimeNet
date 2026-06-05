import { useEffect, useState } from "react";

import SideBar from "../components/SideBar";
import Navbar from "../components/Navbar";

import API from "../../src/api/axios";

const ADJACENT_ZONES = {
    "Central Zone (Bhopal)": ["Central Zone (Bhopal)", "North Zone (Gwalior)", "South Zone (Narmadapuram)", "East Zone (Jabalpur)", "West Zone (Indore)"],
    "North Zone (Gwalior)": ["North Zone (Gwalior)", "Central Zone (Bhopal)", "East Zone (Jabalpur)", "West Zone (Indore)"],
    "South Zone (Narmadapuram)": ["South Zone (Narmadapuram)", "Central Zone (Bhopal)", "East Zone (Jabalpur)", "West Zone (Indore)"],
    "East Zone (Jabalpur)": ["East Zone (Jabalpur)", "Central Zone (Bhopal)", "North Zone (Gwalior)", "South Zone (Narmadapuram)"],
    "West Zone (Indore)": ["West Zone (Indore)", "Central Zone (Bhopal)", "North Zone (Gwalior)", "South Zone (Narmadapuram)"]
};

function AdminAssignCrime() {

    const [crimes, setCrimes] = useState([]);

    const [officers, setOfficers] =
        useState([]);

    const [selectedOfficer,
        setSelectedOfficer] = useState({});

    const getSortedOfficers = (officersList, crime) => {
        return [...officersList].map(officer => {
            let score = 0;
            let recommendationLabel = "";
            
            const isSpecialtyMatch = officer.specialization === crime.title;
            const isZoneMatch = officer.assigned_area === crime.zone;
            
            let isAdjacent = false;
            if (crime.zone && officer.assigned_area && ADJACENT_ZONES[crime.zone]) {
                isAdjacent = ADJACENT_ZONES[crime.zone].includes(officer.assigned_area);
            }
            
            if (isSpecialtyMatch && isZoneMatch) {
                score = 4;
                recommendationLabel = "⚡ Best Match (Zone & Specialty)";
            } else if (isZoneMatch) {
                score = 3;
                recommendationLabel = "📍 Zone Match";
            } else if (isSpecialtyMatch) {
                score = 2;
                recommendationLabel = "💼 Specialty Match";
            } else if (isAdjacent) {
                score = 1;
                recommendationLabel = "🚗 Proximity (Nearby Zone)";
            }
            
            return { ...officer, score, recommendationLabel };
        }).sort((a, b) => b.score - a.score);
    };

    useEffect(() => {

        fetchCrimes();

        fetchOfficers();

    }, []);

    // FETCH CRIMES
    const fetchCrimes = async () => {

        try {

            const response =
                await API.get("/admin/crimes");

            setCrimes(response.data);

        } catch (error) {

            console.log(error);
        }
    };

    // FETCH OFFICERS
    const fetchOfficers = async () => {

        try {

            const response =
                await API.get("/admin/officers");

            setOfficers(response.data);

        } catch (error) {

            console.log(error);
        }
    };

    // ASSIGN OFFICER
    const handleAssignOfficer =
        async (crimeId) => {

        try {

            await API.post(
                `/admin/assign-officer/${crimeId}`,
                {
                    officer_id:
                        selectedOfficer[crimeId]
                }
            );

            alert(
                "Officer assigned successfully"
            );

            fetchCrimes();

        } catch (error) {

            console.log(error);

            alert(
                "Failed to assign officer"
            );
        }
    };

    return (

        <div className="flex bg-slate-100 dark:bg-slate-800 min-h-screen">

            <SideBar />

            <div className="flex-1">

                <Navbar />

                <div className="p-6">

                    <h1 className="
                        text-4xl
                        font-bold
                        mb-8
                        text-slate-900
                        dark:text-white
                    ">
                        Assign Crimes
                    </h1>

                    <div className="
                        grid
                        grid-cols-1
                        gap-6
                    ">

                        {crimes.map((crime) => (

                            <div
                                key={crime.id}
                                className="
                                    bg-white
                                    dark:bg-slate-700
                                    rounded-2xl
                                    shadow-md
                                    p-6
                                "
                            >

                                <div className="
                                    flex
                                    justify-between
                                    items-center
                                ">

                                    <div>

                                        <h2 className="
                                            text-2xl
                                            font-bold
                                            text-slate-900
                                            dark:text-white
                                        ">
                                            {crime.title}
                                        </h2>

                                        <p className="
                                            text-slate-600
                                            dark:text-slate-300
                                            mt-2
                                        ">
                                            {crime.description}
                                        </p>

                                        <p className="mt-3 text-slate-900 dark:text-slate-100">
                                            <span className="font-bold">
                                                Location:
                                            </span>

                                            {" "}

                                            {crime.location}
                                        </p>

                                        <p className="mt-2 text-slate-900 dark:text-slate-100">
                                            <span className="font-bold">
                                                Status:
                                            </span>

                                            {" "}

                                            {crime.status}
                                        </p>

                                    </div>

                                </div>

                                <div className="
                                    mt-6
                                    flex
                                    gap-4
                                    items-center
                                    flex-wrap
                                ">

                                    <select
                                        className="
                                            border
                                            border-slate-300
                                            dark:border-slate-600
                                            bg-white
                                            dark:bg-slate-900
                                            dark:text-white
                                            p-3
                                            rounded-xl
                                            w-72
                                        "
                                        onChange={(e) =>
                                            setSelectedOfficer({
                                                ...selectedOfficer,

                                                [crime.id]:
                                                    e.target.value
                                            })
                                        }
                                    >

                                        <option>
                                            Select Officer
                                        </option>

                                        {getSortedOfficers(officers, crime).map(
                                            (officer) => (

                                                <option
                                                    key={officer.id}
                                                    value={officer.id}
                                                >
                                                    {officer.username} {officer.recommendationLabel ? `(${officer.recommendationLabel})` : `(${officer.assigned_area || "General"})`}
                                                </option>
                                            )
                                        )}

                                    </select>

                                    <button
                                        onClick={() =>
                                            handleAssignOfficer(
                                                crime.id
                                            )
                                        }
                                        className="
                                            bg-blue-600
                                            dark:bg-blue-500
                                            hover:bg-blue-700
                                            dark:hover:bg-blue-600
                                            text-white
                                            px-6
                                            py-3
                                            rounded-xl
                                            transition
                                        "
                                    >
                                        Assign Officer
                                    </button>

                                </div>

                            </div>
                        ))}

                    </div>

                </div>

            </div>

        </div>
    );
}

export default AdminAssignCrime;