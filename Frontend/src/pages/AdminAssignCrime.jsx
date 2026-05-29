import { useEffect, useState } from "react";

import SideBar from "../components/SideBar";
import Navbar from "../components/Navbar";

import API from "../../src/api/axios";

function AdminAssignCrime() {

    const [crimes, setCrimes] = useState([]);

    const [officers, setOfficers] =
        useState([]);

    const [selectedOfficer,
        setSelectedOfficer] = useState({});

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

        <div className="flex bg-gray-100 min-h-screen">

            <SideBar />

            <div className="flex-1">

                <Navbar />

                <div className="p-6">

                    <h1 className="
                        text-4xl
                        font-bold
                        mb-8
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
                                        ">
                                            {crime.title}
                                        </h2>

                                        <p className="
                                            text-gray-600
                                            mt-2
                                        ">
                                            {crime.description}
                                        </p>

                                        <p className="mt-3">
                                            <span className="font-bold">
                                                Location:
                                            </span>

                                            {" "}

                                            {crime.location}
                                        </p>

                                        <p className="mt-2">
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
                                ">

                                    <select
                                        className="
                                            border
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

                                        {officers.map(
                                            (officer) => (

                                                <option
                                                    key={officer.id}
                                                    value={officer.id}
                                                >
                                                    {
                                                        officer.username
                                                    }
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
                                            bg-black
                                            text-white
                                            px-6
                                            py-3
                                            rounded-xl
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