import { useEffect, useState } from "react";

import SideBar from "../components/SideBar";
import Navbar from "../components/Navbar";

import { getAssignedCrimes } from "../../Services/crimeService";
import UpdateStatus from "../components/UpdateStatus";

function AssignedCrimes() {

    const [crimes, setCrimes] = useState([]);

    useEffect(() => {

        fetchAssignedCrimes();

    }, []);

    const fetchAssignedCrimes = async () => {

        try {

            const data = await getAssignedCrimes();

            setCrimes(data);

        } catch (error) {

            console.log(error);
        }
    };

    return (

        <div className="flex bg-gray-100 min-h-screen">

            <SideBar />

            <div className="flex-1">

                <Navbar />

                <div className="p-6">

                    <h1 className="text-3xl font-bold mb-6">
                        Assigned Crimes
                    </h1>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                        {crimes.map((crime) => (

                            <div
                                key={crime.id}
                                className="bg-white p-6 rounded-xl shadow-md"
                            >

                                <h2 className="text-2xl font-bold">
                                    {crime.title}
                                </h2>

                                <p className="text-gray-600 mt-2">
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

                                <div className="flex gap-3 mt-5">
                                    <UpdateStatus
                                        crimeId={crime.id}
                                        currentStatus={crime.status}
                                        refreshCrimes={fetchAssignedCrimes}
                                    />

                                    <button className="
                                        bg-blue-600
                                        text-white
                                        px-4
                                        py-2
                                        rounded-lg
                                    ">
                                        Investigation
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

export default AssignedCrimes;