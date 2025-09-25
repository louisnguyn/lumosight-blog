import { useEffect, useState } from "react";
import { supabase } from "../../db/supabaseClient";
import { FaFolder, FaTag, FaTimes } from "react-icons/fa";

export default function SideBar({ onFilter, onItemClick }: { onFilter: (filter: { category?: string, tag?: string }) => void, onItemClick?: () => void }) {
  const [categories, setCategories] = useState<string[]>([]);
  const [tags, setTags] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data } = await supabase.from('posts').select('categories, tags').eq('active', true);
        if (!data) return;
        
        const uniqueCategories = Array.from(new Set(data.map((p: any) => p.categories?.toLowerCase().trim()).filter(Boolean)));
        setCategories(uniqueCategories);
        
        const allTags = data.flatMap((p: any) =>
          typeof p.tags === "string"
            ? p.tags.split(",").map((t: string) => t.trim().toLowerCase())
            : []
        );
        setTags(Array.from(new Set(allTags.filter(Boolean))));
      } catch (error) {
        console.error('Error fetching sidebar data:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, []);

  const handleCategoryClick = (category: string) => {
    const newCategory = selectedCategory === category ? null : category;
    setSelectedCategory(newCategory);
    setSelectedTag(null);
    onFilter({ category: newCategory || undefined });
    if (onItemClick) onItemClick();
  };

  const handleTagClick = (tag: string) => {
    const newTag = selectedTag === tag ? null : tag;
    setSelectedTag(newTag);
    setSelectedCategory(null);
    onFilter({ tag: newTag || undefined });
    if (onItemClick) onItemClick();
  };

  const clearFilters = () => {
    setSelectedCategory(null);
    setSelectedTag(null);
    onFilter({});
    if (onItemClick) onItemClick();
  };

  if (loading) {
    return (
      <aside className="w-80 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 p-6 h-full overflow-y-auto">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded"></div>
          <div className="space-y-2">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-10 bg-gray-200 dark:bg-gray-700 rounded"></div>
            ))}
          </div>
          <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded"></div>
          <div className="space-y-2">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-10 bg-gray-200 dark:bg-gray-700 rounded"></div>
            ))}
          </div>
        </div>
      </aside>
    );
  }

  return (
    <aside className="w-80 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 p-6 h-full overflow-y-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Filters</h2>
        {(selectedCategory || selectedTag) && (
          <button
            onClick={clearFilters}
            className="text-sm text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 flex items-center transition-colors"
          >
            <FaTimes className="mr-1" />
            Clear
          </button>
        )}
      </div>

      {/* Categories Section */}
      <div className="mb-8">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
          <FaFolder className="mr-2 text-blue-600" />
          Categories
          <span className="ml-2 text-sm text-gray-500 dark:text-gray-400">({categories.length})</span>
        </h3>
        {categories.length === 0 ? (
          <p className="text-gray-500 dark:text-gray-400 text-sm italic">No categories available</p>
        ) : (
          <div className="space-y-2">
            {categories.map(category => (
              <button
                key={category}
                className={`w-full text-left py-3 px-4 rounded-lg transition-all duration-200 flex items-center justify-between group ${
                  selectedCategory === category
                    ? 'bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 shadow-md border border-blue-200 dark:border-blue-700'
                    : 'hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 hover:shadow-sm'
                }`}
                onClick={() => handleCategoryClick(category)}
              >
                <span className="font-medium">{category}</span>
                {selectedCategory === category && (
                  <FaTimes className="w-3 h-3 text-blue-600" />
                )}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Tags Section */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
          <FaTag className="mr-2 text-green-600" />
          Tags
          <span className="ml-2 text-sm text-gray-500 dark:text-gray-400">({tags.length})</span>
        </h3>
        {tags.length === 0 ? (
          <p className="text-gray-500 dark:text-gray-400 text-sm italic">No tags available</p>
        ) : (
          <div className="space-y-2">
            {tags.map(tag => (
              <button
                key={tag}
                className={`w-full text-left py-3 px-4 rounded-lg transition-all duration-200 flex items-center justify-between group ${
                  selectedTag === tag
                    ? 'bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 shadow-md border border-green-200 dark:border-green-700'
                    : 'hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 hover:shadow-sm'
                }`}
                onClick={() => handleTagClick(tag)}
              >
                <span className="font-medium">#{tag}</span>
                {selectedTag === tag && (
                  <FaTimes className="w-3 h-3 text-green-600" />
                )}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Active Filters Summary */}
      {(selectedCategory || selectedTag) && (
        <div className="mt-8 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
          <h4 className="text-sm font-semibold text-blue-800 dark:text-blue-200 mb-2">Active Filters:</h4>
          <div className="space-y-1">
            {selectedCategory && (
              <div className="text-sm text-blue-700 dark:text-blue-300 flex items-center">
                <FaFolder className="w-3 h-3 mr-2" />
                Category: {selectedCategory}
              </div>
            )}
            {selectedTag && (
              <div className="text-sm text-green-700 dark:text-green-300 flex items-center">
                <FaTag className="w-3 h-3 mr-2" />
                Tag: #{selectedTag}
              </div>
            )}
          </div>
        </div>
      )}
    </aside>
  );
}