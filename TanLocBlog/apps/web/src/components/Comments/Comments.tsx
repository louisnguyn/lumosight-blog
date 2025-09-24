import React, { useState, useEffect, useCallback } from 'react';
import { supabase } from '../../db/supabaseClient';
import { FaReply, FaUser, FaClock, FaEdit, FaTrash } from 'react-icons/fa';
import { Link } from 'react-router-dom';

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

interface CommentsProps {
  postId: string;
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
      {/* Visual depth indicator for mobile */}
      {/* {actualDepth > 0 && (
        <div className="flex items-center mb-2">
          <div className="flex items-center gap-1">
            {Array.from({ length: actualDepth }, (_, i) => (
              <div key={i} className="w-1 h-1 bg-gray-400 rounded-full"></div>
            ))}
            <span className="text-xs text-gray-500 ml-1">Reply to comment</span>
          </div>
        </div>
      )} */}
      <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-3 sm:p-4">
        <div className="flex items-start gap-3">
          <img
            src={comment.author_avatar}
            alt={comment.author_name}
            className="w-8 h-8 rounded-full object-cover flex-shrink-0"
          />
            <div className="flex-1 min-w-0">
              <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2 mb-2">
                <span className="font-semibold text-gray-900 dark:text-white">
                  {comment.author_name}
                </span>
                <span className="text-gray-500 text-xs sm:text-sm flex items-center gap-1">
                  {formatDate(comment.created_at)}
                </span>
              </div>
            
            {isEditing ? (
              <form onSubmit={(e) => onEdit(e, comment.id)} className="mt-2">
                <textarea
                  value={editContent}
                  onChange={(e) => onEditContentChange(e.target.value)}
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
                    onClick={onCancelEdit}
                    className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            ) : (
              <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap break-words overflow-wrap-anywhere">
                {comment.content}
              </p>
            )}

            <div className="flex flex-wrap items-center gap-2 sm:gap-4 mt-3">
              {user && actualDepth < maxDepth && (
                <button
                  onClick={() => onReplyClick(comment.id)}
                  className="flex items-center gap-1 text-blue-600 hover:text-blue-800 text-xs sm:text-sm font-medium px-2 py-1 rounded"
                >
                  <FaReply className="w-3 h-3 hidden sm:inline" />
                  <span className="">Reply</span>
                </button>
              )}

              {isAuthor && (
                <>
                  <button
                    onClick={() => onEditClick(comment.id, comment.content)}
                    className="flex items-center gap-1 text-gray-600 hover:text-gray-800 text-xs sm:text-sm font-medium px-2 py-1 rounded"
                  >
                    <FaEdit className="w-3 h-3 hidden sm:inline" />
                    <span className="">Edit</span>
                  </button>
                  <button
                    onClick={() => onDelete(comment.id)}
                    className="flex items-center gap-1 text-red-600 hover:text-red-800 text-xs sm:text-sm font-medium px-2 py-1 rounded"
                  >
                    <FaTrash className="w-3 h-3 hidden sm:inline" />
                    <span className="">Delete</span>
                  </button>
                </>
              )}
            </div>

            {/* Reply Form */}
            {replyingTo === comment.id && user && (
              <form onSubmit={(e) => onReply(e, comment.id)} className="mt-4">
                <textarea
                  value={replyContent}
                  onChange={(e) => onReplyContentChange(e.target.value)}
                  className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white break-words overflow-wrap-anywhere"
                  rows={3}
                  placeholder="Write a reply..."
                  required
                />
                <div className="flex gap-2 mt-2">
                  <button
                    type="submit"
                    disabled={loading}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
                  >
                    Reply
                  </button>
                  <button
                    type="button"
                    onClick={onCancelReply}
                    className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600"
                  >
                    Cancel
                  </button>
                </div>
              </form>
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

export default function Comments({ postId }: CommentsProps) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [replyContent, setReplyContent] = useState('');
  const [editingComment, setEditingComment] = useState<string | null>(null);
  const [editContent, setEditContent] = useState('');
  const [user, setUser] = useState<any>(null);
  const [userProfile, setUserProfile] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchComments();
    fetchUser();
  }, [postId]);

  const fetchUser = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    setUser(user);
    
    if (user) {
      // Fetch user profile information
      const { data: profile, error } = await supabase
        .from('profile')
        .select('full_name, avatar_url')
        .eq('user_id', user.id)
        .single();
      
      if (profile) {
        setUserProfile(profile);
      }
    }
  };

  const fetchComments = async () => {
    try {
      // First, fetch all comments for this post
      const { data: allComments, error: commentsError } = await supabase
        .from('comments')
        .select('*')
        .eq('post_id', postId)
        .order('created_at', { ascending: true });

      if (commentsError) throw commentsError;

      // Get unique author IDs
      const authorIds = [...new Set(allComments?.map(comment => comment.author_id) || [])];
      
      // Fetch author profiles
      const { data: profiles, error: profilesError } = await supabase
        .from('profile')
        .select('user_id, full_name, avatar_url')
        .in('user_id', authorIds);

      if (profilesError) throw profilesError;

      // Create a map of author_id to profile data
      const profileMap = new Map();
      profiles?.forEach(profile => {
        profileMap.set(profile.user_id, {
          full_name: profile.full_name || 'Unknown User',
          avatar_url: profile.avatar_url || '/profile.jpeg'
        });
      });

      // Build a map of all comments with author info
      const commentsWithAuthors = allComments?.map(comment => {
        const authorInfo = profileMap.get(comment.author_id) || {
          full_name: 'Unknown User',
          avatar_url: '/profile.jpeg'
        };
        return {
          ...comment,
          author_name: authorInfo.full_name,
          author_avatar: authorInfo.avatar_url,
          replies: []
        };
      }) || [];

      // Create a map for quick lookup
      const commentMap = new Map();
      commentsWithAuthors.forEach(comment => {
        commentMap.set(comment.id, comment);
      });

      // Build nested structure
      const rootComments: Comment[] = [];
      
      commentsWithAuthors.forEach(comment => {
        if (comment.parent_id === null) {
          // This is a root comment
          rootComments.push(comment);
        } else {
          // This is a reply, find its parent
          const parent = commentMap.get(comment.parent_id);
          if (parent) {
            parent.replies.push(comment);
          }
        }
      });

      // Sort replies within each comment
      const sortReplies = (comment: Comment) => {
        if (comment.replies && comment.replies.length > 0) {
          comment.replies.sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime());
          comment.replies.forEach(sortReplies);
        }
      };

      rootComments.forEach(sortReplies);
      const commentsWithReplies = rootComments;

      setComments(commentsWithReplies);
    } catch (error) {
      console.error('Error fetching comments:', error);
    }
  };

  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !newComment.trim()) return;

    setLoading(true);
    try {
      const { error } = await supabase
        .from('comments')
        .insert({
          post_id: postId,
          author_id: user.id,
          content: newComment.trim(),
          parent_id: null
        });

      if (error) throw error;

      setNewComment('');
      fetchComments();
    } catch (error) {
      console.error('Error submitting comment:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleReply = async (e: React.FormEvent, parentId: string) => {
    e.preventDefault();
    if (!user || !replyContent.trim()) return;

    setLoading(true);
    try {
      const { error } = await supabase
        .from('comments')
        .insert({
          post_id: postId,
          author_id: user.id,
          content: replyContent.trim(),
          parent_id: parentId
        });

      if (error) throw error;

      setReplyContent('');
      setReplyingTo(null);
      fetchComments();
    } catch (error) {
      console.error('Error submitting reply:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = async (e: React.FormEvent, commentId: string) => {
    e.preventDefault();
    if (!editContent.trim()) return;

    setLoading(true);
    try {
      const { error } = await supabase
        .from('comments')
        .update({ content: editContent.trim() })
        .eq('id', commentId);

      if (error) throw error;

      setEditContent('');
      setEditingComment(null);
      fetchComments();
    } catch (error) {
      console.error('Error updating comment:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (commentId: string) => {
    if (!window.confirm('Are you sure you want to delete this comment?')) return;

    setLoading(true);
    try {
      const { error } = await supabase
        .from('comments')
        .delete()
        .eq('id', commentId);

      if (error) throw error;

      fetchComments();
    } catch (error) {
      console.error('Error deleting comment:', error);
    } finally {
      setLoading(false);
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

  // Memoized handlers to prevent unnecessary re-renders
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

      {/* New Comment Form - Only for authenticated users */}
      {user ? (
        <form onSubmit={handleSubmitComment} className="mb-8">
          <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-6">
            <div className="flex items-start gap-3">
              <img
                src={userProfile?.avatar_url || '/profile.jpeg'}
                alt="Your avatar"
                className="w-8 h-8 rounded-full object-cover"
              />
              <div className="flex-1">
                <textarea
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white break-words overflow-wrap-anywhere"
                  rows={4}
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
      ) : (
        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4 mb-8">
          <p className="text-blue-800 dark:text-blue-200 text-center">
            <Link to="/login" className="font-semibold hover:underline">
              Sign in
            </Link>{' '}
            to post comments and replies
          </p>
        </div>
      )}

      {/* Comments List */}
      <div className="space-y-4">
        {comments.length === 0 ? (
          <div className="text-center py-8 text-gray-500 dark:text-gray-400">
            <FaUser className="w-12 h-12 mx-auto mb-4 opacity-50" />
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
