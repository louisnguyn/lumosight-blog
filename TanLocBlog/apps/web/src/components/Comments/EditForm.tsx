import React from 'react';

interface EditFormProps {
  editContent: string;
  loading: boolean;
  onContentChange: (value: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  onCancel: () => void;
}

const EditForm: React.FC<EditFormProps> = ({
  editContent,
  loading,
  onContentChange,
  onSubmit,
  onCancel
}) => {
  return (
    <form onSubmit={onSubmit} className="mt-2">
      <textarea
        value={editContent}
        onChange={(e) => onContentChange(e.target.value)}
        className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white break-words overflow-wrap-anywhere"
        rows={3}
        placeholder="Edit your comment..."
        required
      />
      <div className="flex gap-2 mt-2">
        <button
          type="submit"
          disabled={loading}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
        >
          Update
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600"
        >
          Cancel
        </button>
      </div>
    </form>
  );
};

export default EditForm;
