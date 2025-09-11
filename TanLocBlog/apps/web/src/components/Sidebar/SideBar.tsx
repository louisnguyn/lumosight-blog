import { useEffect, useState } from "react";
import { supabase } from "../../db/supabaseClient";

export default function SideBar({ onFilter }: { onFilter: (filter: { category?: string, tag?: string }) => void }) {
  const [categories, setCategories] = useState<string[]>([]);
  const [tags, setTags] = useState<string[]>([]);

  useEffect(() => {
    supabase.from('posts').select('categories, tags').then(({ data }) => {
      if (!data) return;
      const uniqueCategories = Array.from(new Set(data.map((p: any) => p.categories).filter(Boolean)));
      setCategories(uniqueCategories);
      const allTags = data.flatMap((p: any) =>
        typeof p.tags === "string"
          ? p.tags.split(",").map((t: string) => t.trim())
          : []
      );
      setTags(Array.from(new Set(allTags.filter(Boolean))));
    });
  }, []);

  return (
    <aside className="w-1/5 dark:text-white p-6">
      <h2 className="text-2x1 font-bold mb-2">Categories</h2>
      <ul>
        {categories.map(cat => (
          <li key={cat}>
            <button
              className="text-left text-lg w-full py-1 px-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded"
              onClick={() => onFilter({ category: cat })}
            >
              {cat}
            </button>
          </li>
        ))}
      </ul>
      <h2 className="text-2x1 font-bold mt-4 mb-2">Tags</h2>
      <ul>
        {tags.map(tag => (
          <li key={tag}>
            <button
              className="text-left text-lg w-full py-1 px-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded"
              onClick={() => onFilter({ tag })}
            >
              {tag}
            </button>
          </li>
        ))}
      </ul>
    </aside>
  );
}