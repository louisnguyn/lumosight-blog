import React from 'react';
import { FaReply, FaEdit, FaTrash } from 'react-icons/fa';

interface CommentActionsProps {
  user: any;
  isAuthor: boolean;
  actualDepth: number;
  maxDepth: number;
  onReplyClick: () => void;
  onEditClick: () => void;
  onDeleteClick: () => void;
}

const CommentActions: React.FC<CommentActionsProps> = ({
  user,
  isAuthor,
  actualDepth,
  maxDepth,
  onReplyClick,
  onEditClick,
  onDeleteClick
}) => {
  return (
    <div className="flex flex-wrap items-center gap-2 sm:gap-4 mt-3">
      {user && actualDepth < maxDepth && (
        <button
          onClick={onReplyClick}
          className="flex items-center gap-1 text-blue-600 hover:text-blue-800 text-xs sm:text-sm font-medium px-2 py-1 rounded"
        >
          <FaReply className="w-3 h-3 hidden sm:inline" />
          <span>Reply</span>
        </button>
      )}

      {isAuthor && (
        <>
          <button
            onClick={onEditClick}
            className="flex items-center gap-1 text-gray-600 hover:text-gray-800 text-xs sm:text-sm font-medium px-2 py-1 rounded"
          >
            <FaEdit className="w-3 h-3 hidden sm:inline" />
            <span>Edit</span>
          </button>
          <button
            onClick={onDeleteClick}
            className="flex items-center gap-1 text-red-600 hover:text-red-800 text-xs sm:text-sm font-medium px-2 py-1 rounded"
          >
            <FaTrash className="w-3 h-3 hidden sm:inline" />
            <span>Delete</span>
          </button>
        </>
      )}
    </div>
  );
};

export default CommentActions;
