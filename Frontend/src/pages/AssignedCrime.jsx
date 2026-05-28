import { useEffect, useState } from "react";

import SideBar from "../components/SideBar";
import Navbar from "../components/Navbar";

import {
    getAssignedCrimes,
    updateCrimeStatus,
    addInvestigationNote,
    uploadEvidence,
    getCrimeTimeline
} from "../../Services/crimeService";

function AssignedCrimes() {

    const [crimes, setCrimes] = useState([]);

    const [formData, setFormData] =
        useState({});

    const [timelines, setTimelines] =
        useState({});

    const user = JSON.parse(
        localStorage.getItem("user")
    );

    useEffect(() => {

        fetchAssignedCrimes();

    }, []);

    const fetchAssignedCrimes =
        async () => {

        try {

            const data =
                await getAssignedCrimes();

            setCrimes(data || []);

        } catch (error) {

            console.log(error);
        }
    };

    // HANDLE INPUTS
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

    // COMBINED UPDATE
    const handleCaseUpdate =
        async (crimeId) => {

        try {

            const data =
                formData[crimeId];

            // STATUS UPDATE
            if (data?.status) {

                await updateCrimeStatus(
                    crimeId,
                    data.status
                );
            }

            // NOTE UPDATE
            if (data?.note) {

                await addInvestigationNote(
                    user.id,
                    crimeId,
                    data.note
                );
            }

            // FILE UPLOAD
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

            alert(
                "Case updated successfully"
            );

            fetchAssignedCrimes();

        } catch (error) {

            console.log(error);

            alert(
                "Failed to update case"
            );
        }
    };

    // TIMELINE
    const loadTimeline =
        async (crimeId) => {

        try {

            const data =
                await getCrimeTimeline(
                    crimeId
                );

            setTimelines({
                ...timelines,

                [crimeId]: data
            });

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

                    <h1 className="text-4xl font-bold mb-8">
                        Assigned Crimes
                    </h1>

                    <div className="space-y-8">

                        {crimes.map((crime) => (

                            <div
                                key={crime.id}
                                className="
                                    bg-white
                                    rounded-2xl
                                    shadow-md
                                    p-8
                                "
                            >

                                {/* TOP SECTION */}

                                <div className="
                                    flex
                                    justify-between
                                    items-start
                                ">

                                    <div>

                                        <h2 className="
                                            text-3xl
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

                                        <p className="mt-5">
                                            <span className="font-bold">
                                                Location:
                                            </span>

                                            {" "}

                                            {crime.location}
                                        </p>

                                        <div className="mt-3">

                                            <span className="
                                                bg-yellow-100
                                                text-yellow-700
                                                px-4
                                                py-2
                                                rounded-full
                                                text-sm
                                            ">
                                                {crime.status}
                                            </span>

                                        </div>

                                    </div>

                                    <button className="
                                        border
                                        px-5
                                        py-2
                                        rounded-xl
                                        hover:bg-black
                                        hover:text-white
                                        transition
                                    ">
                                        Close Case
                                    </button>

                                </div>

                                {/* DIVIDER */}

                                <div className="
                                    border-t
                                    my-8
                                "></div>

                                {/* UPDATE SECTION */}

                                <div>

                                    <h3 className="
                                        text-2xl
                                        font-bold
                                        mb-2
                                    ">
                                        Update Case Details
                                    </h3>

                                    <p className="
                                        text-gray-500
                                        mb-6
                                    ">
                                        Update status,
                                        investigation notes
                                        and upload evidence
                                        in one place.
                                    </p>

                                    {/* STATUS */}

                                    <div className="mb-6">

                                        <label className="
                                            font-semibold
                                            block
                                            mb-2
                                        ">
                                            Update Status
                                        </label>

                                        <select
                                            className="
                                                w-full
                                                border
                                                p-4
                                                rounded-xl
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

                                    </div>

                                    {/* NOTES */}

                                    <div className="mb-6">

                                        <label className="
                                            font-semibold
                                            block
                                            mb-2
                                        ">
                                            Investigation Notes
                                        </label>

                                        <textarea
                                            placeholder="
                                                Add investigation notes...
                                            "
                                            rows="5"
                                            className="
                                                w-full
                                                border
                                                p-4
                                                rounded-xl
                                            "
                                            onChange={(e) =>
                                                handleChange(
                                                    crime.id,
                                                    "note",
                                                    e.target.value
                                                )
                                            }
                                        />

                                    </div>

                                    {/* FILE */}

                                    <div className="mb-6">

                                        <label className="
                                            font-semibold
                                            block
                                            mb-2
                                        ">
                                            Upload Evidence
                                        </label>

                                        <input
                                            type="file"
                                            className="
                                                w-full
                                                border
                                                p-4
                                                rounded-xl
                                            "
                                            onChange={(e) =>
                                                handleChange(
                                                    crime.id,
                                                    "file",
                                                    e.target.files[0]
                                                )
                                            }
                                        />

                                    </div>

                                    {/* COMBINED BUTTON */}

                                    <div className="
                                        flex
                                        justify-end
                                    ">

                                        <button
                                            onClick={() =>
                                                handleCaseUpdate(
                                                    crime.id
                                                )
                                            }
                                            className="
                                                bg-green-600
                                                text-white
                                                px-10
                                                py-4
                                                rounded-xl
                                                text-lg
                                                font-semibold
                                            "
                                        >
                                            Update Case
                                        </button>

                                    </div>

                                </div>

                                {/* TIMELINE */}

                                <div className="mt-8">

                                    <button
                                        onClick={() =>
                                            loadTimeline(
                                                crime.id
                                            )
                                        }
                                        className="
                                            bg-black
                                            text-white
                                            px-5
                                            py-3
                                            rounded-xl
                                        "
                                    >
                                        View Timeline
                                    </button>

                                    <div className="mt-5">

                                        {timelines[
                                            crime.id
                                        ]?.map(
                                            (
                                                item,
                                                index
                                            ) => (

                                                <div
                                                    key={index}
                                                    className="
                                                        border-l-4
                                                        border-black
                                                        pl-4
                                                        mb-4
                                                    "
                                                >

                                                    <p className="
                                                        font-semibold
                                                    ">
                                                        {
                                                            item.event
                                                        }
                                                    </p>

                                                    <p className="
                                                        text-sm
                                                        text-gray-500
                                                    ">
                                                        {
                                                            item.timestamp
                                                        }
                                                    </p>

                                                </div>
                                            )
                                        )}

                                    </div>

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