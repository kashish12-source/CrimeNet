import { useEffect, useState } from "react";

import SideBar from "../components/SideBar";
import Navbar from "../components/Navbar";

import { getAllOfficers } from "../../Services/adminService";

function Officers() {

    const [officers, setOfficers] = useState([]);

    useEffect(() => {

        fetchOfficers();

    }, []);

    const fetchOfficers = async () => {

        try {

            const data = await getAllOfficers();

            setOfficers(data);

        } catch (error) {

            console.log(error);
        }
    };

    return (

        <div className="flex bg-slate-100 dark:bg-slate-800 min-h-screen">

            <SideBar />

            <div className="flex-1">

                <Navbar />

                <div className="p-6">

                    <h1 className="text-3xl font-bold mb-6 text-slate-900 dark:text-white">
                        Officers
                    </h1>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

                        {officers.map((officer) => (

                            <div
                                key={officer.id}
                                className="bg-white dark:bg-slate-700 p-5 rounded-xl shadow-md"
                            >

                                <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
                                    {officer.username}
                                </h2>

                                <p className="mt-2 text-slate-600 dark:text-slate-300">
                                    {officer.email}
                                </p>

                                <p className="mt-2 text-slate-900 dark:text-slate-100">
                                    Role: {officer.role}
                                </p>

                                <p className="mt-2 text-slate-900 dark:text-slate-100">
                                    Phone: {officer.phone_number}
                                </p>

                            </div>

                        ))}

                    </div>

                </div>

            </div>

        </div>
    );
}

export default Officers;