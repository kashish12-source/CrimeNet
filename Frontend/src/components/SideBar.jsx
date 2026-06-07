import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { 
    Squares2X2Icon, 
    PencilSquareIcon, 
    DocumentTextIcon, 
    ShieldCheckIcon, 
    BriefcaseIcon, 
    UsersIcon, 
    UserPlusIcon,
    Bars3Icon,
    XMarkIcon
} from "@heroicons/react/24/outline";

function SideBar() {
    const location = useLocation();
    const user = JSON.parse(localStorage.getItem("user"));
    const [isOpen, setIsOpen] = useState(false);

    // Helper to check if the current path matches the link
    const isActive = (path) => location.pathname === path;

    // Standard link style
    const baseLinkStyle = "flex items-center gap-3 rounded-xl px-4 py-3 font-semibold transition-all duration-200";
    const activeLinkStyle = "bg-blue-600 text-white shadow-md shadow-blue-500/30";
    const inactiveLinkStyle = "text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700/50 hover:text-slate-900 dark:hover:text-white";

    return (
        <>
            {/* Mobile Hamburger Button */}
            <button 
                className="lg:hidden fixed bottom-6 right-6 z-50 p-4 bg-blue-600 text-white rounded-full shadow-lg shadow-blue-500/40"
                onClick={() => setIsOpen(!isOpen)}
                title="Toggle Menu"
            >
                {isOpen ? <XMarkIcon className="w-6 h-6" /> : <Bars3Icon className="w-6 h-6" />}
            </button>

            {/* Backdrop for mobile */}
            {isOpen && (
                <div 
                    className="fixed inset-0 bg-slate-900/50 z-30 lg:hidden backdrop-blur-sm"
                    onClick={() => setIsOpen(false)}
                ></div>
            )}

            {/* Sidebar Drawer */}
            <div className={`
                fixed lg:static inset-y-0 left-0 z-40 
                w-72 bg-white dark:bg-slate-800 
                border-r border-slate-200 dark:border-slate-700 
                p-5 min-h-screen flex flex-col
                transform transition-transform duration-300 ease-in-out
                ${isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
            `}>
                <div className="flex items-center gap-3 mb-10 px-2 mt-2">
                    <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/30">
                        <ShieldCheckIcon className="w-6 h-6 text-white" />
                    </div>
                    <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                        CrimeNet
                    </h1>
                </div>

                <div className="flex flex-col gap-2 flex-1">
                    <Link
                        to="/dashboard"
                        onClick={() => setIsOpen(false)}
                        className={`${baseLinkStyle} ${isActive("/dashboard") ? activeLinkStyle : inactiveLinkStyle}`}
                        title="Dashboard"
                    >
                        <Squares2X2Icon className="w-5 h-5" />
                        <span>Dashboard</span>
                    </Link>

                    {/* CITIZEN LINKS */}
                    {user?.role === "citizen" && (
                        <>
                            <Link
                                to="/report-crime"
                                onClick={() => setIsOpen(false)}
                                className={`${baseLinkStyle} ${isActive("/report-crime") ? activeLinkStyle : inactiveLinkStyle}`}
                                title="Report a New Crime"
                            >
                                <PencilSquareIcon className="w-5 h-5" />
                                <span>Report Crime</span>
                            </Link>

                            <Link
                                to="/all-crimes"
                                onClick={() => setIsOpen(false)}
                                className={`${baseLinkStyle} ${isActive("/all-crimes") ? activeLinkStyle : inactiveLinkStyle}`}
                                title="View My Reported Crimes"
                            >
                                <DocumentTextIcon className="w-5 h-5" />
                                <span>My Crimes</span>
                            </Link>

                            <Link
                                to="/kyc"
                                onClick={() => setIsOpen(false)}
                                className={`${baseLinkStyle} ${isActive("/kyc") ? activeLinkStyle : inactiveLinkStyle}`}
                                title="Verify Identity (KYC)"
                            >
                                <ShieldCheckIcon className="w-5 h-5" />
                                <span>KYC Verification</span>
                            </Link>
                        </>
                    )}

                    {/* OFFICER LINKS */}
                    {user?.role === "officer" && (
                        <>
                            <Link
                                to="/assigned-crimes"
                                onClick={() => setIsOpen(false)}
                                className={`${baseLinkStyle} ${isActive("/assigned-crimes") ? activeLinkStyle : inactiveLinkStyle}`}
                                title="View My Assigned Cases"
                            >
                                <BriefcaseIcon className="w-5 h-5" />
                                <span>Assigned Crimes</span>
                            </Link>

                            <Link
                                to="/all-crimes"
                                onClick={() => setIsOpen(false)}
                                className={`${baseLinkStyle} ${isActive("/all-crimes") ? activeLinkStyle : inactiveLinkStyle}`}
                                title="Browse All Crime Records"
                            >
                                <DocumentTextIcon className="w-5 h-5" />
                                <span>Crime Records</span>
                            </Link>
                        </>
                    )}

                    {/* ADMIN LINKS */}
                    {user?.role === "admin" && (
                        <>
                            <Link
                                to="/all-crimes"
                                onClick={() => setIsOpen(false)}
                                className={`${baseLinkStyle} ${isActive("/all-crimes") ? activeLinkStyle : inactiveLinkStyle}`}
                                title="View All Crimes"
                            >
                                <DocumentTextIcon className="w-5 h-5" />
                                <span>All Crimes</span>
                            </Link>

                            <Link
                                to="/officers"
                                onClick={() => setIsOpen(false)}
                                className={`${baseLinkStyle} ${isActive("/officers") ? activeLinkStyle : inactiveLinkStyle}`}
                                title="Manage Officers"
                            >
                                <UsersIcon className="w-5 h-5" />
                                <span>Officers</span>
                            </Link>

                            <Link
                                to="/assign-crime"
                                onClick={() => setIsOpen(false)}
                                className={`${baseLinkStyle} ${isActive("/assign-crime") ? activeLinkStyle : inactiveLinkStyle}`}
                                title="Assign Cases to Officers"
                            >
                                <UserPlusIcon className="w-5 h-5" />
                                <span>Assign Crime</span>
                            </Link>
                        </>
                    )}
                </div>
                
                {/* Footer simple message */}
                <div className="mt-auto pt-8 pb-4 px-2 text-xs font-semibold text-slate-400 dark:text-slate-500">
                    <p>Secure Portal Portal &copy; 2026</p>
                </div>
            </div>
        </>
    );
}

export default SideBar;