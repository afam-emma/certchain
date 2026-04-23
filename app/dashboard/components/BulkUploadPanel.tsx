import { Template } from "../types";

type BulkUploadPanelProps = {
  bulkFile: File | null;
  uploadingBulk: boolean;
  bulkResults: any;
  bulkHeaders: string[];
  bulkPreview: Record<string, any>[];
  nameColumn: string;
  courseColumn: string;
  universityColumn: string;
  departmentColumn: string;
  gradeColumn: string;
  isConnected: boolean;
  onRegisterCert: (hash: string) => Promise<void>;
  onFileChange: (file: File | null) => void;
  onNameFieldChange: (field: string) => void;
  onCourseFieldChange: (field: string) => void;
  onUniversityFieldChange: (field: string) => void;
  onDepartmentFieldChange: (field: string) => void;
  onGradeFieldChange: (field: string) => void;
  onUpload: () => void;
};

export default function BulkUploadPanel({
  bulkFile,
  uploadingBulk,
  bulkResults,
  bulkHeaders,
  bulkPreview,
  nameColumn,
  courseColumn,
  universityColumn,
  departmentColumn,
  gradeColumn,
  isConnected,
  onRegisterCert,
  onFileChange,
  onNameFieldChange,
  onCourseFieldChange,
  onUniversityFieldChange,
  onDepartmentFieldChange,
  onGradeFieldChange,
  onUpload,
}: BulkUploadPanelProps) {

  const handleAddAllToChain = async () => {
    if (!bulkResults.results) return;
    
    try {
      const promises = bulkResults.results.map((result: any) => onRegisterCert(result.hash));
      await Promise.allSettled(promises);
      alert('Bulk registration attempted. Check Issuance page for status.');
    } catch (err) {
      alert('Some registrations failed. Check Issuance page.');
    }
  };
  return (
    <div className="space-y-6 w-full xl:col-span-1">
      <div>
        <h2 className="text-xl lg:text-2xl font-bold text-gray-900">Bulk Certificate Upload</h2>
        <p className="text-sm text-gray-500">Upload Excel file to generate multiple certificates at once</p>
      </div>

      <div className="space-y-3 bg-white border rounded-lg p-4 lg:p-5">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Excel File (.xlsx, .xls)</label>
          <input
            id="bulk-file"
            type="file"
            accept=".xlsx,.xls"
            onChange={(e) => onFileChange(e.target.files?.[0] || null)}
            className="border p-2 w-full bg-blue-500 rounded text-sm lg:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          />
          <p className="text-xs text-gray-500 mt-1">
            Choose the Excel file and then map the columns below.
          </p>
        </div>

        {bulkHeaders.length > 0 && (
        <div className="grid gap-3 grid-cols-1 md:grid-cols-2 lg:grid-cols-1 w-full max-w-2xl">
            <div>
              <p className="text-sm font-medium text-gray-700 mb-1">Map Name Column</p>
              <select
                value={nameColumn}
                onChange={(e) => onNameFieldChange(e.target.value)}
                className="border p-2 w-full rounded text-sm lg:text-base"
              >
                <option value="">Select name column</option>
                {bulkHeaders.map((header) => (
                  <option key={header} value={header}>
                    {header}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-700 mb-1">Map Course Column</p>
              <select
                value={courseColumn}
                onChange={(e) => onCourseFieldChange(e.target.value)}
                className="border p-2 w-full rounded text-sm lg:text-base"
              >
                <option value="">Select course column</option>
                {bulkHeaders.map((header) => (
                  <option key={header} value={header}>
                    {header}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-700 mb-1">Map University Column (optional)</p>
              <select
                value={universityColumn}
                onChange={(e) => onUniversityFieldChange(e.target.value)}
                className="border p-2 w-full rounded text-sm lg:text-base"
              >
                <option value="">Select university column</option>
                {bulkHeaders.map((header) => (
                  <option key={header} value={header}>
                    {header}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-700 mb-1">Map Department Column (optional)</p>
              <select
                value={departmentColumn}
                onChange={(e) => onDepartmentFieldChange(e.target.value)}
                className="border p-2 w-full rounded text-sm lg:text-base"
              >
                <option value="">Select department column</option>
                {bulkHeaders.map((header) => (
                  <option key={header} value={header}>
                    {header}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-700 mb-1">Map Grade Column (optional)</p>
              <select
                value={gradeColumn}
                onChange={(e) => onGradeFieldChange(e.target.value)}
                className="border p-2 w-full rounded text-sm lg:text-base"
              >
                <option value="">Select grade column</option>
                {bulkHeaders.map((header) => (
                  <option key={header} value={header}>
                    {header}
                  </option>
                ))}
              </select>
            </div>
          </div>
        )}

        {bulkPreview.length > 0 && (
          <div className="bg-slate-50 border border-gray-200 rounded-lg p-3">
            <p className="text-sm font-medium text-slate-900 mb-2">Preview rows</p>
            <div className="overflow-x-auto text-xs">
              <table className="min-w-full text-left border-collapse">
                <thead>
                  <tr>
                    {bulkHeaders.map((header) => (
                      <th key={header} className="border px-2 py-1 bg-slate-100">
                        {header}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {bulkPreview.map((row, index) => (
                    <tr key={index}>
                      {bulkHeaders.map((header) => (
                        <td key={header} className="border px-2 py-1">
                          {String(row[header] ?? "")}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

          {/* Template selection suspended */}
          <p className="text-sm text-gray-500 italic p-3 bg-gray-50 rounded">Using default certificate template</p>

        <button
          onClick={onUpload}
          disabled={uploadingBulk || !bulkFile || !nameColumn || !courseColumn}
          className="w-full px-4 py-2 lg:py-3 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition"
        >
          {uploadingBulk ? "Uploading..." : "Upload & Generate Certificates"}
        </button>

        {bulkResults && (
          <div className="mt-4 p-4 bg-gray-50 rounded-lg">
            <h3 className="font-semibold text-gray-900 mb-2">Upload Results</h3>
            <div className="grid grid-cols-3 gap-4 text-sm">
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">{bulkResults.success}</div>
                <div className="text-gray-600">Success</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-red-600">{bulkResults.failed}</div>
                <div className="text-gray-600">Failed</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">{bulkResults.total}</div>
                <div className="text-gray-600">Total</div>
              </div>
            </div>
            {isConnected && bulkResults.results && bulkResults.results.length > 0 && (
              <button
                onClick={handleAddAllToChain}
                className="w-full mt-3 py-2 bg-emerald-600 text-white font-semibold rounded-lg hover:bg-emerald-700"
              >
                Add All to Chain
              </button>
            )}
            {bulkResults.results && bulkResults.results.length > 0 && (
              <div className="mt-4">
                <h4 className="font-medium text-gray-900 mb-2">Generated Certificates:</h4>
                <div className="max-h-40 overflow-y-auto space-y-1">
                  {bulkResults.results.slice(0, 10).map((result: any, index: number) => (
                    <div key={index} className="text-xs bg-white p-2 rounded border flex justify-between items-center gap-2">
                      <div>
                        <div className="font-medium">{result.name}</div>
                        <div className="text-gray-600">{result.course}</div>
                        <div className="text-blue-600 truncate">
                          <a href={result.verifyUrl} target="_blank" rel="noopener noreferrer">
                            {result.hash.slice(0,10)}...
                          </a>
                        </div>
                      </div>
                      {isConnected && (
                        <button
                          onClick={() => onRegisterCert(result.hash)}
                          className="px-2 py-1 bg-green-600 text-white text-xs rounded hover:bg-green-700 whitespace-nowrap"
                        >
                          Chain
                        </button>
                      )}
                    </div>
                  ))}
                  {bulkResults.results.length > 10 && (
                    <div className="text-xs text-gray-500 text-center py-1">
                      ... and {bulkResults.results.length - 10} more
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
