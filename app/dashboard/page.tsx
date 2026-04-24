"use client";

import { useEffect, useState, useCallback } from "react";
import * as XLSX from "xlsx";
import { Category, Template, CertificateResult } from "./types";
import BulkUploadPanel from "./components/BulkUploadPanel";
import CertificatePreview from "./components/CertificatePreview";

import { useWeb3 } from "@/lib/web3/context";
import { useCertificateBlockchain } from "@/lib/web3/useCertificateBlockchain";

export default function Dashboard() {
  const { isConnected, account, connect, disconnect, error: walletError } = useWeb3();
  const { registerCertificate } = useCertificateBlockchain();

  const [name, setName] = useState(""); 
  const [course, setCourse] = useState("");
  const [universityName, setUniversityName] = useState("");
  const [department, setDepartment] = useState("");
  const [grade, setGrade] = useState("");
  const [issuingCert, setIssuingCert] = useState(false);
  const [previewPdf, setPreviewPdf] = useState('');
  const [isPreviewLoading, setIsPreviewLoading] = useState(false);

  // Bulk upload state
  const [bulkFile, setBulkFile] = useState<File | null>(null);
  const [uploadingBulk, setUploadingBulk] = useState(false);
  const [bulkResults, setBulkResults] = useState<any>(null);
  const [bulkHeaders, setBulkHeaders] = useState<string[]>([]);
  const [bulkPreview, setBulkPreview] = useState<Record<string, any>[]>([]);
  const [nameColumn, setNameColumn] = useState("");
  const [courseColumn, setCourseColumn] = useState("");
  const [universityColumn, setUniversityColumn] = useState("");
  const [departmentColumn, setDepartmentColumn] = useState("");
  const [gradeColumn, setGradeColumn] = useState("");
  const [bulkSheetName, setBulkSheetName] = useState<string | null>(null);

  // Single cert results
  const [singleResults, setSingleResults] = useState<CertificateResult[]>([]);

  // Base URL for verify links
  const baseUrl = typeof window !== 'undefined' ? window.location.origin : '';

  // Register single cert function
  const registerSingleCert = async (hash: string) => {
    if (!isConnected) {
      alert('Please connect your wallet first');
      return;
    }

    try {
      const result = await registerCertificate(hash);
      if (result.success && result.transactionHash) {
        // Update backend status
        await fetch('/api/certificates/blockchain/register', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ 
            certHash: hash, 
            txHash: result.transactionHash 
          }),
        });
        alert('Certificate registered on blockchain!');
      } else {
        alert(result.error || 'Registration failed. Check Issuance page.');
      }
    } catch (err) {
      alert('Registration error: ' + (err as Error).message);
    }
  };

  const handlePreview = async () => {
    if (!name.trim() || !course.trim()) {
      alert("Please enter recipient name and course");
      return;
    }

    setIsPreviewLoading(true);
    setPreviewPdf('');

    try {
      const bodyData = {
        name,
        course,
        universityName,
        department,
        grade,
        preview: true
      };

      const res = await fetch("/api/certificates/issue", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(bodyData),
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({ error: `Server error ${res.status}` }));
        throw new Error(errorData.error || `Preview failed: ${res.status}`);
      }

      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      setPreviewPdf(url);
    } catch (err) {
      alert(`Preview error: ${err instanceof Error ? err.message : 'Unknown'}`);
    } finally {
      setIsPreviewLoading(false);
    }
  };

  // Cleanup blob URL
  useEffect(() => {
    return () => {
      if (previewPdf) {
        URL.revokeObjectURL(previewPdf);
      }
    };
  }, [previewPdf]);

  const handleGenerate = async () => {
    if (!name.trim()) {
      alert("Please enter recipient name");
      return;
    }

    if (!course.trim()) {
      alert("Please enter course/program");
      return;
    }

    try {
      setIssuingCert(true);
      const bodyData = {
        name,
        course,
        universityName,
        department,
        grade,
        walletAddress: isConnected ? account : null
      };

      const res = await fetch("/api/certificates/issue", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(bodyData),
      });

      if (!res.ok) {
        throw new Error("Failed to generate certificate");
      }

      const certHash = res.headers.get('X-Cert-Hash');
      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);

      const a = document.createElement("a");
      a.href = url;
      a.download = `${name.replace(/\s+/g, "_")}_certificate.pdf`;
      a.click();
      window.URL.revokeObjectURL(url);

      if (certHash) {
        setSingleResults([{
          name,
          course,
          hash: certHash,
          verifyUrl: `${baseUrl}/verify/${certHash}`
        }]);
        alert("Certificate generated and saved successfully! Ready for blockchain registration below.");
      } else {
        alert("Certificate generated successfully!");
      }
      setName("");
      setCourse("");
      setUniversityName("");
      setDepartment("");
      setGrade("");
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Unknown error";
      alert(`Error: ${errorMessage}`);
      console.error("Error generating certificate:", err);
    } finally {
      setIssuingCert(false);
    }
  };

  const handleBulkFileChange = async (file: File | null) => {
    setBulkFile(file);
    setBulkHeaders([]);
    setNameColumn("");
    setCourseColumn("");
    setBulkPreview([]);
    setBulkSheetName(null);

    if (!file) {
      return;
    }

    try {
      const data = await file.arrayBuffer();
      const workbook = XLSX.read(data, { type: "array" });
      const sheetName = workbook.SheetNames[0];
      const sheet = workbook.Sheets[sheetName];

      const rows = XLSX.utils.sheet_to_json<any>(sheet, { header: 1, defval: "" });
      if (rows.length === 0) {
        alert("Excel file is empty or invalid.");
        return;
      }

      const headers = (rows[0] as any[]).map((header) => String(header || "")).filter(Boolean);
      setBulkHeaders(headers);
      setBulkSheetName(sheetName);

      const previewRows = rows.slice(1, 6).map((row: any[]) => {
        const record: Record<string, any> = {};
        headers.forEach((header, index) => {
          record[header] = row[index] ?? "";
        });
        return record;
      });
      setBulkPreview(previewRows);
    } catch (err) {
      console.error("Unable to parse Excel file:", err);
      alert("Could not parse the selected Excel file. Please choose a valid .xlsx or .xls file.");
      setBulkFile(null);
    }
  };

  const handleBulkUpload = async () => {
    if (!bulkFile) {
      alert("Please select an Excel file");
      return;
    }

    if (!nameColumn || !courseColumn) {
      alert("Please map the name and course fields before uploading.");
      return;
    }

    try {
      setUploadingBulk(true);
      setBulkResults(null);

      const formData = new FormData();
      formData.append("file", bulkFile);
      formData.append("nameField", nameColumn);
      formData.append("courseField", courseColumn);

      const res = await fetch("/api/certificates/bulk", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        throw new Error(`HTTP ${res.status}: ${res.statusText}`);
      }

      const data = await res.json();
      setBulkResults(data);

      alert(`Bulk upload completed!\nSuccess: ${data.success}\nFailed: ${data.failed}\nTotal: ${data.total}`);

      // Reset form
      setBulkFile(null);
      const fileInput = document.getElementById("bulk-file") as HTMLInputElement;
      if (fileInput) fileInput.value = "";

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Unknown error";
      alert(`Bulk upload failed: ${errorMessage}`);
      console.error("Error uploading bulk certificates:", err);
    } finally {
      setUploadingBulk(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 lg:p-8">
      {/* HEADER */}
<div className="mb-6 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-gray-900">
            Certificate Dashboard
          </h1>
          <p className="text-sm text-gray-500">
            Issue, preview and manage certificates
          </p>
        </div>
        {!isConnected ? (
          <button
            onClick={connect}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Connect MetaMask
          </button>
        ) : (
          <div className="flex items-center gap-2 text-sm bg-green-100 px-3 py-1 rounded-lg">
            <span>Connected: {account?.slice(0,6)}...{account?.slice(-4)}</span>
            <button onClick={disconnect} className="text-red-600 hover:text-red-800 font-medium text-xs">
              Disconnect
            </button>
          </div>
        )}
        {walletError && (
          <div className="text-red-500 text-sm">{walletError}</div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Form + Bulk column */}
        <div className="space-y-6">
          {/* Single form */}
          <div className="bg-white border rounded-xl p-6 shadow-sm">
            <h2 className="text-xl font-bold text-gray-900 mb-4">
              Single Certificate
            </h2>
            <div className="space-y-3">
              <input
                className="w-full p-3 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Recipient Name *"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
              <input
                className="w-full p-3 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Course / Program *"
                value={course}
                onChange={(e) => setCourse(e.target.value)}
              />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <input
                  className="w-full p-3 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="University Name"
                  value={universityName}
                  onChange={(e) => setUniversityName(e.target.value)}
                />
                <input
                  className="w-full p-3 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Department"
                  value={department}
                  onChange={(e) => setDepartment(e.target.value)}
                />
              </div>
              <input
                className="w-full p-3 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Grade"
                value={grade}
                onChange={(e) => setGrade(e.target.value)}
              />
              <button
                onClick={handlePreview}
                disabled={isPreviewLoading}
                className="w-full py-3 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-all"
              >
                {isPreviewLoading ? "Loading Preview..." : "Preview PDF"}
              </button>
              <button
                onClick={handleGenerate}
                disabled={issuingCert}
                className="w-full py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-all"
              >
                {issuingCert ? "Generating..." : "Generate Certificate"}
              </button>
            </div>
          </div>

          {/* Bulk panel */}
          <div className="bg-slate-200 border rounded-xl p-6 shadow-sm">
            <BulkUploadPanel
              bulkFile={bulkFile}
              uploadingBulk={uploadingBulk}
              bulkResults={bulkResults}
              bulkHeaders={bulkHeaders}
              bulkPreview={bulkPreview}
              nameColumn={nameColumn}
              courseColumn={courseColumn}
              universityColumn={universityColumn}
              departmentColumn={departmentColumn}
              gradeColumn={gradeColumn}
              isConnected={isConnected}
              onRegisterCert={registerSingleCert}
              onFileChange={handleBulkFileChange}
              onNameFieldChange={setNameColumn}
              onCourseFieldChange={setCourseColumn}
              onUniversityFieldChange={setUniversityColumn}
              onDepartmentFieldChange={setDepartmentColumn}
              onGradeFieldChange={setGradeColumn}
              onUpload={handleBulkUpload}
            />
          </div>

          {/* Recent certs */}
          {singleResults.length > 0 && (
            <div className="bg-white border rounded-xl p-6 shadow-sm">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Recent Certificate</h3>
              <div className="space-y-3">
                <div className="text-sm">
                  <div className="font-semibold">{singleResults[0].name}</div>
                  <div className="text-gray-600">{singleResults[0].course}</div>
                  <div className="text-blue-600 truncate">
                    <a href={singleResults[0].verifyUrl} target="_blank" rel="noopener noreferrer">
                      {singleResults[0].hash.slice(0,10)}...
                    </a>
                  </div>
                </div>
                <button
                  onClick={() => registerSingleCert(singleResults[0].hash)}
                  className="w-full py-3 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-all"
                  disabled={!isConnected}
                >
                  {isConnected ? 'Register on Chain' : 'Connect Wallet to Register'}
                </button>
                {!isConnected && (
                  <p className="text-xs text-gray-500 text-center">
                    Or visit <a href="/dashboard/issuance" className="text-blue-600 underline">Issuance page</a>
                  </p>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Preview */}
        <div className="lg:col-span-1">
          <div className="bg-white border rounded-xl p-8 shadow-sm h-screen flex flex-col">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 self-start">PDF Preview</h2>
            <CertificatePreview
              name={name}
              course={course}
              universityName={universityName}
              department={department}
              grade={grade}
              previewPdf={previewPdf}
              isPreviewLoading={isPreviewLoading}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
