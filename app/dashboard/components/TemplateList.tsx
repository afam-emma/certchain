import { Template } from "../types";

type TemplateListProps = {
  templates: Template[];
  selectedTemplate: Template | null;
  loading: boolean;
  error: string | null;
  selectedCategoryName?: string;
  onSelectTemplate: (template: Template) => void;
};

export default function TemplateList({
  templates,
  selectedTemplate,
  loading,
  error,
  selectedCategoryName,
  onSelectTemplate,
}: TemplateListProps) {
  return (
    <div>
      <h2 className="font-semibold mb-2">
        Templates
        {selectedCategoryName && (
          <span className="text-sm text-gray-500 ml-2">in {selectedCategoryName}</span>
        )}
        {loading && <span className="text-xs text-gray-500 ml-2">(Loading...)</span>}
      </h2>

      {error ? (
        <div className="p-3 mb-3 bg-red-50 border border-red-200 rounded text-sm text-red-700">
          ⚠️ Error loading templates: {error}
        </div>
      ) : loading ? (
        <div className="p-4 text-center text-gray-500">Loading templates...</div>
      ) : templates.length === 0 ? (
        <div className="p-4 text-center text-gray-500">
          {selectedCategoryName
            ? `No templates available in ${selectedCategoryName} category.`
            : "No templates available. Select a category first."}
        </div>
      ) : (
        <div className="space-y-2">
          {templates.map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => onSelectTemplate(t)}
              className={`w-full p-3 border rounded-xl text-left transition hover:shadow-sm ${
                selectedTemplate?.id === t.id
                  ? "border-indigo-600 bg-indigo-50"
                  : "border-gray-200 bg-white"
              }`}
            >
              <div className="flex gap-3 items-center">
                <div
                  className="w-16 h-12 rounded-md border overflow-hidden flex-shrink-0"
                  style={{
                    backgroundColor: t.bgColor || "#fff",
                    backgroundImage: t.bgImage ? `url(${t.bgImage})` : undefined,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                  }}
                />
                <div className="flex-1">
                  <p className="font-medium text-sm">{t.name}</p>
                  <p className="text-xs text-gray-500">{t.category.name}</p>
                </div>
                {selectedTemplate?.id === t.id && (
                  <div className="text-indigo-600 text-sm font-bold">✓</div>
                )}
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
