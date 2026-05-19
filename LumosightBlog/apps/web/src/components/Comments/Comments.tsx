import React, { useState, useCallback } from 'react';
import { BiCommentDetail } from 'react-icons/bi';
import CommentItem from './CommentItem';
import CommentForm from './CommentForm';
import { useComments } from './hooks/useComments';
import { useUser } from './hooks/useUser';

interface CommentsProps {
  postId: string;
}

export default function Comments({ postId }: CommentsProps) {
  const [newComment, setNewComment] = useState('');
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [replyContent, setReplyContent] = useState('');
  const [editingComment, setEditingComment] = useState<string | null>(null);
  const [editContent, setEditContent] = useState('');
  const { user, userProfile } = useUser();
  const { comments, loading, addComment, addReply, updateComment, deleteComment } = useComments(postId);
  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !newComment.trim()) return;

    try {
      await addComment(newComment, user.id);
      setNewComment('');
    } catch (error) {
      console.error('Error submitting comment:', error);
    }
  };

  const handleReply = async (e: React.FormEvent, parentId: string) => {
    e.preventDefault();
    if (!user || !replyContent.trim()) return;

    try {
      await addReply(replyContent, user.id, parentId);
      setReplyContent('');
      setReplyingTo(null);
    } catch (error) {
      console.error('Error submitting reply:', error);
    }
  };

  const handleEdit = async (e: React.FormEvent, commentId: string) => {
    e.preventDefault();
    if (!editContent.trim()) return;

    try {
      await updateComment(commentId, editContent);
      setEditContent('');
      setEditingComment(null);
    } catch (error) {
      console.error('Error updating comment:', error);
    }
  };

  const handleDelete = async (commentId: string) => {
    if (!window.confirm('Are you sure you want to delete this comment?')) return;

    try {
      await deleteComment(commentId);
    } catch (error) {
      console.error('Error deleting comment:', error);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handleReplyClick = useCallback((commentId: string) => {
    setReplyingTo(replyingTo === commentId ? null : commentId);
    setReplyContent('');
  }, [replyingTo]);

  const handleEditClick = useCallback((commentId: string, content: string) => {
    setEditingComment(commentId);
    setEditContent(content);
  }, []);

  const handleCancelEdit = useCallback(() => {
    setEditingComment(null);
    setEditContent('');
  }, []);

  const handleCancelReply = useCallback(() => {
    setReplyingTo(null);
    setReplyContent('');
  }, []);

  const handleReplyContentChange = useCallback((value: string) => {
    setReplyContent(value);
  }, []);

  const handleEditContentChange = useCallback((value: string) => {
    setEditContent(value);
  }, []);

  return (
    <div className="mt-8">
      <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
        Comments ({comments.length})
      </h3>

      <CommentForm
        user={user}
        userProfile={userProfile}
        newComment={newComment}
        loading={loading}
        onCommentChange={setNewComment}
        onSubmit={handleSubmitComment}
      />
      <div className="space-y-4">
        {comments.length === 0 ? (
          <div className="text-center py-8 text-gray-500 dark:text-gray-400">
            <BiCommentDetail className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p>No comments yet. Be the first to comment!</p>
          </div>
        ) : (
          comments.map((comment) => (
            <CommentItem 
              key={comment.id} 
              comment={comment}
              depth={0}
              user={user}
              replyingTo={replyingTo}
              editingComment={editingComment}
              editContent={editContent}
              replyContent={replyContent}
              loading={loading}
              onReplyClick={handleReplyClick}
              onEditClick={handleEditClick}
              onCancelEdit={handleCancelEdit}
              onCancelReply={handleCancelReply}
              onReplyContentChange={handleReplyContentChange}
              onEditContentChange={handleEditContentChange}
              onReply={handleReply}
              onEdit={handleEdit}
              onDelete={handleDelete}
              formatDate={formatDate}
            />
          ))
        )}
      </div>
    </div>
  );
}