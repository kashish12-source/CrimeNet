import { useEffect, useState } from "react";

import SideBar from "../components/SideBar";
import Navbar from "../components/Navbar";
import CrimeCard from "../components/CrimeCard";

import { getAllCrimes } from "../../Services/crimeService";

function AllCrimes() {

    const [crimes, setCrimes] = useState([]);

    useEffect(() => {

        fetchCrimes();

    }, []);

    const fetchCrimes = async () => {

        try {

            const response = await getAllCrimes();

            setCrimes(response.data || response);

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
                        All Crimes
                    </h1>

                    <div className="
                        grid
                        grid-cols-1
                        md:grid-cols-2
                        lg:grid-cols-3
                        gap-6
                    ">

                        {crimes.map((crime) => (

                            <CrimeCard
                                key={crime.id}
                                crime={crime}
                            />
                        ))}

                    </div>

                </div>

            </div>

        </div>
    );
}

export default AllCrimes;