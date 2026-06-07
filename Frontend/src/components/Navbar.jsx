import { useNavigate } from "react-router-dom";
import {SunIcon, MoonIcon, ArrowRightOnRectangleIcon, ServerStackIcon} from "@heroicons/react/24/outline";
import {useTheme} from "../context/ThemeContext";

function Navbar() {

    const navigate = useNavigate();

    const user = JSON.parse(
        localStorage.getItem("user")
    );
    const {darkMode,setDarkMode}=useTheme();
    const handleLogout = () => {

        localStorage.removeItem("token");

        localStorage.removeItem("user");

        navigate("/");
    };

    return (

    <div
        className="
            bg-slate-100
            dark:bg-slate-800
            shadow-md
            p-4
            flex
            justify-between
            items-center
            border-b
            dark:border-slate-700
        "
    >

        <h1
            className="
                text-2xl
                font-bold
                text-slate-300
                dark:text-white
            "
        >
            Crime Management System
        </h1>

        <div className="flex items-center gap-4">

            <button
                onClick={() => setDarkMode(!darkMode)}
                title={darkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
                className="
                    p-2
                    rounded-lg
                    bg-slate-200
                    dark:bg-slate-700
                    hover:scale-105
                    transition
                "
            >
                {darkMode ? (
                    <SunIcon className="h-5 w-5 text-yellow-400" />
                ) : (
                    <MoonIcon className="h-5 w-5 text-slate-900" />
                )}
            </button>

            {/* Admin Blockchain Audit Button */}
            {user?.role === "admin" && (
                <button
                    onClick={() => navigate("/blockchain-audit")}
                    title="Blockchain Security Ledger Audit"
                    className="
                        p-2
                        rounded-lg
                        bg-indigo-100
                        dark:bg-indigo-900/50
                        hover:scale-105
                        transition
                        text-indigo-600
                        dark:text-indigo-400
                    "
                >
                    <ServerStackIcon className="h-5 w-5" />
                </button>
            )}

            <div className="text-right">

                <p
                    className="
                        font-semibold
                        dark:text-white
                    "
                >
                    {user?.username}
                </p>

                <p
                    className="
                        text-sm
                        text-slate-500
                        dark:text-slate-300
                        capitalize
                    "
                >
                    {user?.role}
                </p>

            </div>

            <button
                onClick={handleLogout}
                title="Logout from CrimeNet"
                className="
                    flex
                    items-center
                    gap-2
                    bg-rose-500
                    text-white
                    px-4
                    py-2
                    rounded-lg
                    hover:bg-rose-600
                    transition
                "
            >
                <ArrowRightOnRectangleIcon className="w-5 h-5" />
                <span className="hidden sm:inline font-semibold">Logout</span>
            </button>

        </div>

    </div>
);
}

export default Navbar;