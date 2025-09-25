import { useState, useEffect } from "react";
import { supabase } from "../../db/supabaseClient";
import TipTap from "../RichTextEditor/TipTap"
import { FiUpload } from 'react-icons/fi';
import { CgSpinner } from 'react-icons/cg';
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
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreviewLoading, setImagePreviewLoading] = useState(false);
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
    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) {
        setImageFile(file);
        setImagePreviewLoading(true);
        setTimeout(() => {
          setImage(URL.createObjectURL(file)); // Preview after 2s
          setImagePreviewLoading(false);
        }, 2000);
      }
    };

    const uploadImage = async (): Promise<string | null> => {
      if (!imageFile) return image;
      const fileExt = imageFile.name.split('.').pop();
      const fileName = `${Date.now()}.${fileExt}`;
      const filePath = `posts/${fileName}`;
      const { error: uploadError } = await supabase.storage
        .from("image_upload")
        .upload(filePath, imageFile, { upsert: true });
      if (uploadError) {
        setError(uploadError.message);
        return null;
      }
      // Get public URL
      const { data } = supabase.storage
        .from("image_upload")
        .getPublicUrl(filePath);
      return data?.publicUrl ?? null;
    };
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
    let imageUrl = image;
    if (imageFile) {
      const uploadedUrl = await uploadImage();
      if (!uploadedUrl) {
        setLoading(false);
        return;
      }
      imageUrl = uploadedUrl;
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
          image: imageUrl
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
          image: imageUrl,
          updated_at: new Date().toISOString(),
        })
        .eq("id", post.id);
      if (error) setError(error.message);
      else onSuccess();
    }
    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-xl mx-auto">
      <h2 className="text-2xl font-bold mb-4 text-center dark:text-white">{mode === "create" ? "Create Post" : "Edit Post"}</h2>
      <label className="block mb-1 font-semibold dark:text-white" htmlFor="title">Title</label>
      <input
        id="title"
        type="text"
        placeholder="Title"
        value={title}
        onChange={e => setTitle(e.target.value)}
        className="w-full mb-3 px-3 py-2 rounded border bg-white dark:bg-gray-800 dark:text-white"
        required
      />
      <label className="block mb-1 font-semibold dark:text-white" htmlFor="description">Description</label>
      <input
        id="description"
        type="text"
        placeholder="Description"
        value={description}
        onChange={e => setDescription(e.target.value)}
        className="w-full mb-3 px-3 py-2 rounded border bg-white dark:bg-gray-800 dark:text-white"
      />
      {/* <textarea
        placeholder="Content"
        value={content}
        onChange={e => setContent(e.target.value)}
        className="w-full mb-3 px-3 py-2 rounded border bg-white dark:bg-gray-800 dark:text-white"
        rows={6}
        required
      /> */}
      <label className="block mb-1 font-semibold dark:text-white" htmlFor="content">Content</label>
      <TipTap value={content} onChange={setContent} placeholder="Write your post content here..."/>
      <label className="block mb-1 font-semibold dark:text-white" htmlFor="categories">Categories</label>
      <input
        id="categories"
        type="text"
        placeholder="Categories"
        value={categories}
        onChange={e => setCategories(e.target.value)}
        className="w-full mb-3 px-3 py-2 rounded border bg-white dark:bg-gray-800 dark:text-white"
      />
      <label className="block mb-1 font-semibold dark:text-white" htmlFor="tags">Tags (comma separated)</label>
      <input
        id="tags"
        type="text"
        placeholder="Tags (comma separated)"
        value={tags}
        onChange={e => setTags(e.target.value)}
        className="w-full mb-3 px-3 py-2 rounded border bg-white dark:bg-gray-800 dark:text-white"
      />
      {/* <label className="block mb-1 font-semibold dark:text-white" htmlFor="image">Upload Image</label> */}
      <div className="mb-4 flex sm:flex-row flex-col justify-center">
      <input
        id="image"
        type="file"
        accept="image/*"
        onChange={handleImageChange}
        style={{ display: "none" }}
      />
      <button
        type="button"
        className="px-5 py-2 rounded-tl-md rounded-bl-md bg-blue-600 text-white font-semibold hover:bg-blue-700"
        onClick={() => document.getElementById("image")?.click()}
      >
        <FiUpload className="inline mr-2 mb-1"/> {imageFile ? "Change Image" : "Upload Image"}
      </button>
      {imageFile ? <span className="text-gray-600 dark:text-gray-300 rounded-tr-md rounded-br-md border px-4 py-2">{imageFile.name}</span> : <span className="text-gray-600 dark:text-gray-300 rounded-tr-md rounded-br-md border px-4 py-2">No file is chosen...</span>}
      </div>
      {imagePreviewLoading ? (
        <div className="mb-4 flex justify-center items-center h-[220px]">
          <CgSpinner className="animate-spin text-4xl text-blue-600" />
        </div>
      ) : (
        image && (
          <div className="mb-4 flex justify-center">
            <img
              src={image}
              alt="Preview"
              className="rounded-tr-xl rounded-br-xl object-cover w-[320px] h-[220px] bg-gray-200"
            />
          </div>
        )
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