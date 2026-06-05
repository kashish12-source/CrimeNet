import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import SideBar from "../components/SideBar";
import Navbar from "../components/Navbar";
import DashboardCard from "../components/DashboardCard";
import API from "../api/axios";
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Legend
} from "recharts";
import { 
  FunnelIcon,
  BellIcon,
  SparklesIcon,
  ShieldCheckIcon,
  ArrowPathIcon
} from "@heroicons/react/24/outline";

function Dashboard() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  // States
  const [stats, setStats] = useState({
    total_crimes: 0,
    solved_cases: 0,
    pending_cases: 0,
    officers: 0,
  });

  const [trends, setTrends] = useState({
    last_24h: [],
    last_week: [],
    last_month: []
  });

  const [timeRange, setTimeRange] = useState("last_week"); // 'last_24h', 'last_week', 'last_month'
  const [recentCrimes, setRecentCrimes] = useState([]);
  const [recentLogs, setRecentLogs] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [search, setSearch] = useState("");
  const [searchResults, setSearchResults] = useState([]);

  // Filters state
  const [selectedZone, setSelectedZone] = useState("");
  const [selectedType, setSelectedType] = useState("");
  const [bulkStatus, setBulkStatus] = useState("Investigating");
  const [updatingBulk, setUpdatingBulk] = useState(false);

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    setUser(storedUser);
    
    fetchDashboardStats();
    fetchTrends();
    fetchRecentCrimes();
    fetchRecentLogs();
    fetchNotifications();
  }, []);

  const fetchDashboardStats = async () => {
    try {
      const res = await API.get("/dashboard/stats");
      setStats(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  const fetchTrends = async () => {
    try {
      const res = await API.get("/dashboard/trends");
      setTrends(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  const fetchRecentCrimes = async () => {
    try {
      const res = await API.get("/dashboard/recent-crimes");
      setRecentCrimes(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  const fetchRecentLogs = async () => {
    try {
      const res = await API.get("/dashboard/recent-logs");
      setRecentLogs(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  const fetchNotifications = async () => {
    try {
      const res = await API.get("/notifications/");
      setNotifications(res.data.slice(0, 5));
    } catch (error) {
      console.log(error);
    }
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!search.trim()) {
      setSearchResults([]);
      return;
    }
    try {
      const res = await API.get(`/dashboard/search?q=${search}`);
      setSearchResults(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  // Bulk update crimes based on Zone & Type (Admin Authority)
  const handleBulkUpdateStatus = async () => {
    if (!selectedZone || !selectedType) {
      alert("Please select both a Zone and Crime Type to filter bulk status updates!");
      return;
    }
    setUpdatingBulk(true);
    try {
      // Custom endpoint simulation: Fetch all crimes, filter, and modify
      const crimesRes = await API.get("/admin/crimes");
      const matchingCrimes = crimesRes.data.filter(
        c => c.zone === selectedZone && c.title === selectedType
      );

      if (matchingCrimes.length === 0) {
        alert(`No crimes found matching: ${selectedType} in ${selectedZone}`);
        setUpdatingBulk(false);
        return;
      }

      // Update statuses consecutively
      let updatedCount = 0;
      for (const cr of matchingCrimes) {
        await API.put(`/crime/update-status/${cr.id}`, { status: bulkStatus });
        updatedCount++;
      }

      alert(`Successfully updated status of ${updatedCount} cases to ${bulkStatus}! logged in blockchain.`);
      fetchDashboardStats();
      fetchRecentCrimes();
      fetchRecentLogs();
    } catch (error) {
      console.error(error);
      alert("Failed to perform bulk zone update: Check if you are assigned or have permission.");
    } finally {
      setUpdatingBulk(false);
    }
  };

  // Filter local lists on dashboard (visual filtering)
  const getFilteredCrimesList = () => {
    return recentCrimes.filter(c => {
      const matchesZone = selectedZone ? c.location?.includes(selectedZone) || c.zone === selectedZone : true;
      const matchesType = selectedType ? c.title === selectedType : true;
      return matchesZone && matchesType;
    });
  };

  const currentChartData = trends[timeRange] || [];

  return (
    <div className="flex bg-slate-100 dark:bg-slate-800 min-h-screen">
      <SideBar />
      <div className="flex-1 flex flex-col">
        <Navbar />
        <div className="p-6 space-y-8 max-w-7xl mx-auto w-full">
          {/* Welcome Header */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white dark:bg-slate-700 p-6 rounded-2xl shadow border border-slate-200 dark:border-slate-600">
            <div>
              <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
                Welcome Back, {user?.username || "Guest"}
              </h1>
              <p className="text-slate-500 dark:text-slate-400 mt-1">
                Role: <span className="font-bold text-blue-600 dark:text-blue-400 uppercase">{user?.role}</span> 
                {user?.role === "officer" && ` | Specialized: ${user?.specialization} | Station: ${user?.assigned_area}`}
              </p>
            </div>
            
            {/* Live Search */}
            <form onSubmit={handleSearch} className="flex gap-2">
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search case titles..."
                className="p-2.5 rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 dark:text-white text-sm"
              />
              <button
                type="submit"
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 rounded-xl font-semibold text-sm transition"
              >
                Search
              </button>
            </form>
          </div>

          {/* Search Results Drawer */}
          {searchResults.length > 0 && (
            <div className="bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-2xl p-5 shadow-lg animate-fadeIn">
              <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-4">Search Results</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {searchResults.map((crime) => (
                  <div
                    key={crime.id}
                    onClick={() => navigate(`/crime/${crime.id}`)}
                    className="p-3 bg-slate-50 dark:bg-slate-900 hover:bg-slate-100 dark:hover:bg-slate-950 rounded-xl cursor-pointer transition border border-slate-200 dark:border-slate-800 flex items-center justify-between"
                  >
                    <div>
                      <p className="font-bold text-slate-900 dark:text-white text-sm">{crime.title}</p>
                      <p className="text-xs text-slate-500 mt-1">{crime.location}</p>
                    </div>
                    <span className="text-xs font-semibold px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-400 rounded">
                      {crime.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Stats Cards Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <DashboardCard title="Total Reported Cases" value={stats.total_crimes} />
            <DashboardCard title="Solved Cases" value={stats.solved_cases} />
            <DashboardCard title="Pending Review" value={stats.pending_cases} />
            <DashboardCard title="Precinct Officers" value={stats.officers} />
          </div>

          {/* Core Analytics: Filters & Analytics Graph */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Col: Filters and Zone Controller */}
            <div className="space-y-6 lg:col-span-1">
              <div className="bg-white dark:bg-slate-700 p-6 rounded-2xl shadow border border-slate-200 dark:border-slate-600">
                <h3 className="text-lg font-bold text-slate-950 dark:text-white flex items-center gap-2 mb-4">
                  <FunnelIcon className="w-5.5 h-5.5 text-blue-600 dark:text-blue-400" />
                  Filter & Bulk Controls
                </h3>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-400 uppercase mb-1.5">
                      Select Station Zone
                    </label>
                    <select
                      value={selectedZone}
                      onChange={(e) => setSelectedZone(e.target.value)}
                      className="w-full border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 dark:text-white p-2 rounded-lg text-sm"
                    >
                      <option value="">All Zones</option>
                      <option value="Central Zone">Central Zone</option>
                      <option value="North Zone">North Zone</option>
                      <option value="South Zone">South Zone</option>
                      <option value="East Zone">East Zone</option>
                      <option value="West Zone">West Zone</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-400 uppercase mb-1.5">
                      Crime Category
                    </label>
                    <select
                      value={selectedType}
                      onChange={(e) => setSelectedType(e.target.value)}
                      className="w-full border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 dark:text-white p-2 rounded-lg text-sm"
                    >
                      <option value="">All Crime Types</option>
                      <option value="Theft">Theft</option>
                      <option value="Cyber Crime">Cyber Crime</option>
                      <option value="Vandalism">Vandalism</option>
                      <option value="Fraud">Fraud</option>
                      <option value="Assault">Assault</option>
                      <option value="Arson / Fire">Arson</option>
                    </select>
                  </div>

                  {user?.role === "admin" && (
                    <div className="pt-4 border-t border-slate-100 dark:border-slate-600 space-y-3">
                      <h4 className="text-xs font-bold text-slate-400 uppercase">
                        Admin Bulk Status Updater
                      </h4>
                      <div className="flex gap-2">
                        <select
                          value={bulkStatus}
                          onChange={(e) => setBulkStatus(e.target.value)}
                          className="flex-1 border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 dark:text-white p-2 rounded-lg text-xs"
                        >
                          <option value="Investigating">Investigating</option>
                          <option value="Solved">Solved</option>
                          <option value="Closed">Closed</option>
                        </select>
                        <button
                          onClick={handleBulkUpdateStatus}
                          disabled={updatingBulk}
                          className="px-3 py-2 bg-slate-800 hover:bg-slate-900 text-white font-bold text-xs rounded-lg transition"
                        >
                          {updatingBulk ? "Applying..." : "Apply"}
                        </button>
                      </div>
                      <p className="text-[10px] text-slate-400">
                        Updates status of all crimes matching the selected zone and crime type. Links update blocks to blockchain.
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Alert Notifications Feed */}
              <div className="bg-white dark:bg-slate-700 p-6 rounded-2xl shadow border border-slate-200 dark:border-slate-600">
                <h3 className="text-lg font-bold text-slate-950 dark:text-white flex items-center gap-2 mb-4">
                  <BellIcon className="w-5.5 h-5.5 text-rose-500" />
                  Recent Alerts Feed
                </h3>
                {notifications.length === 0 ? (
                  <p className="text-slate-500 text-xs">No active alerts.</p>
                ) : (
                  <div className="space-y-3">
                    {notifications.map((notif) => (
                      <div key={notif.id} className="p-2.5 bg-slate-50 dark:bg-slate-900/60 rounded-lg text-xs border-l-2 border-rose-500">
                        <p className="text-slate-800 dark:text-slate-200 font-semibold">{notif.message}</p>
                        <span className="text-[10px] text-slate-400 block mt-1">
                          {new Date(notif.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Right Col: Dynamic Cases Timeline Charts */}
            <div className="bg-white dark:bg-slate-700 p-6 rounded-2xl shadow border border-slate-200 dark:border-slate-600 lg:col-span-2 flex flex-col justify-between">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                <div>
                  <h3 className="text-lg font-bold text-slate-950 dark:text-white">Cases Reported vs Solved</h3>
                  <p className="text-xs text-slate-500">Log progression analysis over time</p>
                </div>
                {/* Time Range Selector Tabs */}
                <div className="bg-slate-100 dark:bg-slate-900 p-1 rounded-xl flex gap-1 self-start">
                  <button
                    onClick={() => setTimeRange("last_24h")}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                      timeRange === "last_24h" 
                        ? "bg-white dark:bg-slate-700 shadow text-slate-900 dark:text-white" 
                        : "text-slate-500 hover:text-slate-800"
                    }`}
                  >
                    24 Hours
                  </button>
                  <button
                    onClick={() => setTimeRange("last_week")}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                      timeRange === "last_week" 
                        ? "bg-white dark:bg-slate-700 shadow text-slate-900 dark:text-white" 
                        : "text-slate-500 hover:text-slate-800"
                    }`}
                  >
                    1 Week
                  </button>
                  <button
                    onClick={() => setTimeRange("last_month")}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                      timeRange === "last_month" 
                        ? "bg-white dark:bg-slate-700 shadow text-slate-900 dark:text-white" 
                        : "text-slate-500 hover:text-slate-800"
                    }`}
                  >
                    1 Month
                  </button>
                </div>
              </div>

              {/* Area Chart mapping */}
              <div className="h-[280px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={currentChartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <defs>
                      <linearGradient id="colorReported" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.4}/>
                        <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                      </linearGradient>
                      <linearGradient id="colorSolved" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#10b981" stopOpacity={0.4}/>
                        <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" className="dark:hidden" />
                    <CartesianGrid strokeDasharray="3 3" stroke="#334155" className="hidden dark:block" />
                    <XAxis dataKey="name" stroke="#94a3b8" fontSize={11} tickLine={false} />
                    <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} />
                    <Tooltip contentStyle={{ fontSize: '12px', borderRadius: '10px' }} />
                    <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
                    <Area 
                      name="Reported Cases" 
                      type="monotone" 
                      dataKey="reported" 
                      stroke="#3b82f6" 
                      strokeWidth={2.5} 
                      fillOpacity={1} 
                      fill="url(#colorReported)" 
                    />
                    <Area 
                      name="Solved Cases" 
                      type="monotone" 
                      dataKey="solved" 
                      stroke="#10b981" 
                      strokeWidth={2.5} 
                      fillOpacity={1} 
                      fill="url(#colorSolved)" 
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* Lists: Recent Crimes & Activity logs */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* List 1: Crime Feed */}
            <div className="bg-white dark:bg-slate-700 p-6 rounded-2xl shadow border border-slate-200 dark:border-slate-600">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-slate-900 dark:text-white">Recent Crime Incident Feed</h2>
                <span className="text-xs text-slate-500">Filtered matching search selection</span>
              </div>
              <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2">
                {getFilteredCrimesList().length > 0 ? (
                  getFilteredCrimesList().map((crime) => (
                    <div
                      key={crime.id}
                      onClick={() => navigate(`/crime/${crime.id}`)}
                      className="p-3 bg-slate-50 hover:bg-slate-100 dark:bg-slate-900 dark:hover:bg-slate-950 rounded-xl cursor-pointer transition border border-slate-200/50 dark:border-slate-800/80 flex items-center justify-between"
                    >
                      <div>
                        <p className="font-bold text-slate-900 dark:text-white text-sm flex items-center gap-1.5">
                          {crime.title}
                          {crime.ai_analysis && (
                            <SparklesIcon className="w-3.5 h-3.5 text-blue-500 animate-pulse" title="AI Audited" />
                          )}
                        </p>
                        <p className="text-xs text-slate-500 mt-1">{crime.location}</p>
                      </div>
                      <div className="text-right">
                        <span className="text-[10px] bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400 px-2 py-0.5 rounded font-mono">
                          {crime.created_at}
                        </span>
                        <span className={`block text-[10px] font-bold mt-1 uppercase ${
                          crime.status === "Solved" ? "text-emerald-500" : "text-amber-500"
                        }`}>
                          {crime.status}
                        </span>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-slate-500 text-sm py-4">No crimes match selection filters.</p>
                )}
              </div>
            </div>

            {/* List 2: Activity logs */}
            <div className="bg-white dark:bg-slate-700 p-6 rounded-2xl shadow border border-slate-200 dark:border-slate-600">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-slate-900 dark:text-white">Activity Ledger Logs</h2>
                <span className="text-xs text-slate-500">Live operational ledger</span>
              </div>
              <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2">
                {recentLogs.length > 0 ? (
                  recentLogs.map((log) => (
                    <div key={log.id} className="p-3 bg-slate-50 dark:bg-slate-900 rounded-xl border border-slate-200/50 dark:border-slate-800/80">
                      <p className="text-sm dark:text-white font-semibold flex items-center justify-between">
                        <span>{log.action}</span>
                        <span className="text-[9px] text-slate-400 bg-blue-100 dark:bg-blue-900/30 px-1.5 py-0.5 rounded font-mono">
                          ID: {log.crime_id}
                        </span>
                      </p>
                      <div className="flex justify-between items-center mt-2.5 text-[10px] text-slate-400">
                        <span>Timestamp: {log.timestamp}</span>
                        {log.performed_by && (
                          <span className="font-semibold text-slate-500">Actor ID: {log.performed_by}</span>
                        )}
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-slate-500 text-sm py-4">No activities logged.</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;