import { Category, Template } from "../types";

interface CertificatePreviewProps {
  name: string;
  course: string;
  universityName?: string;
  department?: string;
  grade?: string;
  previewPdf?: string;
  isPreviewLoading?: boolean;
}

export default function CertificatePreview({
  name,
  course,
  universityName = '',
  department = '',
  grade = '',
  previewPdf,
  isPreviewLoading,
}: CertificatePreviewProps) {
  if (previewPdf) {
    return (
      <div className="w-full h-[500px] border rounded-lg overflow-hidden">
        <iframe 
          src={previewPdf} 
          className="w-full h-full border-0"
          title="Certificate Preview"
        />
      </div>
    );
  }

  if (isPreviewLoading) {
    return (
      <div className="w-full h-[500px] border rounded-lg p-8 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
          <p className="text-sm text-gray-500">Generating PDF preview...</p>
        </div>
      </div>
    );
  }

  return (
    <div
      className="border rounded-lg h-[400px] lg:h-[550px] relative flex items-center justify-center overflow-hidden bg-gradient-to-br from-white to-gray-50"
    >
      <div className="z-10 text-center space-y-4 px-6 lg:px-10">
        <h1 className="font-bold text-gray-800 text-2xl tracking-wide">
          Certificate Preview
        </h1>
        <p className="text-gray-500 text-sm">Enter details above to see live PDF preview</p>

        <div className="space-y-1 text-sm text-gray-600">
          <div><strong>Recipient:</strong> {name || 'Enter name'}</div>
          <div><strong>Course:</strong> {course || 'Enter course'}</div>
          {universityName && <div><strong>University:</strong> {universityName}</div>}
          {department && <div><strong>Department:</strong> {department}</div>}
          {grade && <div><strong>Grade:</strong> {grade}</div>}
        </div>

        <div className="mt-4 p-3 bg-blue-50 rounded-lg">
          <p className="text-xs text-blue-800 font-medium">Click "Preview PDF" for full document preview</p>
        </div>
      </div>
    </div>
  );
}
