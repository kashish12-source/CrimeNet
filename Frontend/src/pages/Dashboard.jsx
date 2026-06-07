import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import SideBar from "../components/SideBar";
import Navbar from "../components/Navbar";
import DashboardCard from "../components/DashboardCard";
import API from "../api/axios";
import { 
  PieChart, 
  Pie, 
  Cell,
  Tooltip, 
  ResponsiveContainer,
  Legend
} from "recharts";
import { 
  FunnelIcon,
  BellIcon,
  SparklesIcon,
  ShieldCheckIcon,
  ServerStackIcon,
  MapPinIcon,
  PhoneIcon,
  PencilSquareIcon,
  CheckCircleIcon,
  ShieldExclamationIcon,
  DocumentTextIcon,
  MagnifyingGlassIcon
} from "@heroicons/react/24/outline";

function Dashboard() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  // States for data
  const [stats, setStats] = useState({ total_crimes: 0, solved_cases: 0, pending_cases: 0, officers: 0 });
  const [pieChartData, setPieChartData] = useState([]);
  const [recentCrimes, setRecentCrimes] = useState([]);
  const [recentLogs, setRecentLogs] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [search, setSearch] = useState("");
  const [searchResults, setSearchResults] = useState([]);

  // States for UI interactivity
  const [showFilters, setShowFilters] = useState(false);
  const [selectedZone, setSelectedZone] = useState("");
  const [selectedType, setSelectedType] = useState("");
  const [bulkStatus, setBulkStatus] = useState("Investigating");
  const [updatingBulk, setUpdatingBulk] = useState(false);

  // Colors for the Pie Chart slices
  const PIE_COLORS = ["#10b981", "#f59e0b", "#3b82f6"];

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    setUser(storedUser);
    
    fetchDashboardStats();
    fetchChartData();
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

  const fetchChartData = async () => {
    try {
      const res = await API.get("/dashboard/chart-data");
      // Use the crime_status data for our beautiful pie chart
      setPieChartData(res.data.crime_status || []);
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

  const handleBulkUpdateStatus = async () => {
    if (!selectedZone || !selectedType) {
      alert("Please select both a Zone and Crime Type to apply bulk updates.");
      return;
    }
    setUpdatingBulk(true);
    try {
      const crimesRes = await API.get("/admin/crimes");
      const matchingCrimes = crimesRes.data.filter(
        c => c.zone === selectedZone && c.title === selectedType
      );

      if (matchingCrimes.length === 0) {
        alert(`No crimes found matching: ${selectedType} in ${selectedZone}`);
        setUpdatingBulk(false);
        return;
      }

      let updatedCount = 0;
      for (const cr of matchingCrimes) {
        await API.put(`/crime/update-status/${cr.id}`, { status: bulkStatus });
        updatedCount++;
      }

      alert(`Successfully updated ${updatedCount} cases to ${bulkStatus}. Logged securely on blockchain.`);
      fetchDashboardStats();
      fetchRecentCrimes();
      fetchRecentLogs();
      fetchChartData();
    } catch (error) {
      console.error(error);
      alert("Failed to perform bulk update. Please check your permissions.");
    } finally {
      setUpdatingBulk(false);
    }
  };

  const getFilteredCrimesList = () => {
    return recentCrimes.filter(c => {
      const matchesZone = selectedZone ? c.location?.includes(selectedZone) || c.zone === selectedZone : true;
      const matchesType = selectedType ? c.title === selectedType : true;
      return matchesZone && matchesType;
    });
  };

  return (
    <div className="flex bg-slate-100 dark:bg-slate-900 min-h-screen">
      <SideBar />
      <div className="flex-1 flex flex-col w-full overflow-x-hidden">
        <Navbar />
        
        <div className="p-4 md:p-8 space-y-8 max-w-7xl mx-auto w-full">
          
          {/* Welcome Header */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700">
            <div>
              <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
                Welcome, {user?.username || "Guest"}
              </h1>
              <p className="text-slate-500 dark:text-slate-400 mt-1 flex items-center gap-2 text-sm font-medium">
                <ShieldCheckIcon className="w-5 h-5 text-indigo-500" />
                Role: <span className="uppercase font-bold text-indigo-600 dark:text-indigo-400">{user?.role}</span>
              </p>
            </div>
            
            {/* Live Search */}
            <form onSubmit={handleSearch} className="flex gap-2 w-full md:w-auto">
              <div className="relative w-full md:w-64">
                <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search case titles..."
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-700 dark:text-white text-sm focus:ring-2 focus:ring-indigo-500 transition-all outline-none"
                />
              </div>
              <button
                type="submit"
                title="Search Cases"
                className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2.5 rounded-xl font-semibold text-sm transition shadow-md shadow-indigo-500/30"
              >
                Find
              </button>
            </form>
          </div>

          {/* Search Results Drawer */}
          {searchResults.length > 0 && (
            <div className="bg-white dark:bg-slate-800 border border-indigo-200 dark:border-indigo-900/50 rounded-2xl p-5 shadow-lg">
              <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                <MagnifyingGlassIcon className="w-5 h-5 text-indigo-500" /> 
                Search Results
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {searchResults.map((crime) => (
                  <div
                    key={crime.id}
                    onClick={() => navigate(`/crime/${crime.id}`)}
                    className="p-4 bg-slate-50 dark:bg-slate-700/50 hover:bg-indigo-50 dark:hover:bg-slate-700 rounded-xl cursor-pointer transition border border-slate-200 dark:border-slate-600 flex items-center justify-between"
                  >
                    <div>
                      <p className="font-bold text-slate-900 dark:text-white text-sm flex items-center gap-2">
                        {crime.title}
                      </p>
                      <p className="text-xs text-slate-500 mt-1 flex items-center gap-1">
                        <MapPinIcon className="w-3.5 h-3.5" /> {crime.location}
                      </p>
                    </div>
                    <span className="text-xs font-bold px-2 py-1 bg-white dark:bg-slate-800 shadow-sm rounded-lg text-indigo-600 dark:text-indigo-400">
                      {crime.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Role-Specific Banner: Citizen KYC Warning */}
          {user?.role === "citizen" && (!user.is_verified || !user.phone_verified) && (
            <div className="bg-amber-100 dark:bg-amber-900/30 border border-amber-300 dark:border-amber-700/50 p-4 rounded-xl flex items-start gap-4 shadow-sm">
              <ShieldExclamationIcon className="w-8 h-8 text-amber-600 dark:text-amber-500 shrink-0" />
              <div>
                <h3 className="font-bold text-amber-900 dark:text-amber-400 text-lg">Verification Required</h3>
                <p className="text-sm text-amber-800 dark:text-amber-500 mt-1">
                  You must complete your identity verification to report grievances. 
                  <Link to="/kyc" className="underline font-bold ml-2 hover:text-amber-700">Go to KYC Hub &rarr;</Link>
                </p>
              </div>
            </div>
          )}

          {/* Indore 311 Style Citizen Services Hub */}
          {user?.role === "citizen" && (
            <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700">
              <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2 mb-6">
                <SparklesIcon className="w-6 h-6 text-indigo-500" />
                Citizen Quick Services
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <button onClick={() => navigate("/report-crime")} className="flex flex-col items-center justify-center p-6 bg-blue-50 dark:bg-blue-900/20 hover:bg-blue-100 dark:hover:bg-blue-900/40 rounded-2xl transition border border-blue-200 dark:border-blue-800/50 group">
                  <PencilSquareIcon className="w-10 h-10 text-blue-600 dark:text-blue-400 mb-3 group-hover:scale-110 transition-transform" />
                  <span className="font-bold text-blue-900 dark:text-blue-300">Report Grievance</span>
                </button>
                <button onClick={() => navigate("/all-crimes")} className="flex flex-col items-center justify-center p-6 bg-emerald-50 dark:bg-emerald-900/20 hover:bg-emerald-100 dark:hover:bg-emerald-900/40 rounded-2xl transition border border-emerald-200 dark:border-emerald-800/50 group">
                  <DocumentTextIcon className="w-10 h-10 text-emerald-600 dark:text-emerald-400 mb-3 group-hover:scale-110 transition-transform" />
                  <span className="font-bold text-emerald-900 dark:text-emerald-300">Track My Complaints</span>
                </button>
                <button onClick={() => navigate("/kyc")} className="flex flex-col items-center justify-center p-6 bg-indigo-50 dark:bg-indigo-900/20 hover:bg-indigo-100 dark:hover:bg-indigo-900/40 rounded-2xl transition border border-indigo-200 dark:border-indigo-800/50 group">
                  <ShieldCheckIcon className="w-10 h-10 text-indigo-600 dark:text-indigo-400 mb-3 group-hover:scale-110 transition-transform" />
                  <span className="font-bold text-indigo-900 dark:text-indigo-300">Complete KYC</span>
                </button>
                <div className="flex flex-col items-center justify-center p-6 bg-rose-50 dark:bg-rose-900/20 rounded-2xl border border-rose-200 dark:border-rose-800/50">
                  <PhoneIcon className="w-10 h-10 text-rose-600 dark:text-rose-400 mb-3" />
                  <span className="font-bold text-rose-900 dark:text-rose-300">Emergency: 100 / 112</span>
                  <span className="text-xs text-rose-600 dark:text-rose-400 mt-1 font-semibold">Women Helpline: 1090</span>
                </div>
              </div>
            </div>
          )}

          {/* Stats Cards Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <DashboardCard title={user?.role === "citizen" ? "My Reports" : "Total Cases"} value={stats.total_crimes} />
            <DashboardCard title="Solved Cases" value={stats.solved_cases} />
            <DashboardCard title="Pending Action" value={stats.pending_cases} />
            <DashboardCard title={user?.role === "citizen" ? "Security Score" : "Active Officers"} value={user?.role === "citizen" ? "100%" : stats.officers} />
          </div>

          {/* Admin Blockchain Widget */}
          {user?.role === "admin" && (
            <div className="bg-indigo-600 p-6 rounded-2xl shadow-lg text-white flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
                  <ServerStackIcon className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-extrabold tracking-tight">Blockchain Integrity Ledger</h3>
                  <p className="text-indigo-200 text-sm mt-1">All evidence and actions are immutably secured.</p>
                </div>
              </div>
              <button 
                onClick={() => navigate("/blockchain-audit")}
                title="Open Ledger Security Audit"
                className="bg-white text-indigo-700 px-6 py-3 rounded-xl font-bold hover:bg-indigo-50 hover:scale-105 transition shadow-lg flex items-center gap-2 justify-center"
              >
                <CheckCircleIcon className="w-5 h-5" />
                Open Security Audit
              </button>
            </div>
          )}

          {/* Charts & Interactive Feed Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* Left Column: Pie Chart & Filter Toggle */}
            <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 flex flex-col items-center">
              <div className="w-full flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <SparklesIcon className="w-5 h-5 text-indigo-500" />
                  Case Breakdown
                </h3>
                
                {/* Hidden Filter Toggle Icon */}
                <button 
                  onClick={() => setShowFilters(!showFilters)}
                  title="Toggle Filters"
                  className={`p-2 rounded-xl transition ${showFilters ? 'bg-indigo-600 text-white' : 'bg-slate-100 dark:bg-slate-700 text-slate-500 hover:text-indigo-600 dark:text-slate-300'}`}
                >
                  <FunnelIcon className="w-5 h-5" />
                </button>
              </div>

              {/* Filter Dropdown Popover */}
              {showFilters && (
                <div className="w-full bg-slate-50 dark:bg-slate-700/50 p-4 rounded-xl mb-6 border border-slate-200 dark:border-slate-600 animate-fadeIn space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-500 mb-1">Zone Filter</label>
                    <select
                      value={selectedZone}
                      onChange={(e) => setSelectedZone(e.target.value)}
                      className="w-full bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-lg p-2 text-sm outline-none"
                    >
                      <option value="">All Zones</option>
                      <option value="Central Zone (Bhopal)">Central Zone</option>
                      <option value="West Zone (Indore)">West Zone (Indore)</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-500 mb-1">Crime Type</label>
                    <select
                      value={selectedType}
                      onChange={(e) => setSelectedType(e.target.value)}
                      className="w-full bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-lg p-2 text-sm outline-none"
                    >
                      <option value="">All Types</option>
                      <option value="Theft">Theft</option>
                      <option value="Cyber Crime">Cyber Crime</option>
                    </select>
                  </div>
                  {user?.role === "admin" && (
                    <div className="pt-3 border-t border-slate-200 dark:border-slate-600">
                      <label className="block text-xs font-bold text-slate-500 mb-2">Bulk Status Update</label>
                      <div className="flex gap-2">
                        <select
                          value={bulkStatus}
                          onChange={(e) => setBulkStatus(e.target.value)}
                          className="flex-1 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-lg p-2 text-sm outline-none"
                        >
                          <option value="Investigating">Investigating</option>
                          <option value="Solved">Solved</option>
                          <option value="Closed">Closed</option>
                        </select>
                        <button
                          onClick={handleBulkUpdateStatus}
                          disabled={updatingBulk}
                          className="px-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-bold text-xs"
                        >
                          Apply
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* User Friendly Pie Chart */}
              <div className="h-[250px] w-full mt-2">
                {pieChartData.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={pieChartData}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={85}
                        paddingAngle={5}
                        dataKey="value"
                        stroke="none"
                      >
                        {pieChartData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip 
                        contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                        itemStyle={{ fontWeight: 'bold' }}
                      />
                      <Legend verticalAlign="bottom" height={36} iconType="circle" />
                    </PieChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="flex items-center justify-center h-full text-slate-400 text-sm">
                    No graph data available.
                  </div>
                )}
              </div>
            </div>

            {/* Middle Column: Recent Crimes Feed */}
            <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 lg:col-span-1">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2 mb-4">
                <DocumentTextIcon className="w-5 h-5 text-indigo-500" />
                Case Feed
              </h3>
              <div className="space-y-3 max-h-[350px] overflow-y-auto pr-1 custom-scrollbar">
                {getFilteredCrimesList().length > 0 ? (
                  getFilteredCrimesList().map((crime) => (
                    <div
                      key={crime.id}
                      onClick={() => navigate(`/crime/${crime.id}`)}
                      className="p-4 bg-slate-50 dark:bg-slate-700/30 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-xl cursor-pointer transition border border-slate-200 dark:border-slate-600 group"
                    >
                      <div className="flex justify-between items-start">
                        <p className="font-bold text-slate-900 dark:text-white text-sm group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                          {crime.title}
                        </p>
                        <span className="text-[10px] font-bold uppercase px-2 py-1 bg-white dark:bg-slate-800 rounded-lg shadow-sm text-slate-600 dark:text-slate-300">
                          {crime.status}
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 mt-2 flex items-center gap-1">
                        <MapPinIcon className="w-3.5 h-3.5" /> {crime.location}
                      </p>
                    </div>
                  ))
                ) : (
                  <p className="text-slate-500 text-sm text-center py-6">No records found.</p>
                )}
              </div>
            </div>

            {/* Right Column: Activity Alerts */}
            <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 lg:col-span-1">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2 mb-4">
                <BellIcon className="w-5 h-5 text-indigo-500" />
                System Alerts
              </h3>
              <div className="space-y-3 max-h-[350px] overflow-y-auto pr-1">
                {notifications.length > 0 ? (
                  notifications.map((notif) => (
                    <div key={notif.id} className="p-3 bg-indigo-50 dark:bg-indigo-900/20 rounded-xl border-l-4 border-indigo-500">
                      <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">{notif.message}</p>
                    </div>
                  ))
                ) : (
                  <p className="text-slate-500 text-sm text-center py-6">No recent alerts.</p>
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