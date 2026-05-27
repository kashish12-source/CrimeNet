import { useEffect, useState } from "react";

import SideBar from "../components/SideBar";
import Navbar from "../components/Navbar";
import DashboardCard from "../components/DashboardCard";

import { getDashboardStats } from "../../Services/dashboardService";

function Dashboard() {

    const [stats, setStats] = useState({
        total_crimes: 0,
        solved_cases: 0,
        pending_cases: 0,
        officers: 0,
    });

    useEffect(() => {

        fetchDashboardStats();

    }, []);

    const fetchDashboardStats = async () => {

        try {

            const data = await getDashboardStats();

            setStats(data);

        } catch (error) {

            console.log(error);
        }
    };

    return (

        <div className="flex bg-gray-100 min-h-screen">

            {/* Sidebar */}
            <SideBar />

            {/* Main Section */}
            <div className="flex-1">

                {/* Navbar */}
                <Navbar />

                {/* Dashboard Content */}
                <div className="p-6">

                    <h1 className="text-3xl font-bold mb-6">
                        Dashboard
                    </h1>

                    {/* Stats Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">

                        <DashboardCard
                            title="Total Crimes"
                            value={stats.total_crimes}
                        />

                        <DashboardCard
                            title="Solved Cases"
                            value={stats.solved_cases}
                        />

                        <DashboardCard
                            title="Pending Cases"
                            value={stats.pending_cases}
                        />

                        <DashboardCard
                            title="Officers"
                            value={stats.officers}
                        />

                    </div>

                </div>

            </div>

        </div>
    );
}

export default Dashboard;