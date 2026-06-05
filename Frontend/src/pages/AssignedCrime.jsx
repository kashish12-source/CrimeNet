import { useEffect, useState } from "react";

import { useNavigate } from "react-router-dom";

import SideBar from "../components/SideBar";
import Navbar from "../components/Navbar";

import API from "../../src/api/axios";

import {
getAssignedCrimes
} from "../../Services/officerService";

import {
addInvestigationNote
} from "../../Services/investigationService";

import {
uploadEvidence
} from "../../Services/evidenceService";

function AssignedCrimes() {


const navigate = useNavigate();

const [crimes, setCrimes] = useState([]);

const [formData, setFormData] = useState({});

const user = JSON.parse(
    localStorage.getItem("user")
);

useEffect(() => {

    fetchAssignedCrimes();

}, []);

const fetchAssignedCrimes = async () => {

    try {

        const response = await getAssignedCrimes();

        setCrimes(response.data || []);

    } catch (error) {

        console.log(error);
    }
};

const handleChange = (
    crimeId,
    field,
    value
) => {

    setFormData({

        ...formData,

        [crimeId]: {

            ...formData[crimeId],

            [field]: value
        }
    });
};

const handleCaseUpdate = async (crimeId) => {

    try {

        const data = formData[crimeId];

        // STATUS
        if (data?.status) {

            await API.put(
                `/crime/update-status/${crimeId}`,
                {
                    status: data.status
                }
            );
        }

        // NOTES
        if (data?.note) {

            await addInvestigationNote(
                user.id,
                crimeId,
                data.note
            );
        }

        // EVIDENCE
        if (data?.file) {

            const evidenceData =
                new FormData();

            evidenceData.append(
                "description",
                "Crime Evidence"
            );

            evidenceData.append(
                "file",
                data.file
            );

            await uploadEvidence(
                crimeId,
                evidenceData
            );
        }

        alert("Case updated");

        fetchAssignedCrimes();

    } catch (error) {

        console.log(error);

        alert("Update failed");
    }
};

// CLOSE CASE
const closeCase = async (crimeId) => {

    try {

        await API.put(
            `/crime/close/${crimeId}`
        );

        alert("Case closed");

        fetchAssignedCrimes();

    } catch (error) {

        console.log(error);

        alert("Failed to close case");
    }
};

return (

    <div className="flex bg-slate-100 dark:bg-slate-800 min-h-screen">

        <SideBar />

        <div className="flex-1">

            <Navbar />

            <div className="p-6">

                <h1 className="text-4xl font-bold mb-8 text-slate-900 dark:text-white">
                    Assigned Crimes
                </h1>

                <div className="space-y-8">

                    {crimes.map((crime) => (

                        <div
                            key={crime.id}
                            className="
                                bg-white
                                dark:bg-slate-700
                                rounded-2xl
                                shadow-md
                                p-8
                            "
                        >

                            <div className="
                                flex
                                justify-between
                                items-start
                            ">

                                <div>

                                    <h2 className="
                                        text-3xl
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

                                    <p className="mt-4 text-slate-900 dark:text-slate-100">
                                        <span className="font-bold">
                                            Location:
                                        </span>

                                        {" "}

                                        {crime.location}
                                    </p>

                                    <div className="mt-4">

                                        <span className="
                                            bg-yellow-100
                                            dark:bg-yellow-900
                                            text-yellow-700
                                            dark:text-yellow-100
                                            px-4
                                            py-2
                                            rounded-full
                                        ">
                                            {crime.status}
                                        </span>

                                    </div>

                                </div>

                                <div className="flex gap-3">

                                    <button
                                        onClick={() =>
                                            navigate(
                                                `/crime/${crime.id}`
                                            )
                                        }
                                        className="
                                            bg-blue-600
                                            dark:bg-blue-500
                                            hover:bg-blue-700
                                            dark:hover:bg-blue-600
                                            text-white
                                            px-5
                                            py-2
                                            rounded-xl
                                            transition
                                        "
                                    >
                                        Open
                                    </button>

                                    <button
                                        onClick={() =>
                                            closeCase(crime.id)
                                        }
                                        className="
                                            border
                                            border-slate-300
                                            dark:border-slate-600
                                            text-slate-900
                                            dark:text-slate-100
                                            hover:bg-slate-100
                                            dark:hover:bg-slate-600
                                            px-5
                                            py-2
                                            rounded-xl
                                            transition
                                        "
                                    >
                                        Close Case
                                    </button>

                                </div>

                            </div>

                            <div className="border-t border-slate-300 dark:border-slate-600 my-8"></div>

                            <div>

                                <h3 className="
                                    text-2xl
                                    font-bold
                                    mb-4
                                    text-slate-900
                                    dark:text-white
                                ">
                                    Update Case
                                </h3>

                                <select
                                    className="
                                        w-full
                                        border
                                        border-slate-300
                                        dark:border-slate-600
                                        bg-white
                                        dark:bg-slate-900
                                        dark:text-white
                                        p-4
                                        rounded-xl
                                        mb-4
                                    "
                                    onChange={(e) =>
                                        handleChange(
                                            crime.id,
                                            "status",
                                            e.target.value
                                        )
                                    }
                                >

                                    <option>
                                        Select Status
                                    </option>

                                    <option value="Pending">
                                        Pending
                                    </option>

                                    <option value="Investigating">
                                        Investigating
                                    </option>

                                    <option value="Solved">
                                        Solved
                                    </option>

                                    <option value="Closed">
                                        Closed
                                    </option>

                                </select>

                                <textarea
                                    rows="5"
                                    placeholder="Add note..."
                                    className="
                                        w-full
                                        border
                                        border-slate-300
                                        dark:border-slate-600
                                        bg-white
                                        dark:bg-slate-900
                                        dark:text-white
                                        p-4
                                        rounded-xl
                                        mb-4
                                    "
                                    onChange={(e) =>
                                        handleChange(
                                            crime.id,
                                            "note",
                                            e.target.value
                                        )
                                    }
                                />

                                <input
                                    type="file"
                                    className="
                                        w-full
                                        border
                                        border-slate-300
                                        dark:border-slate-600
                                        bg-white
                                        dark:bg-slate-900
                                        dark:text-white
                                        p-4
                                        rounded-xl
                                        mb-4
                                    "
                                    onChange={(e) =>
                                        handleChange(
                                            crime.id,
                                            "file",
                                            e.target.files[0]
                                        )
                                    }
                                />

                                <button
                                    onClick={() =>
                                        handleCaseUpdate(
                                            crime.id
                                        )
                                    }
                                    className="
                                        bg-green-600
                                        dark:bg-green-500
                                        hover:bg-green-700
                                        dark:hover:bg-green-600
                                        text-white
                                        px-8
                                        py-3
                                        rounded-xl
                                        transition
                                    "
                                >
                                    Update Case
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
