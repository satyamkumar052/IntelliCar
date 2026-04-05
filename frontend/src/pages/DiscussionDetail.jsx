import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../api';
import { Loader2, ArrowLeft, User as UserIcon, Calendar, Reply, MessageCircle } from 'lucide-react';
import { toast } from 'react-toastify';

const DiscussionDetail = () => {
  const { id } = useParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [replyContent, setReplyContent] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchThread();
  }, [id]);

  const fetchThread = async () => {
    try {
      const res = await api.get(`/forum/${id}`);
      setData(res.data.data);
    } catch (err) {
      console.error(err);
      toast.error('Failed to load discussion.');
    } finally {
      setLoading(false);
    }
  };

  const handleAddReply = async (e) => {
    e.preventDefault();
    if (!replyContent.trim()) return;
    setSubmitting(true);
    try {
      await api.post(`/forum/${id}/reply`, { content: replyContent });
      setReplyContent('');
      fetchThread();
      toast.success('Reply posted!');
    } catch (err) {
      toast.error(err.response?.data?.message || err.message || "Error posting reply.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <div className="p-8 mt-20 text-center animate-pulse flex items-center justify-center gap-2"><Loader2 className="animate-spin" /> Loading Discussion...</div>;
  if (!data || !data.post) return <div className="p-8 text-center text-red-400">Discussion not found.</div>;

  const { post, replies } = data;

  return (
    <div className="p-6 md:p-12 max-w-5xl mx-auto">
      <Link to="/forum" className="inline-flex items-center gap-2 text-sky-400 hover:text-sky-300 font-semibold tracking-wider text-sm font-heading mb-6 transition-colors">
        <ArrowLeft size={16} /> BACK TO FORUM
      </Link>

      {/* Main Post */}
      <div className="glass-card p-6 md:p-8 mb-8 border-t-4 border-t-primary">
        <h1 className="text-2xl md:text-3xl font-heading font-bold text-white mb-4">{post.title}</h1>
        
        <div className="flex flex-wrap items-center gap-4 text-sm text-secondary/80 mb-6 border-b border-white/5 pb-6">
          <span className="flex items-center gap-1.5 bg-white/5 px-3 py-1 rounded-full"><UserIcon size={14} /> {post.author?.name || 'Unknown User'}</span>
          <span className="flex items-center gap-1.5"><Calendar size={14} /> {new Date(post.createdAt).toLocaleDateString()} at {new Date(post.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
        </div>

        <div className="prose prose-invert max-w-none text-slate-200 leading-relaxed whitespace-pre-wrap font-body">
          {post.content}
        </div>

        {post.tags && post.tags.length > 0 && (
          <div className="flex gap-2 mt-8 pt-4 border-t border-white/5">
            {post.tags.map(tag => (
              <span key={tag} className="bg-sky-500/10 text-sky-400 px-3 py-1 rounded-full text-xs font-semibold tracking-wider uppercase border border-sky-500/20">
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Replies Section */}
      <div className="mb-4 flex items-center gap-2 text-slate-300">
        <MessageCircle size={20} />
        <h3 className="text-xl font-heading font-semibold">Replies ({replies.length})</h3>
      </div>

      <div className="flex flex-col gap-4 mb-8">
        {replies.length === 0 ? (
          <div className="p-8 text-center text-secondary bg-surface-lowest rounded-2xl border border-white/5 italic">
            No replies yet. Start the conversation!
          </div>
        ) : (
          replies.map((reply, idx) => (
            <div key={reply._id} className="bg-surface-lowest p-6 rounded-2xl border border-white/5 relative">
              <div className="flex items-center gap-3 mb-3 pb-3 border-b border-white/5">
                 <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-xs font-bold text-white shadow-lg">
                    {reply.author?.name?.[0]?.toUpperCase() || 'U'}
                 </div>
                 <div>
                   <div className="font-semibold text-slate-200">{reply.author?.name || 'Unknown User'}</div>
                   <div className="text-xs text-slate-500">{new Date(reply.createdAt).toLocaleDateString()} at {new Date(reply.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</div>
                 </div>
              </div>
              <div className="text-slate-300 whitespace-pre-wrap text-sm leading-relaxed">
                {reply.content}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Add Reply */}
      <div className="glass-card p-6 border border-white/10 relative overflow-hidden">
        <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none text-primary"><Reply size={100} /></div>
        <h3 className="text-lg font-heading font-bold text-white mb-4 relative z-10">Add a Reply</h3>
        <form onSubmit={handleAddReply} className="relative z-10">
          <textarea 
            className="input-glow w-full min-h-[100px] resize-y mb-4" 
            placeholder="Write your advice or comment here..."
            value={replyContent}
            onChange={e => setReplyContent(e.target.value)}
            required
          />
          <div className="flex justify-end">
            <button disabled={submitting} type="submit" className="btn-primary shrink-0 gap-2 flex items-center px-6">
              {submitting ? <Loader2 size={16} className="animate-spin" /> : <><Reply size={16} /> Post Reply</>}
            </button>
          </div>
        </form>
      </div>

    </div>
  );
};

export default DiscussionDetail;
