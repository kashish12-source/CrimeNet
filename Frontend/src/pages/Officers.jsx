import { useEffect, useState } from "react";
import SideBar from "../components/SideBar";
import Navbar from "../components/Navbar";
import API from "../api/axios";
import { 
  UserPlusIcon, 
  EnvelopeIcon, 
  KeyIcon, 
  PhoneIcon, 
  HomeIcon, 
  BriefcaseIcon,
  MapPinIcon
} from "@heroicons/react/24/outline";

function Officers() {
  const [officers, setOfficers] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  
  // Create Officer Form State
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    role: "officer",
    address: "",
    phone_number: "",
    specialization: "Theft",
    assigned_area: "Central Zone (Bhopal)"
  });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    setCurrentUser(user);
    fetchOfficers();
  }, []);

  const fetchOfficers = async () => {
    try {
      const response = await API.get("/admin/officers");
      setOfficers(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleCreateOfficer = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await API.post("/admin/officers", formData);
      alert("New Officer Account Created Successfully!");
      
      // Reset form
      setFormData({
        username: "",
        email: "",
        password: "",
        role: "officer",
        address: "",
        phone_number: "",
        specialization: "Theft",
        assigned_area: "Central Zone (Bhopal)"
      });
      setShowForm(false);
      fetchOfficers();
    } catch (error) {
      console.error(error);
      alert(error.response?.data?.detail || "Failed to create officer account");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex bg-slate-100 dark:bg-slate-800 min-h-screen">
      <SideBar />
      <div className="flex-1 flex flex-col">
        <Navbar />
        <div className="p-6 max-w-6xl mx-auto w-full">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Officers Directory</h1>
              <p className="text-slate-500 dark:text-slate-400 mt-1">Manage and deploy station precinct investigators.</p>
            </div>
            
            {currentUser?.role === "admin" && (
              <button
                onClick={() => setShowForm(!showForm)}
                className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold shadow transition flex items-center gap-1.5 text-sm"
              >
                <UserPlusIcon className="w-5 h-5" />
                {showForm ? "View Officers List" : "Register Officer"}
              </button>
            )}
          </div>

          {showForm ? (
            <div className="bg-white dark:bg-slate-700 p-6 rounded-2xl shadow-lg border border-slate-200 dark:border-slate-600 max-w-2xl mx-auto animate-fadeIn">
              <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-2">
                <UserPlusIcon className="w-6 h-6 text-blue-600" />
                Register New Police Officer Account
              </h2>

              <form onSubmit={handleCreateOfficer} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-400 uppercase mb-1.5">
                      Username
                    </label>
                    <input
                      type="text"
                      name="username"
                      value={formData.username}
                      onChange={handleInputChange}
                      placeholder="e.g. Officer_Sharma"
                      className="w-full border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 dark:text-white p-2.5 rounded-lg text-sm"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-400 uppercase mb-1.5">
                      Email Address
                    </label>
                    <div className="relative">
                      <EnvelopeIcon className="w-5 h-5 text-slate-400 absolute left-2.5 top-2.5" />
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        placeholder="officer@crimenet.gov"
                        className="w-full pl-9 border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 dark:text-white p-2.5 rounded-lg text-sm"
                        required
                      />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-400 uppercase mb-1.5">
                      Secret Password
                    </label>
                    <div className="relative">
                      <KeyIcon className="w-5 h-5 text-slate-400 absolute left-2.5 top-2.5" />
                      <input
                        type="password"
                        name="password"
                        value={formData.password}
                        onChange={handleInputChange}
                        placeholder="••••••••"
                        className="w-full pl-9 border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 dark:text-white p-2.5 rounded-lg text-sm"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-400 uppercase mb-1.5">
                      Phone Number
                    </label>
                    <div className="relative">
                      <PhoneIcon className="w-5 h-5 text-slate-400 absolute left-2.5 top-2.5" />
                      <input
                        type="text"
                        name="phone_number"
                        value={formData.phone_number}
                        onChange={handleInputChange}
                        placeholder="+91 XXXXX XXXXX"
                        className="w-full pl-9 border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 dark:text-white p-2.5 rounded-lg text-sm"
                        required
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-400 uppercase mb-1.5">
                    Office / Station Address
                  </label>
                  <div className="relative">
                    <HomeIcon className="w-5 h-5 text-slate-400 absolute left-2.5 top-2.5" />
                    <input
                      type="text"
                      name="address"
                      value={formData.address}
                      onChange={handleInputChange}
                      placeholder="e.g. Police Line, Bhopal"
                      className="w-full pl-9 border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 dark:text-white p-2.5 rounded-lg text-sm"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-400 uppercase mb-1.5">
                      Specialization Specialty
                    </label>
                    <div className="relative">
                      <BriefcaseIcon className="w-5 h-5 text-slate-400 absolute left-2.5 top-2.5" />
                      <select
                        name="specialization"
                        value={formData.specialization}
                        onChange={handleInputChange}
                        className="w-full pl-9 border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 dark:text-white p-2.5 rounded-lg text-sm"
                      >
                        <option value="Theft">Theft / Break-in</option>
                        <option value="Cyber Crime">Cyber Crime</option>
                        <option value="Vandalism">Vandalism</option>
                        <option value="Fraud">Fraud</option>
                        <option value="Assault">Assault</option>
                        <option value="Arson / Fire">Arson</option>
                        <option value="Drug Trafficking">Drug Trafficking</option>
                        <option value="Traffic Incident">Traffic Incident</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-400 uppercase mb-1.5">
                      Assigned Station Zone (Madhya Pradesh)
                    </label>
                    <div className="relative">
                      <MapPinIcon className="w-5 h-5 text-slate-400 absolute left-2.5 top-2.5" />
                      <select
                        name="assigned_area"
                        value={formData.assigned_area}
                        onChange={handleInputChange}
                        className="w-full pl-9 border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 dark:text-white p-2.5 rounded-lg text-sm"
                      >
                        <option value="Central Zone (Bhopal)">Central Zone (Bhopal)</option>
                        <option value="West Zone (Indore)">West Zone (Indore)</option>
                        <option value="East Zone (Jabalpur)">East Zone (Jabalpur)</option>
                        <option value="North Zone (Gwalior)">North Zone (Gwalior)</option>
                        <option value="South Zone (Narmadapuram)">South Zone (Narmadapuram)</option>
                      </select>
                    </div>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold shadow transition disabled:bg-blue-400 mt-2 cursor-pointer"
                >
                  {submitting ? "Registering Account..." : "Create Officer Account"}
                </button>
              </form>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {officers.length === 0 ? (
                <div className="col-span-full bg-white dark:bg-slate-700 p-8 text-center rounded-2xl shadow-md border border-slate-200 dark:border-slate-600">
                  <p className="text-slate-500 font-medium">No officers registered yet.</p>
                  {currentUser?.role === "admin" && (
                    <button
                      onClick={() => setShowForm(true)}
                      className="mt-4 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg text-sm transition"
                    >
                      Add First Officer Account
                    </button>
                  )}
                </div>
              ) : (
                officers.map((officer) => (
                  <div
                    key={officer.id}
                    className="bg-white dark:bg-slate-700 p-5 rounded-2xl shadow border border-slate-200 dark:border-slate-600 flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center gap-3 mb-4">
                        <div className="w-10 h-10 rounded-full bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 flex items-center justify-center font-extrabold uppercase">
                          {officer.username?.slice(0, 2)}
                        </div>
                        <div>
                          <h2 className="font-extrabold text-slate-950 dark:text-white leading-tight">
                            {officer.username}
                          </h2>
                          <span className="text-[10px] bg-slate-100 dark:bg-slate-900 text-slate-500 dark:text-slate-400 px-1.5 py-0.5 rounded font-mono font-bold uppercase mt-1 inline-block">
                            Badge ID #{officer.id}
                          </span>
                        </div>
                      </div>

                      <div className="space-y-2 text-xs border-t border-slate-100 dark:border-slate-600 pt-3">
                        <div className="flex justify-between">
                          <span className="text-slate-400">Email:</span>
                          <span className="font-semibold text-slate-700 dark:text-slate-300">{officer.email}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-400">Phone:</span>
                          <span className="font-semibold text-slate-700 dark:text-slate-300">{officer.phone_number}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-slate-400">Precinct Station:</span>
                          <span className="font-semibold text-blue-600 dark:text-blue-400">{officer.assigned_area || "General"}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-slate-400">Specialty:</span>
                          <span className="font-semibold text-emerald-600 dark:text-emerald-400">{officer.specialization || "None"}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Officers;