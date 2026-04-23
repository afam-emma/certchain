import { Category } from "../types";

type CategorySearchProps = {
  categorySearch: string;
  showCategoryDropdown: boolean;
  filteredCategories: Category[];
  creatingCategory: boolean;
  onSearchChange: (value: string) => void;
  onToggleDropdown: () => void;
  onSelectCategory: (category: Category) => void;
  onCreateCategory: () => void;
};

export default function CategorySearch({
  categorySearch,
  showCategoryDropdown,
  filteredCategories,
  creatingCategory,
  onSearchChange,
  onToggleDropdown,
  onSelectCategory,
  onCreateCategory,
}: CategorySearchProps) {
  return (
    <div className="relative">
      <label className="block text-sm font-medium text-gray-700 mb-1">
        Program Category
      </label>
      <div className="relative">
        <input
          type="text"
          className="border p-2 w-full rounded text-sm lg:text-base pr-10"
          placeholder="Search or create category..."
          value={categorySearch}
          onChange={(e) => onSearchChange(e.target.value)}
          onFocus={() => onToggleDropdown()}
        />
        <button
          type="button"
          onClick={onToggleDropdown}
          className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
        >
          ▼
        </button>
      </div>

      {showCategoryDropdown && (
        <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-auto">
          {filteredCategories.length > 0 ? (
            filteredCategories.map((category) => (
              <button
                key={category.id}
                type="button"
                onClick={() => onSelectCategory(category)}
                className="w-full text-left px-3 py-2 hover:bg-gray-100 focus:bg-gray-100 focus:outline-none"
              >
                <div className="font-medium">{category.name}</div>
                {category.description && (
                  <div className="text-xs text-gray-500">{category.description}</div>
                )}
                {category._count && (
                  <div className="text-xs text-blue-600">
                    {category._count.templates} templates
                  </div>
                )}
              </button>
            ))
          ) : categorySearch.trim() ? (
            <div className="p-3">
              <button
                type="button"
                onClick={onCreateCategory}
                disabled={creatingCategory}
                className="w-full text-left px-3 py-2 bg-blue-50 hover:bg-blue-100 rounded text-blue-700 disabled:opacity-50"
              >
                {creatingCategory ? "Creating..." : `Create "${categorySearch}"`}
              </button>
            </div>
          ) : (
            <div className="p-3 text-sm text-gray-500">Start typing to search categories...</div>
          )}
        </div>
      )}
    </div>
  );
}
