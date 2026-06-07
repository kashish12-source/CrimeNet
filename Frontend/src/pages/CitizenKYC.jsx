import { useState, useEffect } from "react";
import SideBar from "../components/SideBar";
import Navbar from "../components/Navbar";
import API from "../api/axios";
import { 
  ShieldCheckIcon, 
  ExclamationCircleIcon,
  PhoneIcon,
  IdentificationIcon,
  ArrowPathIcon
} from "@heroicons/react/24/outline";

export default function CitizenKYC() {
  const [user, setUser] = useState(null);
  const [idType, setIdType] = useState("Aadhaar Card");
  const [idNumber, setIdNumber] = useState("");
  const [idFile, setIdFile] = useState(null);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [otpCode, setOtpCode] = useState("");
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [otpResponse, setOtpResponse] = useState("");
  
  const [loading, setLoading] = useState(false);
  const [otpLoading, setOtpLoading] = useState(false);
  const [verificationLogs, setVerificationLogs] = useState([]);
  
  // State for our 10-minute (600 seconds) countdown timer
  const [countdown, setCountdown] = useState(0);

  useEffect(() => {
    fetchProfile();
  }, []);

  // Timer logic: runs every second if an OTP has been sent and countdown > 0
  useEffect(() => {
    let timer;
    if (isOtpSent && countdown > 0) {
      timer = setInterval(() => {
        setCountdown((prev) => prev - 1);
      }, 1000);
    } else if (countdown === 0) {
      clearInterval(timer);
    }
    return () => clearInterval(timer);
  }, [isOtpSent, countdown]);

  const fetchProfile = async () => {
    try {
      const response = await API.get("/auth/me");
      setUser(response.data);
      setPhoneNumber(response.data.phone_number || "");
    } catch (error) {
      console.error("Error fetching profile details:", error);
    }
  };

  const runLogSimulation = (logsList, callback) => {
    setVerificationLogs([]);
    let currentLogs = [];
    logsList.forEach((logText, index) => {
      setTimeout(() => {
        currentLogs = [...currentLogs, logText];
        setVerificationLogs(currentLogs);
        if (index === logsList.length - 1) {
          callback();
        }
      }, (index + 1) * 800);
    });
  };

  const handleIdVerify = async (e) => {
    e.preventDefault();
    if (!idFile || !idNumber) {
      alert("Please upload an ID document and fill in the ID Number.");
      return;
    }

    setLoading(true);
    const mockLogs = [
      "Establishing secure tunnel with National Identity Gateway...",
      `Validating cryptographic signature of uploaded ${idType}...`,
      "Comparing records with Government Civil Registry database...",
      "Biometric matching completed (Confidence: 99.8%)...",
      "Verification response: SUCCESS"
    ];

    runLogSimulation(mockLogs, async () => {
      try {
        const formData = new FormData();
        formData.append("id_proof_type", idType);
        formData.append("id_proof_number", idNumber);
        formData.append("file", idFile);

        await API.post("/auth/citizen/verify-id", formData, {
          headers: { "Content-Type": "multipart/form-data" }
        });
        
        alert("Government ID Verification Successful!");
        fetchProfile();
      } catch (error) {
        console.error(error);
        alert(error.response?.data?.detail || "ID Verification failed");
      } finally {
        setLoading(false);
      }
    });
  };

  const handleSendOtp = async () => {
    if (!phoneNumber) {
      alert("Please enter a phone number.");
      return;
    }
    setOtpLoading(true);
    try {
      const formData = new FormData();
      formData.append("phone_number", phoneNumber);
      
      const response = await API.post("/auth/citizen/send-otp", formData);
      setIsOtpSent(true);
      setCountdown(600); // Start the 10-minute countdown
      setOtpResponse(response.data.otp_code || "");
      alert(`OTP sent! (For simulation/testing, the code is: ${response.data.otp_code})`);
    } catch (error) {
      console.error(error);
      alert("Failed to send OTP code");
    } finally {
      setOtpLoading(false);
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    if (!otpCode) {
      alert("Please enter the 6-digit OTP code.");
      return;
    }
    setOtpLoading(true);
    try {
      const formData = new FormData();
      formData.append("otp_code", otpCode);
      
      await API.post("/auth/citizen/verify-otp", formData);
      alert("Phone number verified successfully!");
      setIsOtpSent(false);
      setOtpCode("");
      fetchProfile();
    } catch (error) {
      console.error(error);
      alert(error.response?.data?.detail || "OTP verification failed");
    } finally {
      setOtpLoading(false);
    }
  };

  if (!user) {
    return <p className="p-6">Loading profile...</p>;
  }

  return (
    <div className="flex bg-slate-100 dark:bg-slate-800 min-h-screen">
      <SideBar />
      <div className="flex-1 flex flex-col">
        <Navbar />
        <div className="p-6 max-w-4xl mx-auto w-full">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-slate-900 dark:text-white">KYC Verification</h1>
              <p className="text-slate-500 dark:text-slate-400 mt-1">
                Verify your identity credentials to gain full authority for posting cases.
              </p>
            </div>
            {user.is_verified && user.phone_verified ? (
              <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-100 dark:bg-emerald-900/30 text-emerald-800 dark:text-emerald-400 text-sm font-semibold">
                <ShieldCheckIcon className="w-5 h-5" /> Fully Verified
              </span>
            ) : (
              <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-amber-100 dark:bg-amber-900/30 text-amber-800 dark:text-amber-400 text-sm font-semibold">
                <ExclamationCircleIcon className="w-5 h-5" /> Verification Pending
              </span>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* ID PROOF SECTION */}
            <div className="bg-white dark:bg-slate-700 p-6 rounded-2xl shadow-lg border border-slate-200 dark:border-slate-600">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-3 bg-blue-50 dark:bg-blue-900/30 rounded-xl">
                  <IdentificationIcon className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-slate-950 dark:text-white">Government ID Proof</h2>
                  <p className="text-xs text-slate-500">Official document scanning</p>
                </div>
              </div>

              {user.is_verified ? (
                <div className="bg-slate-50 dark:bg-slate-900 p-4 rounded-xl space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-slate-500">Document Type</span>
                    <span className="font-semibold text-slate-800 dark:text-slate-200">{user.id_proof_type}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-slate-500">ID Number</span>
                    <span className="font-mono text-slate-800 dark:text-slate-200">****{user.id_proof_number?.slice(-4) || "XXXX"}</span>
                  </div>
                  <div className="pt-2 border-t border-slate-200 dark:border-slate-800 flex items-center justify-center text-xs text-emerald-600 font-semibold gap-1">
                    <ShieldCheckIcon className="w-4 h-4" /> Verified via Secure Govt Portal
                  </div>
                </div>
              ) : (
                <form onSubmit={handleIdVerify} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                      Select ID Type
                    </label>
                    <select
                      value={idType}
                      onChange={(e) => setIdType(e.target.value)}
                      className="w-full border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 dark:text-white p-2.5 rounded-lg"
                    >
                      <option value="Aadhaar Card">Aadhaar Card (12 Digits)</option>
                      <option value="PAN Card">PAN Card (10 Digits)</option>
                      <option value="Passport">Passport</option>
                      <option value="Driving License">Driving License</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                      Enter ID Number
                    </label>
                    <input
                      type="text"
                      value={idNumber}
                      onChange={(e) => setIdNumber(e.target.value)}
                      placeholder="e.g. 5566-7788-9900"
                      className="w-full border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 dark:text-white p-2.5 rounded-lg"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                      Upload Document Copy (JPG/PNG/PDF)
                    </label>
                    <input
                      type="file"
                      onChange={(e) => setIdFile(e.target.files[0])}
                      className="w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                      accept=".jpg,.jpeg,.png,.pdf"
                      required
                    />
                  </div>

                  {loading && (
                    <div className="bg-slate-50 dark:bg-slate-900/50 p-3 rounded-lg border border-slate-200 dark:border-slate-700 space-y-1 font-mono text-xs">
                      {verificationLogs.map((log, idx) => (
                        <div key={idx} className="flex items-center gap-1.5 text-blue-600 dark:text-blue-400">
                          <ArrowPathIcon className="w-3.5 h-3.5 animate-spin" />
                          <span>{log}</span>
                        </div>
                      ))}
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold transition disabled:bg-blue-400"
                  >
                    {loading ? "Authenticating..." : "Verify Identity"}
                  </button>
                </form>
              )}
            </div>

            {/* PHONE OTP SECTION */}
            <div className="bg-white dark:bg-slate-700 p-6 rounded-2xl shadow-lg border border-slate-200 dark:border-slate-600">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-3 bg-indigo-50 dark:bg-indigo-900/30 rounded-xl">
                  <PhoneIcon className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-slate-950 dark:text-white">Phone Authentication</h2>
                  <p className="text-xs text-slate-500">Contact number OTP validation</p>
                </div>
              </div>

              {user.phone_verified ? (
                <div className="bg-slate-50 dark:bg-slate-900 p-4 rounded-xl space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-slate-500">Registered Phone</span>
                    <span className="font-semibold text-slate-800 dark:text-slate-200">{user.phone_number}</span>
                  </div>
                  <div className="pt-2 border-t border-slate-200 dark:border-slate-800 flex items-center justify-center text-xs text-emerald-600 font-semibold gap-1">
                    <ShieldCheckIcon className="w-4 h-4" /> Phone Number OTP Verified
                  </div>
                </div>
              ) : (
                <div className="space-y-5">
                  <div className="flex gap-2">
                    <div className="flex-1">
                      <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                        Phone Number
                      </label>
                      <input
                        type="text"
                        value={phoneNumber}
                        onChange={(e) => setPhoneNumber(e.target.value)}
                        placeholder="+1 555-0199"
                        className="w-full border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 dark:text-white p-2.5 rounded-lg"
                      />
                    </div>
                    <div className="flex items-end">
                      <button
                        type="button"
                        onClick={handleSendOtp}
                        disabled={otpLoading}
                        className="px-4 py-2.5 bg-slate-800 dark:bg-slate-900 hover:bg-slate-900 text-white font-semibold text-sm rounded-lg transition"
                      >
                        {otpLoading ? "Sending..." : "Send OTP"}
                      </button>
                    </div>
                  </div>

                  {isOtpSent && (
                    <form onSubmit={handleVerifyOtp} className="space-y-4 pt-4 border-t border-dashed border-slate-200 dark:border-slate-600">
                      <div>
                        <div className="flex justify-between items-center mb-1">
                          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                            Enter 6-Digit OTP Code
                          </label>
                          <span className={`text-xs font-bold font-mono px-2 py-1 rounded ${countdown > 0 ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400" : "bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400"}`}>
                            {Math.floor(countdown / 60).toString().padStart(2, '0')}:{(countdown % 60).toString().padStart(2, '0')}
                          </span>
                        </div>
                        <input
                          type="text"
                          maxLength={6}
                          value={otpCode}
                          onChange={(e) => setOtpCode(e.target.value)}
                          placeholder="000000"
                          disabled={countdown === 0}
                          className="w-full text-center tracking-widest font-mono text-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 dark:text-white p-2.5 rounded-lg disabled:opacity-50"
                          required
                        />
                      </div>
                      
                      {countdown === 0 ? (
                        <div className="text-xs text-rose-600 bg-rose-50 dark:bg-rose-950/20 p-2.5 rounded-lg font-semibold">
                          OTP has expired. Please send a new OTP.
                        </div>
                      ) : (
                        <div className="text-xs text-amber-600 bg-amber-50 dark:bg-amber-950/20 p-2.5 rounded-lg">
                          Simulated SMS Code: <span className="font-bold font-mono">{otpResponse}</span>
                        </div>
                      )}

                      <button
                        type="submit"
                        disabled={otpLoading || countdown === 0}
                        className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-semibold transition disabled:opacity-50"
                      >
                        Confirm Verification Code
                      </button>
                    </form>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
