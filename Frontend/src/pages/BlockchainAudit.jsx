import { useState, useEffect } from "react";
import SideBar from "../components/SideBar";
import Navbar from "../components/Navbar";
import API from "../api/axios";
import { 
  CubeIcon, 
  CheckCircleIcon,
  ExclamationTriangleIcon,
  ArrowPathIcon,
  KeyIcon
} from "@heroicons/react/24/outline";

export default function BlockchainAudit() {
  const [ledger, setLedger] = useState([]);
  const [verifyResult, setVerifyResult] = useState(null);
  const [animatingIndex, setAnimatingIndex] = useState(-1);
  const [validating, setValidating] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchLedger();
  }, []);

  const fetchLedger = async () => {
    setError(null);
    try {
      const response = await API.get("/admin/blockchain/ledger");
      setLedger(response.data);
    } catch (err) {
      console.error(err);
      setError("Failed to fetch blockchain ledger.");
    }
  };

  const handleValidateLedger = async () => {
    setValidating(true);
    setVerifyResult(null);
    
    // Run cool verification step animations
    for (let i = 0; i < ledger.length; i++) {
      setAnimatingIndex(i);
      await new Promise((resolve) => setTimeout(resolve, 300));
    }
    
    setAnimatingIndex(-1);
    
    try {
      const response = await API.get("/admin/blockchain/verify");
      setVerifyResult(response.data);
    } catch (err) {
      console.error(err);
      alert("Error validating ledger");
    } finally {
      setValidating(false);
    }
  };

  return (
    <div className="flex bg-slate-100 dark:bg-slate-800 min-h-screen">
      <SideBar />
      <div className="flex-1 flex flex-col">
        <Navbar />
        <div className="p-6 max-w-6xl mx-auto w-full">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
            <div>
              <h1 className="text-3xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <CubeIcon className="w-8 h-8 text-blue-600 dark:text-blue-400" />
                Blockchain Audit Ledger
              </h1>
              <p className="text-slate-500 dark:text-slate-400 mt-1">
                Cryptographic tamper-proof auditing log of all crime occurrences and status updates.
              </p>
            </div>
            
            <button
              onClick={handleValidateLedger}
              disabled={validating || ledger.length === 0}
              className="px-5 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-xl font-bold shadow-md hover:shadow-lg transition flex items-center gap-2 disabled:from-slate-400 disabled:to-slate-400"
            >
              {validating ? (
                <>
                  <ArrowPathIcon className="w-5 h-5 animate-spin" />
                  Verifying Hash Signatures...
                </>
              ) : (
                <>
                  <CheckCircleIcon className="w-5 h-5" />
                  Validate Ledger Integrity
                </>
              )}
            </button>
          </div>

          {verifyResult && (
            <div className={`p-4 rounded-xl mb-8 border flex items-start gap-3.5 animate-fadeIn ${
              verifyResult.status === "valid" 
                ? "bg-emerald-50 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-400"
                : "bg-rose-50 dark:bg-rose-950/20 border-rose-200 dark:border-rose-800 text-rose-800 dark:text-rose-400"
            }`}>
              {verifyResult.status === "valid" ? (
                <CheckCircleIcon className="w-6 h-6 flex-shrink-0" />
              ) : (
                <ExclamationTriangleIcon className="w-6 h-6 flex-shrink-0" />
              )}
              <div>
                <h3 className="font-bold text-base">Ledger Security Scan Result</h3>
                <p className="text-sm mt-0.5">{verifyResult.message}</p>
                <div className="text-xs font-semibold mt-1.5 flex items-center gap-1">
                  Verified Blocks: <span className="font-mono bg-white/60 dark:bg-slate-900/40 px-1.5 py-0.5 rounded">{verifyResult.verified_blocks}</span>
                </div>
              </div>
            </div>
          )}

          {error && <p className="text-rose-500 font-medium mb-4">{error}</p>}

          <div className="relative border-l-2 border-slate-300 dark:border-slate-600 ml-4 md:ml-8 space-y-8 pb-10">
            {ledger.map((block, index) => {
              const isAnimating = animatingIndex === index;
              let parsedData = {};
              try {
                parsedData = JSON.parse(block.data);
              } catch (e) {
                parsedData = { data: block.data };
              }

              return (
                <div 
                  key={block.id} 
                  className={`relative pl-8 md:pl-12 transition-all duration-300 ${
                    isAnimating ? "scale-102 translate-x-1" : ""
                  }`}
                >
                  {/* Block Node Indicator */}
                  <div className={`absolute -left-[11px] top-1.5 w-5 h-5 rounded-full border-2 transition-all duration-300 ${
                    isAnimating 
                      ? "bg-blue-600 border-blue-600 scale-125 shadow-glow" 
                      : verifyResult && verifyResult.status === "valid"
                        ? "bg-emerald-500 border-emerald-500"
                        : "bg-slate-200 dark:bg-slate-700 border-slate-400"
                  }`} />

                  {/* Block Content Card */}
                  <div className={`bg-white dark:bg-slate-700 border rounded-2xl p-5 shadow-sm transition-all duration-300 ${
                    isAnimating 
                      ? "border-blue-500 ring-2 ring-blue-500/20" 
                      : "border-slate-200 dark:border-slate-600"
                  }`}>
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 dark:border-slate-600 pb-3 mb-4">
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold bg-slate-100 dark:bg-slate-900 text-slate-800 dark:text-slate-200 px-2 py-0.5 rounded text-sm">
                          BLOCK #{block.block_index}
                        </span>
                        <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${
                          block.action === "GENESIS"
                            ? "bg-slate-200 dark:bg-slate-900 text-slate-700 dark:text-slate-300"
                            : block.action === "CRIME_REPORTED"
                              ? "bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-400"
                              : block.action === "STATUS_UPDATED"
                                ? "bg-amber-100 dark:bg-amber-900/30 text-amber-800 dark:text-amber-400"
                                : "bg-emerald-100 dark:bg-emerald-900/30 text-emerald-800 dark:text-emerald-400"
                        }`}>
                          {block.action}
                        </span>
                      </div>
                      <span className="text-xs text-slate-500 dark:text-slate-400">
                        {new Date(block.timestamp).toLocaleString()}
                      </span>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4">
                      {/* Left: Metadata Details */}
                      <div className="bg-slate-50 dark:bg-slate-900/40 p-3.5 rounded-xl text-xs space-y-2">
                        <div className="flex items-center gap-1.5 text-slate-700 dark:text-slate-300 font-semibold mb-2">
                          <KeyIcon className="w-4 h-4 text-slate-500" />
                          Cryptographic Hashes
                        </div>
                        <div className="space-y-1">
                          <div className="text-slate-400 font-semibold">Block Hash</div>
                          <div className="font-mono text-slate-800 dark:text-slate-300 break-all select-all p-1 bg-white dark:bg-slate-950/60 rounded border border-slate-200/60 dark:border-slate-800">
                            {block.hash}
                          </div>
                        </div>
                        <div className="space-y-1">
                          <div className="text-slate-400 font-semibold">Previous Hash</div>
                          <div className="font-mono text-slate-800 dark:text-slate-300 break-all select-all p-1 bg-white dark:bg-slate-950/60 rounded border border-slate-200/60 dark:border-slate-800">
                            {block.previous_hash}
                          </div>
                        </div>
                      </div>

                      {/* Right: Block Payload Data */}
                      <div className="bg-slate-50 dark:bg-slate-900/40 p-3.5 rounded-xl text-xs">
                        <div className="text-slate-700 dark:text-slate-300 font-semibold mb-2">Block Payload</div>
                        <pre className="font-mono text-slate-800 dark:text-slate-300 overflow-x-auto break-all max-h-[140px] p-2 bg-white dark:bg-slate-950/60 rounded border border-slate-200/60 dark:border-slate-800 leading-relaxed">
                          {JSON.stringify(parsedData, null, 2)}
                        </pre>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
