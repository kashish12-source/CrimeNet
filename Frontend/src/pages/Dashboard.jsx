import { useEffect, useState } from "react";

import SideBar from "../components/SideBar";
import Navbar from "../components/Navbar";
import DashboardCard from "../components/DashboardCard";
import DashboardChart from "../components/DashboardChart";



import InvestigationChart from "../components/InvestigationChart";

import {
  getDashboardStats,
  getDashboardChartData
}
from "../../Services/dashboardService";
function Dashboard() {

    const [stats, setStats] = useState({
        total_crimes: 0,
        solved_cases: 0,
        pending_cases: 0,
        officers: 0,
    });
    const [chartData,setChartData] = useState({
  crime_status:[],
  investigation_progress:[]
});

    useEffect(() => {

  fetchDashboardStats();
  fetchChartData();

}, []);
const fetchDashboardStats = async () => {

    try {

        const data = await getDashboardStats();

        setStats(data);

    } catch (error) {

        console.log(error);
    }
};

    const fetchChartData = async () => {

  try {

    const data =
      await getDashboardChartData();

    setChartData(data);

  } catch(err) {

    console.log(err);
  }
};

   return (

    <div className="flex bg-slate-100 dark:bg-slate-800 min-h-screen">

        <SideBar />

        <div className="flex-1">

            <Navbar />

            <div className="p-6">

                <h1
                    className="
                        text-4xl
                        font-bold
                        mb-8
                        dark:text-white
                    "
                >
                    Dashboard
                </h1>

                {/* Stats Cards */}

                <div
                    className="
                        grid
                        grid-cols-1
                        md:grid-cols-2
                        lg:grid-cols-4
                        gap-6
                        mb-8
                    "
                >

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

                {/* Charts Section */}

                <div
                    className="
                        grid
                        grid-cols-1
                        lg:grid-cols-2
                        gap-6
                    "
                >

                    <DashboardChart
  data={chartData.crime_status}
/>

<InvestigationChart
  data={chartData.investigation_progress}
/>

                </div>

                {/* Recent Activity Section */}

                <div
                    className="
                        grid
                        grid-cols-1
                        lg:grid-cols-2
                        gap-6
                        mt-8
                    "
                >

                    <div
                        className="
                            bg-white
                            dark:bg-slate-700
                            rounded-2xl
                            p-6
                            shadow-lg
                        "
                    >

                        <h2
                            className="
                                text-xl
                                font-bold
                                mb-4
                                dark:text-white
                            "
                        >
                            Recent Crimes
                        </h2>

                        {/* <div className="space-y-4">

                            <div className="border-b pb-3">
                                Theft reported in Bhopal
                            </div>

                            <div className="border-b pb-3">
                                Cyber Fraud investigation
                            </div>

                            <div className="border-b pb-3">
                                Vehicle Theft solved
                            </div>

                        </div> */}

                    </div>

                    <div
                        className="
                            bg-white
                            dark:bg-slate-700
                            rounded-2xl
                            p-6
                            shadow-lg
                        "
                    >

                        <h2
                            className="
                                text-xl
                                font-bold
                                mb-4
                                dark:text-white
                            "
                        >
                            Activity Logs
                        </h2>

                        <div className="space-y-4">

                            <div className="border-b pb-3">
                                Officer assigned to Case #101
                            </div>

                            <div className="border-b pb-3">
                                Case #95 marked Solved
                            </div>

                            <div className="border-b pb-3">
                                New citizen complaint registered
                            </div>

                        </div>

                    </div>

                </div>

            </div>

        </div>

    </div>
);
}

export default Dashboard;