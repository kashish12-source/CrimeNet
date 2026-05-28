import { useEffect, useState } from "react";

import { useParams } from "react-router-dom";

import API from "../../src/api/axios";

import SideBar from "../components/SideBar";
import Navbar from "../components/Navbar";

function CrimeDetails() {

    const { id } = useParams();

    const [crime, setCrime] = useState(null);

    useEffect(() => {

        fetchCrime();

    }, []);

    const fetchCrime = async () => {

        try {

            const response = await API.get(
                `/crime/all`
            );

            const foundCrime = response.data.data.find(
                (c) => c.id === Number(id)
            );

            setCrime(foundCrime);

        } catch (error) {

            console.log(error);
        }
    };

    if (!crime) {

        return <p>Loading...</p>;
    }

    return (

        <div className="flex bg-gray-100 min-h-screen">

            <SideBar />

            <div className="flex-1">

                <Navbar />

                <div className="p-6">

                    <div className="bg-white p-8 rounded-xl shadow-md">

                        <h1 className="text-4xl font-bold mb-4">
                            {crime.title}
                        </h1>

                        <p className="text-gray-700 text-lg mb-6">
                            {crime.description}
                        </p>

                        <p className="mb-4">
                            <span className="font-bold">
                                Location:
                            </span>

                            {" "}

                            {crime.location}
                        </p>

                        <p className="mb-4">
                            <span className="font-bold">
                                Status:
                            </span>

                            {" "}

                            {crime.status}
                        </p>

                    </div>

                </div>

            </div>

        </div>
    );
}

export default CrimeDetails;