import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../../../db/supabaseClient';

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

export const useComments = (postId: string) => {
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchComments = useCallback(async () => {
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
  }, [postId]);

  const addComment = useCallback(async (content: string, authorId: string) => {
    setLoading(true);
    try {
      const { error } = await supabase
        .from('comments')
        .insert({
          post_id: postId,
          author_id: authorId,
          content: content.trim(),
          parent_id: null
        });

      if (error) throw error;
      await fetchComments();
    } catch (error) {
      console.error('Error submitting comment:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  }, [postId, fetchComments]);

  const addReply = useCallback(async (content: string, authorId: string, parentId: string) => {
    setLoading(true);
    try {
      const { error } = await supabase
        .from('comments')
        .insert({
          post_id: postId,
          author_id: authorId,
          content: content.trim(),
          parent_id: parentId
        });

      if (error) throw error;
      await fetchComments();
    } catch (error) {
      console.error('Error submitting reply:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  }, [postId, fetchComments]);

  const updateComment = useCallback(async (commentId: string, content: string) => {
    setLoading(true);
    try {
      const { error } = await supabase
        .from('comments')
        .update({ content: content.trim() })
        .eq('id', commentId);

      if (error) throw error;
      await fetchComments();
    } catch (error) {
      console.error('Error updating comment:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  }, [fetchComments]);

  const deleteComment = useCallback(async (commentId: string) => {
    setLoading(true);
    try {
      const { error } = await supabase
        .from('comments')
        .delete()
        .eq('id', commentId);

      if (error) throw error;
      await fetchComments();
    } catch (error) {
      console.error('Error deleting comment:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  }, [fetchComments]);

  useEffect(() => {
    fetchComments();
  }, [fetchComments]);

  return {
    comments,
    loading,
    addComment,
    addReply,
    updateComment,
    deleteComment,
    refetchComments: fetchComments
  };
};
