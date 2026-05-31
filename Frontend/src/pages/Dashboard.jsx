import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import SideBar from "../components/SideBar";
import Navbar from "../components/Navbar";
import DashboardCard from "../components/DashboardCard";
import DashboardChart from "../components/DashboardChart";




import InvestigationChart from "../components/InvestigationChart";

import {
    getDashboardStats,
    getDashboardChartData,
    getRecentCrimes,
    getRecentLogs,
    getInvestigationProgress,
    searchCrimes
} from "../../Services/dashboardService";


function Dashboard() {

    const [stats, setStats] = useState({
        total_crimes: 0,
        solved_cases: 0,
        pending_cases: 0,
        officers: 0,
    });
    const navigate = useNavigate();
    const [chartData,setChartData] = useState({
    crime_status:[],
    investigation_progress:[]
    });
    const [recentCrimes, setRecentCrimes] = useState([]);
    const[recentLogs,setRecentLogs]=useState([]);
    const[investigationProgress,setInvestigationProgress]=useState([]);
    const[search ,setSearch] = useState("");
    const[searchResults,setSearchResults] = useState([]);


useEffect(() => {
    fetchDashboardStats();
    fetchChartData();
    fetchRecentCrimes();
    fetchRecentLogs();
    fetchInvestigationProgress();
}, []);
const fetchInvestigationProgress = async() => {
    try{
        const data = await getInvestigationProgress();  
        setInvestigationProgress(data);
        
    }
    catch(error)
    {
        console.log(error);
        alert("failed to fetch investigation progress data");
    }
}
const fetchRecentLogs = async () => {
    try {
        const data = await getRecentLogs();
        setRecentLogs(data);
    } catch (error) {
        console.log(error);
        alert("failed to fetch recent logs");
    }
};

const fetchRecentCrimes = async() => {
    try{
        const data= await getRecentCrimes();
        setRecentCrimes(data);

    }
    catch(error)
    {
        console.log(error);
        alert("failed to fetch recent crimes");
    }
};
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
const handleSearch = async (query = search) => {

    try {

        const data = await searchCrimes(query);

        setSearchResults(data);

    }
    catch(error) {

        console.log(error);
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
                <div
    className="
        flex
        gap-3
        mb-8
    "
>

    <input
        type="text"
        value={search}
        onChange={(e) => {

    const value = e.target.value;

    setSearch(value);

    if(value.trim()) {

        handleSearch(value);

    } else {

        setSearchResults([]);
    }
}}
        placeholder="Search Crimes..."
        className="
            flex-1
            p-3
            rounded-lg
            border
            border-slate-300
            dark:bg-slate-700
            dark:text-white
            dark:border-slate-600
        "
    />

    <button
        onClick={handleSearch}
        className="
            px-5
            py-3
            bg-blue-600
            text-white
            rounded-lg
            hover:bg-blue-700
        "
    >
        Search
    </button>

</div>

{
    searchResults.length > 0 && (

        <div
            className="
                bg-white
                dark:bg-slate-700
                rounded-2xl
                p-6
                shadow-lg
                mb-8
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
                Search Results
            </h2>

            <div className="space-y-4">

                {
    searchResults.map((crime) => (

        <div
            key={crime.id}
            onClick={() =>
                navigate(`/crime/${crime.id}`)
            }
            className="
                border-b
                pb-3
                cursor-pointer
                hover:bg-slate-100
                dark:hover:bg-slate-600
                p-2
                rounded-lg
                transition
            "
        >

            <p
                className="
                    font-semibold
                    dark:text-white
                "
            >
                {crime.title}
            </p>

            <p
                className="
                    text-sm
                    text-slate-500
                "
            >
                {crime.location}
            </p>

            <p
                className="
                    text-xs
                    text-slate-400
                "
            >
                {crime.status}
            </p>

        </div>

    ))
}

            </div>

        </div>

    )
}

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
  data={investigationProgress}
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
                        

                        <div className="space-y-4">

    {
        recentCrimes.length > 0
        ?
        recentCrimes.map((crime) => (

            <div
                key={crime.id}
                className="
                    border-b
                    pb-3
                "
            >

                <p
                    className="
                        font-semibold
                        dark:text-white
                    "
                >
                    {crime.title}
                </p>

                <p
                    className="
                        text-sm
                        text-slate-500
                    "
                >
                    {crime.location}
                </p>

                <p
                    className="
                        text-xs
                        text-slate-400
                    "
                >
                    {crime.created_at}
                </p>

            </div>

        ))
        :
        (
            <p
                className="
                    text-slate-500
                "
            >
                No crimes found
            </p>
        )
    }

</div>

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
                        {
                            recentLogs.length > 0 ? (
                                recentLogs.map((log) => (
                                    <div key={log.id} className="border-b pb-3">
                                        <p className="text-sm dark:text-white font-semibold">{log.action}</p>
                                        <p className="text-xs text-slate-400">{log.timestamp}</p>
                                        {log.performed_by && (
                                            <p className="text-xs text-slate-500">By: {log.performed_by}</p>
                                        )}
                                    </div>
                                ))
                            ) : (
                                <p className="text-slate-500">No activity logs found</p>
                            )
                        }

                        </div>

                    </div>

                </div>

            </div>

        </div>

    </div>
);
}

export default Dashboard;