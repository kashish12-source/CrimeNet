import { Link } from "react-router-dom";

function SideBar() {

    const user = JSON.parse(
        localStorage.getItem("user")
    );

    return (

        <div className="w-64 bg-black text-white p-5 min-h-screen">

            <h1 className="text-2xl font-bold mb-10">
                CrimeNet
            </h1>

            <div className="flex flex-col gap-5">

                <Link to="/dashboard">
                    Dashboard
                </Link>

                {/* CITIZEN */}
                {user?.role === "citizen" && (
                    <>
                        <Link to="/report-crime">
                            Report Crime
                        </Link>

                        <Link to="/all-crimes">
                            My Crimes
                        </Link>
                    </>
                )}

                {/* OFFICER */}
                {user?.role === "officer" && (
                    <>
                        <Link to="/assigned-crimes">
                            Assigned Crimes
                        </Link>

                        <Link to="/all-crimes">
                            Crime Records
                        </Link>
                    </>
                )}

                {/* ADMIN */}
                {user?.role === "admin" && (
                    <>
                        <Link to="/all-crimes">
                            All Crimes
                        </Link>

                        <Link to="/officers">
                            Officers
                        </Link>

                        <Link to="/notifications">
                            Notifications
                        </Link>
                        <Link to="/assign-crime">
    Assign Crime
</Link>
                    </>
                )}

            </div>

        </div>
    );
}

export default SideBar;