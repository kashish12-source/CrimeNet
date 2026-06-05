import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import SideBar from "../components/SideBar";
import Navbar from "../components/Navbar";
import MapPicker from "../components/MapPicker";
import API from "../api/axios";
import { ShieldExclamationIcon } from "@heroicons/react/24/outline";

function ReportCrime() {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [formData, setFormData] = useState({
        title: "",
        description: "",
        location: "",
        latitude: null,
        longitude: null,
        zone: ""
    });
    const [file, setFile] = useState(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        fetchUserStatus();
    }, []);

    const fetchUserStatus = async () => {
        try {
            const res = await API.get("/auth/me");
            setUser(res.data);
        } catch (error) {
            console.error("Error fetching user KYC status", error);
        }
    };

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
    };

    const handleLocationSelect = (lat, lng, resolvedZone) => {
        setFormData((prev) => ({
            ...prev,
            latitude: lat,
            longitude: lng,
            zone: resolvedZone,
            location: prev.location || `Coordinates: ${lat.toFixed(5)}, ${lng.toFixed(5)} (${resolvedZone})`
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (user && (!user.is_verified || !user.phone_verified)) {
            alert("Please complete your KYC and phone verification before reporting a crime!");
            navigate("/kyc");
            return;
        }

        setLoading(true);
        try {
            // Since we upgraded create_crime to accept Form/Multipart data
            const data = new FormData();
            data.append("title", formData.title);
            data.append("description", formData.description);
            data.append("location", formData.location);
            if (formData.latitude) data.append("latitude", formData.latitude);
            if (formData.longitude) data.append("longitude", formData.longitude);
            if (formData.zone) data.append("zone", formData.zone);
            if (file) {
                data.append("file", file);
            }

            await API.post("/crime/crime", data, {
                headers: { "Content-Type": "multipart/form-data" }
            });

            alert("Crime reported successfully! AI analysis is being run on evidence.");
            
            setFormData({
                title: "",
                description: "",
                location: "",
                latitude: null,
                longitude: null,
                zone: ""
            });
            setFile(null);
            navigate("/all-crimes");
        } catch (error) {
            console.log(error);
            alert(
                error.response?.data?.detail ||
                "Failed to report crime"
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex bg-slate-100 dark:bg-slate-800 min-h-screen">
            <SideBar />
            <div className="flex-1 flex flex-col">
                <Navbar />
                <div className="p-6 max-w-4xl mx-auto w-full">
                    <h1 className="text-3xl font-bold mb-2 text-slate-900 dark:text-white">
                        Report Crime
                    </h1>
                    <p className="text-slate-500 dark:text-slate-400 mb-6 text-sm">
                        Submit details and upload photos/videos. The AI scanner will inspect files for classification.
                    </p>

                    {user && (!user.is_verified || !user.phone_verified) && (
                        <div className="mb-6 p-4 rounded-xl bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900 text-amber-800 dark:text-amber-400 flex items-start gap-3">
                            <ShieldExclamationIcon className="w-6 h-6 flex-shrink-0" />
                            <div>
                                <h4 className="font-bold">Verification Required</h4>
                                <p className="text-sm mt-0.5">
                                    You must verify your government ID and phone number before reporting. 
                                    <Link to="/kyc" className="underline ml-1.5 font-semibold hover:text-amber-900">
                                        Go to KYC Portal &rarr;
                                    </Link>
                                </p>
                            </div>
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-2 gap-8 bg-white dark:bg-slate-700 p-6 rounded-2xl shadow-lg border border-slate-200 dark:border-slate-600">
                        {/* Left Side: Fields */}
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                                    Crime Type
                                </label>
                                <select
                                    name="title"
                                    value={formData.title}
                                    onChange={handleChange}
                                    className="w-full border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 dark:text-white p-3 rounded-lg"
                                    required
                                >
                                    <option value="">Select Crime Type</option>
                                    <option value="Theft">Theft / Break-in</option>
                                    <option value="Cyber Crime">Cyber Crime / Ransomware</option>
                                    <option value="Fraud">Financial Fraud / Cloned Cards</option>
                                    <option value="Murder">Murder / Homicide</option>
                                    <option value="Kidnapping">Kidnapping / Abduction</option>
                                    <option value="Vandalism">Vandalism / Property Destruction</option>
                                    <option value="Assault">Physical Assault / Fight</option>
                                    <option value="Arson / Fire">Arson / Incendiary Fire</option>
                                    <option value="Drug Trafficking">Narcotics / Drug Exchange</option>
                                    <option value="Traffic Incident">Traffic Accident / Collision</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                                    Crime Description
                                </label>
                                <textarea
                                    name="description"
                                    value={formData.description}
                                    placeholder="Describe the incident in detail (time, suspects, appearance)..."
                                    className="w-full border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 dark:text-white p-3 rounded-lg"
                                    rows="5"
                                    onChange={handleChange}
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                                    Descriptive Address / Landmark
                                </label>
                                <input
                                    type="text"
                                    name="location"
                                    value={formData.location}
                                    placeholder="e.g. Near Subway station, Block C Street 3"
                                    className="w-full border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 dark:text-white p-3 rounded-lg"
                                    onChange={handleChange}
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                                    Upload Media Evidence (Photo / Video / Audio)
                                </label>
                                <input
                                    type="file"
                                    onChange={handleFileChange}
                                    className="w-full text-sm text-slate-500 file:mr-4 file:py-2.5 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                                    accept="image/*,video/*"
                                />
                                <p className="text-slate-400 text-xs mt-1">
                                    Uploading files triggers the automated AI Safety Scan.
                                </p>
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-xl transition disabled:bg-blue-400 cursor-pointer"
                            >
                                {loading ? "Reporting Case..." : "Report Crime (Secure Submit)"}
                            </button>
                        </div>

                        {/* Right Side: Map Coordinates Pinning */}
                        <div className="flex flex-col">
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                                Pin Crime Location Coordinates
                            </label>
                            <div className="flex-1 min-h-[300px]">
                                <MapPicker 
                                    latitude={formData.latitude} 
                                    longitude={formData.longitude} 
                                    onLocationSelect={handleLocationSelect}
                                    height="350px"
                                />
                            </div>
                            {formData.latitude && (
                                <div className="mt-3 text-xs bg-slate-50 dark:bg-slate-900 p-2.5 rounded-lg border border-slate-200 dark:border-slate-800 space-y-1">
                                    <div className="flex justify-between">
                                        <span className="text-slate-400 font-semibold">Latitude:</span>
                                        <span className="font-mono text-slate-700 dark:text-slate-300">{formData.latitude.toFixed(6)}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-slate-400 font-semibold">Longitude:</span>
                                        <span className="font-mono text-slate-700 dark:text-slate-300">{formData.longitude.toFixed(6)}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-slate-400 font-semibold">Assigned Station Zone:</span>
                                        <span className="font-semibold text-blue-600 dark:text-blue-400">{formData.zone}</span>
                                    </div>
                                </div>
                            )}
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default ReportCrime;