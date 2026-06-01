import { Link } from "react-router-dom";

function SideBar() {

    const user = JSON.parse(
        localStorage.getItem("user")
    );

    return (

        <div className="w-64 bg-slate-100 text-slate-900 dark:bg-slate-800 dark:text-slate-100 p-5 min-h-screen">

            <h1 className="text-2xl font-bold mb-10">
                CrimeNet
            </h1>

            <div className="flex flex-col gap-5">

                <Link
                    to="/dashboard"
                    className="block rounded-lg px-3 py-2 text-slate-900 dark:text-slate-100 hover:bg-slate-200 dark:hover:bg-slate-700 transition"
                >
                    Dashboard
                </Link>

                {/* CITIZEN */}
                {user?.role === "citizen" && (
                    <>
                        <Link
                            to="/report-crime"
                            className="block rounded-lg px-3 py-2 text-slate-900 dark:text-slate-100 hover:bg-slate-200 dark:hover:bg-slate-700 transition"
                        >
                            Report Crime
                        </Link>

                        <Link
                            to="/all-crimes"
                            className="block rounded-lg px-3 py-2 text-slate-900 dark:text-slate-100 hover:bg-slate-200 dark:hover:bg-slate-700 transition"
                        >
                            My Crimes
                        </Link>
                    </>
                )}

                {/* OFFICER */}
                {user?.role === "officer" && (
                    <>
                        <Link
                            to="/assigned-crimes"
                            className="block rounded-lg px-3 py-2 text-slate-900 dark:text-slate-100 hover:bg-slate-200 dark:hover:bg-slate-700 transition"
                        >
                            Assigned Crimes
                        </Link>

                        <Link
                            to="/all-crimes"
                            className="block rounded-lg px-3 py-2 text-slate-900 dark:text-slate-100 hover:bg-slate-200 dark:hover:bg-slate-700 transition"
                        >
                            Crime Records
                        </Link>
                    </>
                )}

                {/* ADMIN */}
                {user?.role === "admin" && (
                    <>
                        <Link
                            to="/all-crimes"
                            className="block rounded-lg px-3 py-2 text-slate-900 dark:text-slate-100 hover:bg-slate-200 dark:hover:bg-slate-700 transition"
                        >
                            All Crimes
                        </Link>

                        <Link
                            to="/officers"
                            className="block rounded-lg px-3 py-2 text-slate-900 dark:text-slate-100 hover:bg-slate-200 dark:hover:bg-slate-700 transition"
                        >
                            Officers
                        </Link>

                        {/* <Link
                            to="/notifications"
                            className="block rounded-lg px-3 py-2 text-slate-900 dark:text-slate-100 hover:bg-slate-200 dark:hover:bg-slate-700 transition"
                        >
                            
                        </Link> */}
                        <Link
                            to="/assign-crime"
                            className="block rounded-lg px-3 py-2 text-slate-900 dark:text-slate-100 hover:bg-slate-200 dark:hover:bg-slate-700 transition"
                        >
                            Assign Crime
                        </Link>
                    </>
                )}

            </div>

        </div>
    );
}

export default SideBar;