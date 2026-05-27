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
      <div className="mt-4">

            <select
                className="border p-2 rounded-lg"
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
                    ml-3
                    bg-green-600
                    text-white
                    px-4
                    py-2
                    rounded-lg
                "
            >
                Save
            </button>

        </div>
    );
}
     
export default UpdateStatus;