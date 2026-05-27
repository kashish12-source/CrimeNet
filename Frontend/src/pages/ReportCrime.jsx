import {useState} from "react";

import SideBar from "../components/SideBar";
import Navbar from "../components/Navbar";

import {createcrime } from "../../Services/crimeService";

function ReportCrime()
{
    const [formData, setFormData]=useState({
        title:"",
        description:"",
        location:"",
    });

    const handleChange =(e) => {
        setFormData({
            ...formData,
             [e.target.name]:e.target.value
        });

    };
    const handleSubmit =async(e) => {
        e.preventDefault();
        try{

            await  createcrime(formData);
            alert("Crime reported successfully!");
        }
        catch (error)
        {
            console.log(error);
        }
    };
    return(
                <div className="flex bg-gray-100 min-h-screen">

            <SideBar />

            <div className="flex-1">

                <Navbar />

                <div className="p-6">

                    <h1 className="text-3xl font-bold mb-6">
                        Report Crime
                    </h1>

                    <form
                        onSubmit={handleSubmit}
                        className="bg-white p-6 rounded-xl shadow-md max-w-2xl"
                    >

                        <input
                            type="text"
                            name="title"
                            placeholder="Crime Title"
                            className="w-full border p-3 rounded-lg mb-4"
                            onChange={handleChange}
                        />

                        <textarea
                            name="description"
                            placeholder="Crime Description"
                            className="w-full border p-3 rounded-lg mb-4"
                            rows="5"
                            onChange={handleChange}
                        />

                        <input
                            type="text"
                            name="location"
                            placeholder="Location"
                            className="w-full border p-3 rounded-lg mb-4"
                            onChange={handleChange}
                        />

                        <button
                            type="submit"
                            className="
                                bg-black
                                text-white
                                px-6
                                py-3
                                rounded-lg
                            "
                        >
                            Submit
                        </button>

                    </form>

                </div>

            </div>

        </div>
    );

    
}
export default ReportCrime;