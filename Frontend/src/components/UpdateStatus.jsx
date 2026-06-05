import {useState} from "react";

import {updateCrimeStatus} from "../../Services/crimeService";

function UpdateStatus({crimeId}){
    const [status,setStatus]=useState("");
    const handleUpdate =async()=>{
        try{
            await updateCrimeStatus(crimeId, status);
            alert("Status updated successfully");
        }
        catch(error){
            console.log(error);
            alert("Error updating status");
        }
    };
        
       

return(
      <div className="mt-4 flex gap-3">

            <select
                className="
                    border
                    border-slate-300
                    dark:border-slate-600
                    bg-white
                    dark:bg-slate-900
                    dark:text-white
                    p-2
                    rounded-lg
                "
                onChange={(e) => setStatus(e.target.value)}
            >

                <option>Select Status</option>

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

            <button
                onClick={handleUpdate}
                className="
                    bg-green-600
                    dark:bg-green-500
                    hover:bg-green-700
                    dark:hover:bg-green-600
                    text-white
                    px-4
                    py-2
                    rounded-lg
                    transition
                "
            >
                Save
            </button>

        </div>
    );
}
     
export default UpdateStatus;