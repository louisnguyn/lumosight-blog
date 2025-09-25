import React from 'react';
import { Link } from 'react-router-dom';

interface CommentFormProps {
  user: any;
  userProfile: any;
  newComment: string;
  loading: boolean;
  onCommentChange: (value: string) => void;
  onSubmit: (e: React.FormEvent) => void;
}

const CommentForm: React.FC<CommentFormProps> = ({
  user,
  userProfile,
  newComment,
  loading,
  onCommentChange,
  onSubmit
}) => {
  if (!user) {
    return (
      <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4 mb-8">
        <p className="text-blue-800 dark:text-blue-200 text-center">
          <Link to="/login" className="font-semibold hover:underline">
            Sign in
          </Link>{' '}
          to post comments and replies
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="mb-6 sm:mb-8">
      <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 sm:p-6">
        <div className="flex items-start gap-2 sm:gap-3">
          <img
            src={userProfile?.avatar_url || '/profile.jpeg'}
            alt="Your avatar"
            className="w-7 h-7 sm:w-8 sm:h-8 rounded-full object-cover flex-shrink-0"
          />
          <div className="flex-1 min-w-0">
            <textarea
              value={newComment}
              onChange={(e) => onCommentChange(e.target.value)}
              className="w-full p-2 sm:p-3 border border-gray-300 dark:border-gray-600 rounded-lg resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white break-words overflow-wrap-anywhere text-sm sm:text-base"
              rows={3}
              placeholder="Write a comment..."
              required
            />
            <div className="flex justify-end mt-3">
              <button
                type="submit"
                disabled={loading || !newComment.trim()}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Posting...' : 'Post Comment'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </form>
  );
};

export default CommentForm;
