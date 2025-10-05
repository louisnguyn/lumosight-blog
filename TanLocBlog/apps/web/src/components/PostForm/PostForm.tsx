import { useState, useEffect } from "react";
import { supabase } from "../../db/supabaseClient";
import TipTap from "../RichTextEditor/TipTap"
import { FiUpload } from 'react-icons/fi';
import { CgSpinner } from 'react-icons/cg';
import { FiX } from 'react-icons/fi';
import { generateSlug, generateUniqueSlug } from "../../utils/slugGenerator";
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
  const [validationErrors, setValidationErrors] = useState<{[key: string]: string}>({});
  const [slug, setSlug] = useState(post?.posts_slug || "");

  useEffect(() => {
    if (mode === "edit" && post) {
      setTitle(post.title || "");
      setContent(post.content || "");
      setCategories(post.categories || "");
      setTags(post.tags || "");
      setImage(post.image || "");
      setDescription(post.description || "");
      setSlug(post.posts_slug || "");
    }
  }, [mode, post]);

  // Auto-generate slug from title for create mode
  useEffect(() => {
    if (mode === "create" && title) {
      const newSlug = generateSlug(title);
      setSlug(newSlug);
    }
  }, [title, mode]);

  // Validation functions
  const validateField = (field: string, value: string): string => {
    switch (field) {
      case 'title':
        if (!value.trim()) return 'Title is required';
        if (value.trim().length < 3) return 'Title must be at least 3 characters';
        if (value.trim().length > 200) return 'Title must be less than 200 characters';
        return '';
      case 'description':
        if (!value.trim()) return 'Description is required';
        if (value.trim().length < 10) return 'Description must be at least 10 characters';
        if (value.trim().length > 500) return 'Description must be less than 500 characters';
        return '';
      case 'content':
        if (!value.trim()) return 'Content is required';
        if (value.trim().length < 50) return 'Content must be at least 50 characters';
        return '';
      case 'categories':
        if (!value.trim()) return 'Categories are required';
        if (value.trim().length < 2) return 'Categories must be at least 2 characters';
        return '';
      case 'tags':
        if (!value.trim()) return 'Tags are required';
        if (value.trim().length < 2) return 'Tags must be at least 2 characters';
        return '';
      default:
        return '';
    }
  };

  const validateForm = (): boolean => {
    const errors: {[key: string]: string} = {};
    
    errors.title = validateField('title', title);
    errors.description = validateField('description', description);
    errors.content = validateField('content', content);
    errors.categories = validateField('categories', categories);
    errors.tags = validateField('tags', tags);
    
    setValidationErrors(errors);
    
    // Return true if no errors
    return Object.values(errors).every(error => error === '');
  };

  const handleFieldChange = (field: string, value: string) => {
    // Clear validation error for this field when user starts typing
    if (validationErrors[field]) {
      setValidationErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
    
    // Update the field value
    switch (field) {
      case 'title':
        setTitle(value);
        break;
      case 'description':
        setDescription(value);
        break;
      case 'content':
        setContent(value);
        break;
      case 'categories':
        setCategories(value);
        break;
      case 'tags':
        setTags(value);
        break;
    }
  };

    const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) {
        // If there's an existing image URL (not a local preview), delete it from bucket
        if (image && !image.startsWith('blob:')) {
          await deleteImageFromBucket(image);
        }
        
        setImageFile(file);
        setImagePreviewLoading(true);
        setTimeout(() => {
          setImage(URL.createObjectURL(file));
          setImagePreviewLoading(false);
        }, 2000);
      }
    };

    const deleteImageFromBucket = async (imageUrl: string) => {
      try {
        const url = new URL(imageUrl);
        const pathParts = url.pathname.split('/').filter(part => part !== '');
        let bucketName = '';
        let filePath = '';
        if (pathParts.includes('image_upload')) {
          const bucketIndex = pathParts.indexOf('image_upload');
          bucketName = pathParts[bucketIndex];
          filePath = pathParts.slice(bucketIndex + 1).join('/');
        } else {
          bucketName = pathParts[pathParts.length - 2] || 'image_upload';
          filePath = pathParts[pathParts.length - 1] || '';
        }
        
        if (bucketName === 'image_upload' && filePath) {
          const { error } = await supabase.storage
            .from('image_upload')
            .remove([filePath]);
          
          if (error) {
            console.error('Error deleting image from bucket:', error);
          }
        }
      } catch (error) {
        console.error('Error parsing image URL for deletion:', error);
      }
    };

    const handleRemoveImage = async () => {
      if (image && !image.startsWith('blob:')) {
        await deleteImageFromBucket(image);
      }
      setTimeout(() => {
        setImage("");
        setImageFile(null);
        setImagePreviewLoading(false);
        const fileInput = document.getElementById("image") as HTMLInputElement;
        if (fileInput) {
          fileInput.value = "";
        }
      }, 100);
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
      const { data } = supabase.storage
        .from("image_upload")
        .getPublicUrl(filePath);
      return data?.publicUrl ?? null;
    };
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    // Validate form before submission
    if (!validateForm()) {
      setLoading(false);
      return;
    }

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
      // Generate unique slug for new post
      const { data: existingSlugs } = await supabase
        .from("posts")
        .select("posts_slug");
      
      const slugList = existingSlugs?.map(p => p.posts_slug).filter(Boolean) || [];
      const finalSlug = await generateUniqueSlug(title, slugList);
      
      const { error } = await supabase
        .from("posts")
        .insert([{
          title,
          description,
          content,
          categories: categories?.toLowerCase().trim(),
          tags: tags?.toLowerCase().trim(),
          author_id,
          views: 0,
          active: true,
          image: imageUrl,
          posts_slug: finalSlug
        }]);
      if (error) setError(error.message);
      else onSuccess();
    } else if (mode === "edit" && post?.id) {
      let updateData: any = {
        title,
        description,
        content,
        categories: categories?.toLowerCase().trim(),
        tags: tags?.toLowerCase().trim(),
        image: imageUrl,
        updated_at: new Date().toISOString(),
      };
      
      // Update slug if title changed OR if post doesn't have a slug yet
      if (title !== post.title || !post.posts_slug) {
        const { data: existingSlugs } = await supabase
          .from("posts")
          .select("posts_slug")
          .neq("id", post.id);
        
        const slugList = existingSlugs?.map(p => p.posts_slug).filter(Boolean) || [];
        const finalSlug = await generateUniqueSlug(title, slugList);
        updateData.posts_slug = finalSlug;
      }
      
      const { error } = await supabase
        .from("posts")
        .update(updateData)
        .eq("id", post.id);
      if (error) setError(error.message);
      else onSuccess();
    }
    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-xl mx-auto">
      <h2 className="text-2xl font-bold mb-4 text-center dark:text-white">{mode === "create" ? "Create Post" : "Edit Post"}</h2>
      <label className="block mb-1 font-semibold dark:text-white" htmlFor="title">Title <span className="text-red-500">*</span></label>
      <input
        id="title"
        type="text"
        placeholder="Enter post title"
        value={title}
        onChange={e => handleFieldChange('title', e.target.value)}
        className={`w-full mb-1 px-3 py-2 rounded border bg-white dark:bg-gray-800 dark:text-white ${
          validationErrors.title ? 'border-red-500 focus:border-red-500' : 'border-gray-300 dark:border-gray-600 focus:border-blue-500'
        }`}
      />
      {validationErrors.title && (
        <p className="text-red-500 text-sm mb-3">{validationErrors.title}</p>
      )}
      
      <label className="block mb-1 font-semibold dark:text-white" htmlFor="description">Description <span className="text-red-500">*</span></label>
      <input
        id="description"
        type="text"
        placeholder="Enter post description"
        value={description}
        onChange={e => handleFieldChange('description', e.target.value)}
        className={`w-full mb-1 px-3 py-2 rounded border bg-white dark:bg-gray-800 dark:text-white ${
          validationErrors.description ? 'border-red-500 focus:border-red-500' : 'border-gray-300 dark:border-gray-600 focus:border-blue-500'
        }`}
      />
      {validationErrors.description && (
        <p className="text-red-500 text-sm mb-3">{validationErrors.description}</p>
      )}
      {/* <textarea
        placeholder="Content"
        value={content}
        onChange={e => setContent(e.target.value)}
        className="w-full mb-3 px-3 py-2 rounded border bg-white dark:bg-gray-800 dark:text-white"
        rows={6}
        required
      /> */}
      <label className="block mb-1 font-semibold dark:text-white" htmlFor="content">Content <span className="text-red-500">*</span></label>
      <div className={` ${validationErrors.content ? 'border border-red-500 rounded' : ''}`}>
        <TipTap value={content} onChange={(value) => handleFieldChange('content', value)} placeholder="Write your post content here..."/>
      </div>
      {validationErrors.content && (
        <p className="text-red-500 text-sm mb-3">{validationErrors.content}</p>
      )}
      
      <label className="block mb-1 font-semibold dark:text-white" htmlFor="categories">Categories <span className="text-red-500">*</span></label>
      <input
        id="categories"
        type="text"
        placeholder="Enter categories"
        value={categories}
        onChange={e => handleFieldChange('categories', e.target.value)}
        className={`w-full mb-1 px-3 py-2 rounded border bg-white dark:bg-gray-800 dark:text-white ${
          validationErrors.categories ? 'border-red-500 focus:border-red-500' : 'border-gray-300 dark:border-gray-600 focus:border-blue-500'
        }`}
      />
      {validationErrors.categories && (
        <p className="text-red-500 text-sm mb-3">{validationErrors.categories}</p>
      )}
      
      <label className="block mb-1 font-semibold dark:text-white" htmlFor="tags">Tags (comma separated) <span className="text-red-500">*</span></label>
      <input
        id="tags"
        type="text"
        placeholder="Enter tags separated by commas"
        value={tags}
        onChange={e => handleFieldChange('tags', e.target.value)}
        className={`w-full mb-1 px-3 py-2 rounded border bg-white dark:bg-gray-800 dark:text-white ${
          validationErrors.tags ? 'border-red-500 focus:border-red-500' : 'border-gray-300 dark:border-gray-600 focus:border-blue-500'
        }`}
      />
      {validationErrors.tags && (
        <p className="text-red-500 text-sm mb-3">{validationErrors.tags}</p>
      )}
      <label className="block mb-1 font-semibold dark:text-white" htmlFor="image">Upload Image <span className="text-gray-500 text-sm">(optional)</span></label>
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
            <div className="relative inline-block">
              <img
                src={image}
                alt="Preview"
                className="rounded-tr-xl rounded-br-xl object-cover w-[320px] h-[220px] bg-gray-200"
              />
              <button
                type="button"
                onClick={handleRemoveImage}
                className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white rounded-full p-2 shadow-lg transition-colors duration-200 z-10"
                title="Remove image"
              >
                <FiX className="w-4 h-4" />
              </button>
            </div>
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