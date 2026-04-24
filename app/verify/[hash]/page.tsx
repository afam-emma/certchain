"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

interface Certificate {
  recipient: string;
  course: string;
  universityName: string | null;
  department: string | null;
  grade: string | null;
  issuedAt: string;
  certHash: string;
  template: string;
}

interface BlockchainInfo {
  verified: boolean;
  timestamp?: number;
  status: string;
  txHash?: string | null;
}

interface ApiResponse {
  valid: boolean;
  certificate?: Certificate;
  blockchain?: BlockchainInfo;
  message?: string;
}

export default function VerifyPage() {
  const params = useParams();
  const [data, setData] = useState<ApiResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [downloading, setDownloading] = useState(false);

  useEffect(() => {
    const fetchCertificate = async () => {
      try {
        setLoading(true);
        setError(null);

        const res = await fetch(`/api/certificates/verify/${params.hash}`);
        const apiData: ApiResponse = await res.json();

        if (!res.ok) {
          setError(apiData.message || `HTTP ${res.status}: ${res.statusText}`);
          setLoading(false);
          return;
        }

        setData(apiData);
        setLoading(false);
      } catch (fetchError) {
        setError(fetchError instanceof Error ? fetchError.message : "Unknown fetch error");
        setLoading(false);
      }
    };

    if (params.hash) {
      fetchCertificate();
    }
  }, [params.hash]);

  const handleDownload = async () => {
    if (!data?.certificate?.certHash) return;
    try {
      setDownloading(true);
      const res = await fetch(`/api/certificates/download/${data.certificate.certHash}`);
      if (!res.ok) {
        alert("Failed to download certificate PDF");
        return;
      }
      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${data.certificate.recipient.replace(/\s+/g, "_")}_certificate.pdf`;
      a.click();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      alert("Download error: " + (err instanceof Error ? err.message : "Unknown"));
    } finally {
      setDownloading(false);
    }
  };

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-slate-900 mx-auto"></div>
          <p className="text-gray-500">Verifying certificate...</p>
        </div>
      </div>
    );
  }

  if (error || !data || !data.valid) {
    return (
      <div className="h-screen flex items-center justify-center bg-gray-50">
        <div className="bg-white p-8 rounded-lg border text-center space-y-4 max-w-xl">
          <h1 className="text-xl font-bold text-red-600">
            Invalid Certificate ❌
          </h1>
          <p className="text-gray-500">{error || data?.message || "Certificate not found"}</p>
          <p className="text-sm text-gray-400">
            Use the exact verification hash or certificate ID from the QR/link.
          </p>
        </div>
      </div>
    );
  }

  const isBlockchainConfirmed = data.blockchain?.status === "CONFIRMED" && data.blockchain?.verified;
  const isBlockchainPending = data.blockchain?.status === "PENDING";
  const isBlockchainFailed = data.blockchain?.status === "FAILED";

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-lg mx-auto">
        {/* Blockchain Status Banner */}
        {isBlockchainConfirmed ? (
          <div className="mb-6 bg-emerald-50 border-2 border-emerald-400 rounded-xl p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-emerald-500 flex items-center justify-center text-white text-lg shrink-0">
              ⛓
            </div>
            <div>
              <p className="font-bold text-emerald-800">Secured on Blockchain</p>
              <p className="text-sm text-emerald-700">
                This certificate is verified and permanently recorded on the blockchain.
              </p>
            </div>
          </div>
        ) : isBlockchainPending ? (
          <div className="mb-6 bg-amber-50 border-2 border-amber-400 rounded-xl p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-amber-500 flex items-center justify-center text-white text-lg shrink-0 animate-pulse">
              ⏳
            </div>
            <div>
              <p className="font-bold text-amber-800">Not Yet on Blockchain</p>
              <p className="text-sm text-amber-700">
                This certificate exists in our database but has not been registered on the blockchain yet.
              </p>
            </div>
          </div>
        ) : isBlockchainFailed ? (
          <div className="mb-6 bg-red-50 border-2 border-red-400 rounded-xl p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-red-500 flex items-center justify-center text-white text-lg shrink-0">
              ⚠
            </div>
            <div>
              <p className="font-bold text-red-800">Blockchain Registration Failed</p>
              <p className="text-sm text-red-700">
                This certificate failed to register on the blockchain. Contact the issuer.
              </p>
            </div>
          </div>
        ) : (
          <div className="mb-6 bg-orange-50 border-2 border-orange-400 rounded-xl p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-orange-500 flex items-center justify-center text-white text-lg shrink-0">
              🔗
            </div>
            <div>
              <p className="font-bold text-orange-800">Not Linked to Blockchain</p>
              <p className="text-sm text-orange-700">
                This certificate is not yet linked to the blockchain network.
              </p>
            </div>
          </div>
        )}

        {/* Certificate Card */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className={`text-white text-center py-4 ${isBlockchainConfirmed ? "bg-green-600" : "bg-slate-600"}`}>
            <h1 className="text-2xl font-bold">
              {isBlockchainConfirmed ? "✅ Certificate Verified & Chained" : "📄 Certificate Found"}
            </h1>
          </div>
          <div className="p-6 space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Recipient</label>
              <p className="mt-1 text-lg text-gray-900">{data.certificate?.recipient}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Course</label>
              <p className="mt-1 text-lg text-gray-900">{data.certificate?.course}</p>
            </div>
            {data.certificate?.universityName && (
              <div>
                <label className="block text-sm font-medium text-gray-700">University</label>
                <p className="mt-1 text-lg text-gray-900">{data.certificate.universityName}</p>
              </div>
            )}
            {data.certificate?.department && (
              <div>
                <label className="block text-sm font-medium text-gray-700">Department</label>
                <p className="mt-1 text-lg text-gray-900">{data.certificate.department}</p>
              </div>
            )}
            {data.certificate?.grade && (
              <div>
                <label className="block text-sm font-medium text-gray-700">Grade</label>
                <p className="mt-1 text-lg text-gray-900">{data.certificate.grade}</p>
              </div>
            )}
            <div>
              <label className="block text-sm font-medium text-gray-700">Issued At</label>
              <p className="mt-1 text-lg text-gray-900">
                {data.certificate?.issuedAt ? new Date(data.certificate.issuedAt).toLocaleDateString() : 'N/A'}
              </p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Certificate Hash</label>
              <p className="mt-1 text-xs font-mono text-gray-500 break-all">{data.certificate?.certHash}</p>
            </div>

            {/* Download Button — only for blockchain-confirmed */}
            {isBlockchainConfirmed ? (
              <button
                onClick={handleDownload}
                disabled={downloading}
                className="w-full mt-4 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2"
              >
                {downloading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    Generating PDF...
                  </>
                ) : (
                  <>📥 Download Certificate PDF</>
                )}
              </button>
            ) : (
              <div className="mt-4 p-4 bg-gray-100 rounded-lg text-center">
                <p className="text-sm text-gray-500 font-medium">
                  🔒 PDF download available after blockchain registration
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
