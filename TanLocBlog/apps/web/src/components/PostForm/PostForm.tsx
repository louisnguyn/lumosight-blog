import { useState, useEffect } from "react";
import { supabase } from "../../db/supabaseClient";

export default function PostForm({ mode, post, onSuccess, onCancel }: {
  mode: "create" | "edit";
  post?: any;
  onSuccess: () => void;
  onCancel: () => void;
}) {
  const [title, setTitle] = useState(post?.title || "");
  const [description, setDescription] = useState(post?.description || "");
  const [content, setContent] = useState(post?.content || "");
  const [categories, setCategories] = useState(post?.categories || "");
  const [tags, setTags] = useState(post?.tags || "");
  const [image, setImage] = useState(post?.image || "");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (mode === "edit" && post) {
      setTitle(post.title || "");
      setContent(post.content || "");
      setCategories(post.categories || "");
      setTags(post.tags || "");
      setImage(post.image || "");
      setDescription(post.description || "");
    }
  }, [mode, post]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const { data: sessionData } = await supabase.auth.getSession();
    const author_id = sessionData?.session?.user?.id;

    if (!author_id) {
      setError("User not authenticated");
      setLoading(false);
      return;
    }

    if (mode === "create") {
      const { error } = await supabase
        .from("posts")
        .insert([{
          title,
          description,
          content,
          categories,
          tags,
          author_id,
          views: 0,
          active: true,
          image
        }]);
      if (error) setError(error.message);
      else onSuccess();
    } else if (mode === "edit" && post?.id) {
      const { error } = await supabase
        .from("posts")
        .update({
          title,
          description,
          content,
          categories,
          tags,
          image,
          updated_at: new Date().toISOString(),
        })
        .eq("id", post.id);
      if (error) setError(error.message);
      else onSuccess();
    }
    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-xl mx-auto p-6 bg-white dark:bg-gray-900 rounded-xl shadow-lg">
      <h2 className="text-2xl font-bold mb-4 text-center">{mode === "create" ? "Create Post" : "Edit Post"}</h2>
      <input
        type="text"
        placeholder="Title"
        value={title}
        onChange={e => setTitle(e.target.value)}
        className="w-full mb-3 px-3 py-2 rounded border bg-white dark:bg-gray-800 dark:text-white"
        required
      />
      <input
        type="text"
        placeholder="Description"
        value={description}
        onChange={e => setDescription(e.target.value)}
        className="w-full mb-3 px-3 py-2 rounded border bg-white dark:bg-gray-800 dark:text-white"
      />
      <textarea
        placeholder="Content"
        value={content}
        onChange={e => setContent(e.target.value)}
        className="w-full mb-3 px-3 py-2 rounded border bg-white dark:bg-gray-800 dark:text-white"
        rows={6}
        required
      />
      <input
        type="text"
        placeholder="Categories"
        value={categories}
        onChange={e => setCategories(e.target.value)}
        className="w-full mb-3 px-3 py-2 rounded border bg-white dark:bg-gray-800 dark:text-white"
      />
      <input
        type="text"
        placeholder="Tags (comma separated)"
        value={tags}
        onChange={e => setTags(e.target.value)}
        className="w-full mb-3 px-3 py-2 rounded border bg-white dark:bg-gray-800 dark:text-white"
      />
      <input
        type="text"
        placeholder="Image URL"
        value={image}
        onChange={e => setImage(e.target.value)}
        className="w-full mb-3 px-3 py-2 rounded border bg-white dark:bg-gray-800 dark:text-white"
      />
    {image && (
    <div className="mb-4 flex justify-center">
        <img
        src={image}
        alt="Preview"
        className="rounded-xl object-cover w-[320px] h-[220px] bg-gray-200"
        />
    </div>
    )}
      {error && <div className="text-red-500 mb-2">{error}</div>}
      <div className="flex gap-4 justify-center">
        <button
          type="button"
          className="px-4 py-2 rounded bg-gray-300 dark:bg-gray-700 text-black dark:text-white"
          onClick={onCancel}
          disabled={loading}
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-4 py-2 rounded bg-blue-600 text-white font-semibold hover:bg-blue-700"
          disabled={loading}
        >
          {loading ? (mode === "create" ? "Creating..." : "Updating...") : (mode === "create" ? "Create" : "Update")}
        </button>
      </div>
    </form>
  );
}