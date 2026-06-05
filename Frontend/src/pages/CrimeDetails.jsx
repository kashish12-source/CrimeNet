import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import API from "../api/axios";
import SideBar from "../components/SideBar";
import Navbar from "../components/Navbar";
import MapPicker from "../components/MapPicker";
import { 
  ShieldCheckIcon,
  SparklesIcon, 
  MapPinIcon, 
  BookOpenIcon, 
  PaperClipIcon, 
  CalendarIcon,
  UserIcon,
  CircleStackIcon
} from "@heroicons/react/24/outline";

function CrimeDetails() {
  const { id } = useParams();
  const [crime, setCrime] = useState(null);
  const [user, setUser] = useState(null);
  
  // Officer Forms State
  const [noteText, setNoteText] = useState("");
  const [evidenceDesc, setEvidenceDesc] = useState("");
  const [evidenceFile, setEvidenceFile] = useState(null);
  const [evidenceLat, setEvidenceLat] = useState(null);
  const [evidenceLng, setEvidenceLng] = useState(null);
  const [evidenceZone, setEvidenceZone] = useState("");
  const [statusVal, setStatusVal] = useState("Pending");

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    setUser(storedUser);
    fetchCrime();
  }, []);

  const fetchCrime = async () => {
    try {
      const response = await API.get(`/crime/${id}`);
      setCrime(response.data);
      setStatusVal(response.data.status);
    } catch (error) {
      console.log(error);
    }
  };

  const handleAddNote = async (e) => {
    e.preventDefault();
    if (!noteText.trim()) return;
    setLoading(true);
    try {
      await API.post(`/investigationbook/investigation/${user.id}/${crime.id}`, {
        note: noteText.trim()
      });
      alert("Note added cryptographically to Investigation Notebook.");
      setNoteText("");
      fetchCrime();
    } catch (error) {
      console.error(error);
      alert("Failed to add note");
    } finally {
      setLoading(false);
    }
  };

  const handleUploadEvidence = async (e) => {
    e.preventDefault();
    if (!evidenceFile || !evidenceDesc.trim()) {
      alert("Please upload a file and fill in description.");
      return;
    }
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("description", evidenceDesc.trim());
      formData.append("file", evidenceFile);
      if (evidenceLat) formData.append("latitude", evidenceLat);
      if (evidenceLng) formData.append("longitude", evidenceLng);

      await API.post(`/evidence/uploads/${crime.id}`, formData, {
        headers: { "Content-Type": "multipart/form-data" }
      });

      alert("Evidence uploaded and logged in Blockchain audit trail.");
      setEvidenceDesc("");
      setEvidenceFile(null);
      setEvidenceLat(null);
      setEvidenceLng(null);
      setEvidenceZone("");
      fetchCrime();
    } catch (error) {
      console.error(error);
      alert("Failed to upload evidence");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (status) => {
    setLoading(true);
    try {
      await API.put(`/crime/update-status/${crime.id}`, {
        status: status
      });
      alert(`Case status updated to ${status}. Block appended to chain ledger.`);
      fetchCrime();
    } catch (error) {
      console.error(error);
      alert("Failed to update status");
    } finally {
      setLoading(false);
    }
  };

  const handleCloseCase = async () => {
    setLoading(true);
    try {
      await API.put(`/crime/close/${crime.id}`);
      alert("Case closed successfully. Recorded in immutable ledger.");
      fetchCrime();
    } catch (error) {
      console.error(error);
      alert("Failed to close case");
    } finally {
      setLoading(false);
    }
  };

  const handleLocationSelect = (lat, lng, zone) => {
    setEvidenceLat(lat);
    setEvidenceLng(lng);
    setEvidenceZone(zone);
  };

  if (!crime) {
    return <p className="p-6">Loading details...</p>;
  }

  // Parse AI Analysis if present
  let aiAnalysis = null;
  if (crime.ai_analysis) {
    try {
      aiAnalysis = JSON.parse(crime.ai_analysis);
    } catch (e) {
      console.error("Error parsing AI analysis", e);
    }
  }

  return (
    <div className="flex bg-slate-100 dark:bg-slate-800 min-h-screen">
      <SideBar />
      <div className="flex-1 flex flex-col">
        <Navbar />
        <div className="p-6 max-w-6xl mx-auto w-full">
          {/* Header Card */}
          <div className="bg-white dark:bg-slate-700 p-6 rounded-2xl shadow-lg border border-slate-200 dark:border-slate-600 mb-8">
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
              <div>
                <span className="text-xs bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-400 font-bold px-2.5 py-1 rounded">
                  CASE #{crime.id}
                </span>
                <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white mt-2">
                  {crime.title}
                </h1>
                <div className="flex flex-wrap gap-4 mt-3 text-sm text-slate-500 dark:text-slate-400">
                  <span className="flex items-center gap-1">
                    <CalendarIcon className="w-4 h-4" /> Reported on: {crime.created_at}
                  </span>
                  <span className="flex items-center gap-1 font-semibold text-blue-600 dark:text-blue-400">
                    <MapPinIcon className="w-4 h-4" /> Zone: {crime.zone || "General"}
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className={`px-3 py-1 text-sm font-bold rounded-full ${
                  crime.status === "Solved" 
                    ? "bg-emerald-100 dark:bg-emerald-950/20 text-emerald-800 dark:text-emerald-400"
                    : crime.status === "Closed"
                      ? "bg-slate-200 dark:bg-slate-900 text-slate-700 dark:text-slate-300"
                      : "bg-amber-100 dark:bg-amber-950/20 text-amber-800 dark:text-amber-400"
                }`}>
                  Status: {crime.status}
                </span>
              </div>
            </div>

            <p className="text-slate-700 dark:text-slate-300 mt-6 text-base leading-relaxed border-t border-slate-100 dark:border-slate-600 pt-4">
              <span className="font-bold text-slate-900 dark:text-white block mb-1">Crime Description:</span>
              {crime.description}
            </p>

            <p className="text-sm mt-3 flex items-center gap-1.5 text-slate-600 dark:text-slate-300">
              <span className="font-bold">Reported Address:</span> {crime.location}
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left/Middle Content */}
            <div className="lg:col-span-2 space-y-8">
              {/* Maps Coordinates Visualizer */}
              {crime.latitude && crime.longitude && (
                <div className="bg-white dark:bg-slate-700 p-5 rounded-2xl shadow-lg border border-slate-200 dark:border-slate-600">
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2 mb-4">
                    <MapPinIcon className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                    Crime Location Coordinates
                  </h3>
                  <MapPicker 
                    latitude={crime.latitude} 
                    longitude={crime.longitude} 
                    readonly={true} 
                    height="280px"
                  />
                  <div className="mt-3 flex items-center justify-between text-xs font-mono text-slate-500">
                    <span>Lat: {crime.latitude.toFixed(6)}</span>
                    <span>Lng: {crime.longitude.toFixed(6)}</span>
                  </div>
                </div>
              )}

              {/* AI Scan Analysis Widget */}
              {aiAnalysis && (
                <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-blue-950 text-white p-6 rounded-2xl shadow-xl border border-blue-900 relative overflow-hidden animate-fadeIn">
                  <div className="absolute right-4 top-4 opacity-15">
                    <SparklesIcon className="w-32 h-32 text-blue-400" />
                  </div>
                  <div className="flex items-center gap-2 mb-4">
                    <SparklesIcon className="w-6 h-6 text-blue-400 animate-pulse" />
                    <h3 className="text-lg font-extrabold tracking-wide text-transparent bg-clip-text bg-gradient-to-r from-blue-200 to-indigo-100">
                      AI Safety Scan Report
                    </h3>
                    <span className="ml-auto text-xs font-mono px-2 py-0.5 bg-blue-500/20 text-blue-300 border border-blue-500/30 rounded">
                      {aiAnalysis.police_code}
                    </span>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-2">
                    <div className="bg-slate-800/40 p-3 rounded-lg">
                      <span className="text-xs text-slate-400 block font-semibold">AI Detection</span>
                      <span className="text-sm font-bold text-white block mt-0.5">{aiAnalysis.category}</span>
                    </div>
                    <div className="bg-slate-800/40 p-3 rounded-lg">
                      <span className="text-xs text-slate-400 block font-semibold">Confidence</span>
                      <span className="text-sm font-bold text-emerald-400 block mt-0.5">{aiAnalysis.confidence}</span>
                    </div>
                    <div className="bg-slate-800/40 p-3 rounded-lg">
                      <span className="text-xs text-slate-400 block font-semibold">Threat Level</span>
                      <span className={`text-sm font-bold block mt-0.5 ${
                        aiAnalysis.severity === "Critical" ? "text-rose-400 animate-pulse" : aiAnalysis.severity === "High" ? "text-amber-400" : "text-blue-300"
                      }`}>{aiAnalysis.severity}</span>
                    </div>
                    <div className="bg-slate-800/40 p-3 rounded-lg">
                      <span className="text-xs text-slate-400 block font-semibold">Media Scanned</span>
                      <span className="text-xs font-mono text-slate-300 truncate block mt-1" title={aiAnalysis.media_inspected}>
                        {aiAnalysis.media_inspected}
                      </span>
                    </div>
                  </div>
                  <div className="mt-4 bg-slate-900/60 p-3.5 rounded-lg border border-blue-900/30 text-xs">
                    <span className="font-bold text-blue-300 block mb-1">Detected Objects:</span>
                    <div className="flex flex-wrap gap-1.5">
                      {aiAnalysis.detected_objects.map((obj, i) => (
                        <span key={i} className="px-2 py-0.5 bg-slate-800 rounded font-semibold text-slate-300">
                          {obj}
                        </span>
                      ))}
                    </div>
                  </div>
                  <p className="mt-3.5 text-xs text-slate-300 leading-relaxed border-t border-slate-800 pt-3">
                    <span className="font-bold text-blue-400">Automated Dispatch Recommendation:</span> {aiAnalysis.dispatch_recommendation}
                  </p>
                </div>
              )}

              {/* INVESTIGATION NOTEBOOK */}
              <div className="bg-white dark:bg-slate-700 p-6 rounded-2xl shadow-lg border border-slate-200 dark:border-slate-600">
                <h3 className="text-xl font-bold text-slate-950 dark:text-white flex items-center gap-2 mb-6">
                  <BookOpenIcon className="w-5.5 h-5.5 text-indigo-600" />
                  Investigation Notebook
                </h3>
                {crime.investigations.length === 0 ? (
                  <p className="text-slate-500 text-sm">No encrypted notes recorded.</p>
                ) : (
                  <div className="space-y-4">
                    {crime.investigations.map((note) => (
                      <div key={note.id} className="p-4 bg-slate-50 dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800">
                        <div className="flex items-center gap-1.5 text-xs text-slate-400 mb-2 font-mono">
                          <UserIcon className="w-3.5 h-3.5" /> Officer ID: {note.officer_id}
                          <span className="mx-1.5">&bull;</span>
                          <CalendarIcon className="w-3.5 h-3.5" /> {note.created_at}
                        </div>
                        <p className="text-slate-800 dark:text-slate-200 text-sm leading-relaxed">{note.note}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* EVIDENCE FILE LOGS */}
              <div className="bg-white dark:bg-slate-700 p-6 rounded-2xl shadow-lg border border-slate-200 dark:border-slate-600">
                <h3 className="text-xl font-bold text-slate-950 dark:text-white flex items-center gap-2 mb-6">
                  <PaperClipIcon className="w-5.5 h-5.5 text-emerald-600" />
                  Evidentiary Attachments
                </h3>
                {crime.evidence.length === 0 ? (
                  <p className="text-slate-500 text-sm">No evidence uploaded yet.</p>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {crime.evidence.map((file) => (
                      <div key={file.id} className="p-4 bg-slate-50 dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 flex flex-col justify-between">
                        <div>
                          <p className="font-bold text-slate-900 dark:text-white truncate" title={file.file_name}>
                            {file.file_name}
                          </p>
                          <p className="text-slate-500 dark:text-slate-400 text-xs mt-1 leading-relaxed">
                            {file.description}
                          </p>
                          {file.latitude && (
                            <div className="mt-2.5 flex items-center gap-1 text-[10px] font-mono text-indigo-500">
                              <MapPinIcon className="w-3 h-3" /> Pin: {file.latitude.toFixed(4)}, {file.longitude.toFixed(4)}
                            </div>
                          )}
                        </div>
                        <div className="mt-4 pt-3 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between">
                          <span className="text-[10px] font-bold text-slate-400 flex items-center gap-0.5">
                            <CircleStackIcon className="w-3 h-3 text-blue-500" /> Blockchain Logged
                          </span>
                          <a
                            href={`http://localhost:8000/${file.file_path}`}
                            target="_blank"
                            rel="noreferrer"
                            className="text-xs bg-slate-200 hover:bg-slate-300 dark:bg-slate-800 dark:hover:bg-slate-950 text-slate-800 dark:text-slate-200 px-3 py-1.5 rounded-lg transition font-semibold"
                          >
                            Inspect File
                          </a>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Officer Action Sidebar */}
            <div className="space-y-8">
              {user?.role === "officer" && (
                <>
                  {/* Status update widget */}
                  <div className="bg-white dark:bg-slate-700 p-6 rounded-2xl shadow-lg border border-slate-200 dark:border-slate-600">
                    <h3 className="text-base font-bold text-slate-950 dark:text-white mb-4">Update Case Status</h3>
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        onClick={() => handleUpdateStatus("Investigating")}
                        disabled={loading}
                        className="py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 dark:bg-slate-900 dark:hover:bg-slate-950 dark:text-white font-semibold text-xs rounded-lg transition"
                      >
                        Investigate
                      </button>
                      <button
                        onClick={() => handleUpdateStatus("Solved")}
                        disabled={loading}
                        className="py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs rounded-lg transition"
                      >
                        Solve Case
                      </button>
                      <button
                        onClick={handleCloseCase}
                        disabled={loading}
                        className="py-2.5 bg-slate-800 dark:bg-slate-950 hover:bg-slate-900 text-white font-semibold text-xs rounded-lg transition col-span-2 mt-1"
                      >
                        Close Report File
                      </button>
                    </div>
                  </div>

                  {/* Add Note */}
                  <div className="bg-white dark:bg-slate-700 p-6 rounded-2xl shadow-lg border border-slate-200 dark:border-slate-600">
                    <h3 className="text-base font-bold text-slate-950 dark:text-white mb-4">Append Investigation Note</h3>
                    <form onSubmit={handleAddNote} className="space-y-3">
                      <textarea
                        value={noteText}
                        onChange={(e) => setNoteText(e.target.value)}
                        placeholder="Type confidential progress details here... (Will be Fernet-encrypted)"
                        className="w-full border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 dark:text-white p-2.5 rounded-lg text-sm"
                        rows="4"
                        required
                      />
                      <button
                        type="submit"
                        disabled={loading || !noteText.trim()}
                        className="w-full py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-lg transition"
                      >
                        {loading ? "Encrypting Note..." : "Add Encrypted Note"}
                      </button>
                    </form>
                  </div>

                  {/* Upload Evidence */}
                  <div className="bg-white dark:bg-slate-700 p-6 rounded-2xl shadow-lg border border-slate-200 dark:border-slate-600">
                    <h3 className="text-base font-bold text-slate-950 dark:text-white mb-4">Attach Physical Evidence</h3>
                    <form onSubmit={handleUploadEvidence} className="space-y-4">
                      <div>
                        <label className="block text-[11px] font-semibold text-slate-400 uppercase mb-1">
                          File Document (PDF/JPG/PNG)
                        </label>
                        <input
                          type="file"
                          onChange={(e) => setEvidenceFile(e.target.files[0])}
                          className="w-full text-xs text-slate-500 file:mr-2 file:py-1 file:px-2.5 file:rounded file:border-0 file:bg-blue-50 file:text-blue-700"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-semibold text-slate-400 uppercase mb-1">
                          Item Description
                        </label>
                        <input
                          type="text"
                          value={evidenceDesc}
                          onChange={(e) => setEvidenceDesc(e.target.value)}
                          placeholder="e.g. Broken hammer collected from yard"
                          className="w-full border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 dark:text-white p-2 rounded text-xs"
                          required
                        />
                      </div>
                      
                      {/* Pick Coordinates for evidence */}
                      <div>
                        <label className="block text-[11px] font-semibold text-slate-400 uppercase mb-1">
                          Pin Collection Coordinate Location
                        </label>
                        <MapPicker 
                          latitude={evidenceLat} 
                          longitude={evidenceLng} 
                          onLocationSelect={handleLocationSelect}
                          height="180px"
                        />
                        {evidenceLat && (
                          <div className="text-[10px] text-indigo-500 font-mono mt-1 flex justify-between">
                            <span>Lat: {evidenceLat.toFixed(5)}</span>
                            <span>Lng: {evidenceLng.toFixed(5)}</span>
                          </div>
                        )}
                      </div>

                      <button
                        type="submit"
                        disabled={loading}
                        className="w-full py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-lg transition"
                      >
                        {loading ? "Logging Block..." : "Upload & Link Ledger Block"}
                      </button>
                    </form>
                  </div>
                </>
              )}

              {/* Citizen Details View */}
              {user?.role === "citizen" && crime.assigned_officer_id && (
                <div className="bg-white dark:bg-slate-700 p-6 rounded-2xl shadow-lg border border-slate-200 dark:border-slate-600">
                  <h3 className="text-base font-bold text-slate-950 dark:text-white mb-4">Assigned Investigator</h3>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400 flex items-center justify-center font-bold text-lg uppercase">
                      {crime.assigned_officer?.username?.slice(0, 2) || "CO"}
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-800 dark:text-slate-200 text-sm">
                        {crime.assigned_officer?.username || "Officer assigned"}
                      </h4>
                      <p className="text-xs text-slate-400 mt-0.5">
                        Badge Area: {crime.assigned_officer?.assigned_area || "General Precinct"}
                      </p>
                      <p className="text-xs text-slate-500 mt-1 font-mono">
                        Phone: {crime.assigned_officer?.phone_number || "Confidential"}
                      </p>
                    </div>
                  </div>
                  <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-600 text-[10px] text-slate-400 flex items-center gap-1">
                    <ShieldCheckIcon className="w-4 h-4 text-emerald-600" />
                    Secure citizen transparency enabled.
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CrimeDetails;
