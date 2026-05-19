import React from 'react';
import CommentActions from './CommentActions';
import ReplyForm from './ReplyForm';
import EditForm from './EditForm';

interface Comment {
  id: string;
  content: string;
  created_at: string;
  updated_at: string;
  author_id: string;
  post_id: string;
  parent_id: string | null;
  author_name?: string;
  author_avatar?: string;
  replies?: Comment[];
}

interface CommentItemProps {
  comment: Comment;
  depth?: number;
  user: any;
  replyingTo: string | null;
  editingComment: string | null;
  editContent: string;
  replyContent: string;
  loading: boolean;
  onReplyClick: (commentId: string) => void;
  onEditClick: (commentId: string, content: string) => void;
  onCancelEdit: () => void;
  onCancelReply: () => void;
  onReplyContentChange: (value: string) => void;
  onEditContentChange: (value: string) => void;
  onReply: (e: React.FormEvent, parentId: string) => void;
  onEdit: (e: React.FormEvent, commentId: string) => void;
  onDelete: (commentId: string) => void;
  formatDate: (dateString: string) => string;
}

const CommentItem = React.memo(({ 
  comment, 
  depth = 0,
  user, 
  replyingTo, 
  editingComment, 
  editContent, 
  replyContent, 
  loading,
  onReplyClick,
  onEditClick,
  onCancelEdit,
  onCancelReply,
  onReplyContentChange,
  onEditContentChange,
  onReply,
  onEdit,
  onDelete,
  formatDate
}: CommentItemProps) => {
  const isAuthor = user && user.id === comment.author_id;
  const isEditing = editingComment === comment.id;
  const maxDepth = 3;
  const actualDepth = Math.min(depth, maxDepth);
  
  // Mobile-friendly design - no horizontal indentation
  const containerStyle = {
    marginTop: actualDepth > 0 ? '0.5rem' : '0',
    marginBottom: actualDepth === 0 ? '1.5rem' : '0'
  };

  return (
    <div style={containerStyle} className="relative">
      <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-3 sm:p-4 overflow-hidden">
        <div className="flex items-start gap-2 sm:gap-3">
          <img
            src={comment.author_avatar}
            alt={comment.author_name}
            className="w-7 h-7 sm:w-8 sm:h-8 rounded-full object-cover flex-shrink-0"
          />
            <div className="flex-1 min-w-0 overflow-hidden">
              <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2 mb-2">
                <span className="font-semibold text-gray-900 dark:text-white">
                  {comment.author_name}
                </span>
                <span className="text-gray-500 text-xs sm:text-sm flex items-center gap-1">
                  {formatDate(comment.created_at)}
                </span>
              </div>
            {isEditing ? (
              <EditForm
                editContent={editContent}
                loading={loading}
                onContentChange={onEditContentChange}
                onSubmit={(e) => onEdit(e, comment.id)}
                onCancel={onCancelEdit}
              />
            ) : (
              <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap break-words overflow-wrap-anywhere text-sm sm:text-base leading-relaxed max-w-full">
                {comment.content}
              </p>
            )}

            <CommentActions
              user={user}
              isAuthor={isAuthor}
              actualDepth={actualDepth}
              maxDepth={maxDepth}
              onReplyClick={() => onReplyClick(comment.id)}
              onEditClick={() => onEditClick(comment.id, comment.content)}
              onDeleteClick={() => onDelete(comment.id)}
            />

            {/* Reply Form */}
            {replyingTo === comment.id && user && (
              <ReplyForm
                replyContent={replyContent}
                loading={loading}
                onContentChange={onReplyContentChange}
                onSubmit={(e) => onReply(e, comment.id)}
                onCancel={onCancelReply}
              />
            )}

            {/* Render Replies */}
            {comment.replies && comment.replies.length > 0 && (
              <div className="mt-4">
                {comment.replies.map((reply) => (
                  <CommentItem 
                    key={reply.id} 
                    comment={reply} 
                    depth={actualDepth + 1}
                    user={user}
                    replyingTo={replyingTo}
                    editingComment={editingComment}
                    editContent={editContent}
                    replyContent={replyContent}
                    loading={loading}
                    onReplyClick={onReplyClick}
                    onEditClick={onEditClick}
                    onCancelEdit={onCancelEdit}
                    onCancelReply={onCancelReply}
                    onReplyContentChange={onReplyContentChange}
                    onEditContentChange={onEditContentChange}
                    onReply={onReply}
                    onEdit={onEdit}
                    onDelete={onDelete}
                    formatDate={formatDate}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
});

CommentItem.displayName = 'CommentItem';

export default CommentItem;
export type { Comment, CommentItemProps };
