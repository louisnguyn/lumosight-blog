import React from 'react';

interface ReplyFormProps {
  replyContent: string;
  loading: boolean;
  onContentChange: (value: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  onCancel: () => void;
}

const ReplyForm: React.FC<ReplyFormProps> = ({
  replyContent,
  loading,
  onContentChange,
  onSubmit,
  onCancel
}) => {
  return (
    <form onSubmit={onSubmit} className="mt-3 sm:mt-4">
      <textarea
        value={replyContent}
        onChange={(e) => onContentChange(e.target.value)}
        className="w-full p-2 sm:p-3 border border-gray-300 dark:border-gray-600 rounded-lg resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white break-words overflow-wrap-anywhere text-sm sm:text-base"
        rows={2}
        placeholder="Write a reply..."
        required
      />
      <div className="flex gap-2 mt-2">
        <button
          type="submit"
          disabled={loading}
          className="px-3 py-1.5 sm:px-4 sm:py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 text-sm sm:text-base"
        >
          Reply
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="px-3 py-1.5 sm:px-4 sm:py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 text-sm sm:text-base"
        >
          Cancel
        </button>
      </div>
    </form>
  );
};

export default ReplyForm;
