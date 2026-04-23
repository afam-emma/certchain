"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

interface Certificate {
  recipient: string;
  course: string;
  issuedAt: string;
  template: string;
}

interface ApiResponse {
  valid: boolean;
  certificate?: Certificate;
  message?: string;
}

export default function VerifyPage() {
  const params = useParams();
  const [data, setData] = useState<ApiResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md mx-auto bg-white rounded-lg shadow-md overflow-hidden">
        <div className="bg-green-500 text-white text-center py-4">
          <h1 className="text-2xl font-bold">✅ Certificate Verified</h1>
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
          <div>
            <label className="block text-sm font-medium text-gray-700">Template</label>
            <p className="mt-1 text-lg text-gray-900">{data.certificate?.template}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Issued At</label>
            <p className="mt-1 text-lg text-gray-900">
              {data.certificate?.issuedAt ? new Date(data.certificate.issuedAt).toLocaleDateString() : 'N/A'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}