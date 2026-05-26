import { Link } from "react-router-dom";

function SideBar() {

    return (

        <div className="w-64 bg-black text-white p-5">

            <h1 className="text-2xl font-bold mb-10">
                CrimeNet
            </h1>

            <div className="flex flex-col gap-5">

                <Link to="/dashboard">
                    Dashboard
                </Link>

                <Link to="/crimes">
                    Crimes
                </Link>

                <Link to="/officers">
                    Officers
                </Link>

                <Link to="/evidence">
                    Evidence
                </Link>

                <Link to="/notifications">
                    Notifications
                </Link>

            </div>

        </div>
    );
}

export default SideBar;