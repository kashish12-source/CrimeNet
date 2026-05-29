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
            `/crime/${id}`
        );

        setCrime(response.data);

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

                <div className="
                    bg-white
                    p-8
                    rounded-xl
                    shadow-md
                ">

                    <h1 className="
                        text-4xl
                        font-bold
                        mb-4
                    ">
                        {crime.title}
                    </h1>

                    <p className="
                        text-gray-700
                        text-lg
                        mb-6
                    ">
                        {crime.description}
                    </p>

                    <p className="mb-3">
                        <span className="font-bold">
                            Location:
                        </span>

                        {" "}

                        {crime.location}
                    </p>

                    <p className="mb-6">
                        <span className="font-bold">
                            Status:
                        </span>

                        {" "}

                        {crime.status}
                    </p>

                    {/* INVESTIGATION NOTES */}

                    <div className="mt-10">

                        <h2 className="
                            text-2xl
                            font-bold
                            mb-4
                        ">
                            Investigation Notes
                        </h2>

                        {crime.investigations.length === 0 ? (

                            <p>No investigation notes</p>

                        ) : (

                            crime.investigations.map(
                                (note) => (

                                    <div
                                        key={note.id}
                                        className="
                                            border
                                            rounded-xl
                                            p-4
                                            mb-4
                                        "
                                    >

                                        <p className="font-semibold">
                                            {note.note}
                                        </p>

                                        <p className="
                                            text-sm
                                            text-gray-500
                                            mt-2
                                        ">
                                            {note.created_at}
                                        </p>

                                    </div>
                                )
                            )
                        )}

                    </div>

                    {/* EVIDENCE */}

                    <div className="mt-10">

                        <h2 className="
                            text-2xl
                            font-bold
                            mb-4
                        ">
                            Evidence Files
                        </h2>

                        {crime.evidence.length === 0 ? (

                            <p>No evidence uploaded</p>

                        ) : (

                            crime.evidence.map(
                                (file) => (

                                    <div
                                        key={file.id}
                                        className="
                                            border
                                            rounded-xl
                                            p-4
                                            mb-4
                                            flex
                                            justify-between
                                            items-center
                                        "
                                    >

                                        <div>

                                            <p className="font-semibold">
                                                {file.file_name}
                                            </p>

                                            <p className="text-gray-500">
                                                {file.description}
                                            </p>

                                        </div>

                                        <a
                                            href={`http://localhost:8000/${file.file_path}`}
                                            target="_blank"
                                            rel="noreferrer"
                                            className="
                                                bg-black
                                                text-white
                                                px-4
                                                py-2
                                                rounded-lg
                                            "
                                        >
                                            Open File
                                        </a>

                                    </div>
                                )
                            )
                        )}

                    </div>

                </div>

            </div>

        </div>

    </div>
);


}

export default CrimeDetails;
