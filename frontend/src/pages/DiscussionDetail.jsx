import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../api';
import { Loader2, ArrowLeft, User as UserIcon, Calendar, Reply, MessageCircle, CheckCircle, AlertTriangle, X } from 'lucide-react';
import { toast } from 'react-toastify';
import { io } from 'socket.io-client';
import { useSelector } from 'react-redux';

const DiscussionDetail = () => {
  const { id } = useParams();
  const { user } = useSelector(state => state.auth);
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [replyContent, setReplyContent] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [showResolveModal, setShowResolveModal] = useState(false);

  useEffect(() => {
    fetchThread();

    const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
    const socketUrl = apiUrl.endsWith('/api') ? apiUrl.slice(0, -4) : apiUrl;
    const socket = io(socketUrl);

    socket.on('new_reply', (payload) => {
      if (payload.discussionId === id) {
        setData(prevData => {
          if (!prevData) return prevData;
          const alreadyExists = prevData.replies.some(r => r._id === payload.reply._id);
          if (alreadyExists) return prevData;
          return {
            ...prevData,
            replies: [...prevData.replies, payload.reply]
          };
        });
      }
    });

    socket.on('discussion_resolved', (payload) => {
      if (payload.discussionId === id) {
        setData(prevData => {
          if (!prevData) return prevData;
          return {
            ...prevData,
            post: { ...prevData.post, isResolved: true }
          };
        });
      }
    });

    return () => {
      socket.disconnect();
    };
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
    } catch (err) {
      toast.error(err.response?.data?.message || err.message || "Error posting reply.");
    } finally {
      setSubmitting(false);
    }
  };

  const confirmResolve = async () => {
    setShowResolveModal(false);
    try {
      await api.put(`/forum/${id}/resolve`);
      toast.success("Discussion marked as solved!");
      fetchThread();
    } catch (err) {
      toast.error(err.response?.data?.message || err.message || "Error resolving discussion.");
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
      <div className="glass-card p-6 md:p-8 mb-8 border-t-4 border-t-primary relative">
        {post.isResolved && (
          <div className="absolute top-0 right-0 m-6 flex items-center gap-2 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider">
            <CheckCircle size={14} /> Solved
          </div>
        )}
        <h1 className="text-2xl md:text-3xl font-heading font-bold text-white mb-4 pr-32">{post.title}</h1>
        
        <div className="flex flex-wrap items-center gap-4 text-sm text-secondary/80 mb-6 border-b border-white/5 pb-6">
          <span className="flex items-center gap-1.5 bg-white/5 px-3 py-1 rounded-full"><UserIcon size={14} /> {post.author?.name || 'Unknown User'}</span>
          <span className="flex items-center gap-1.5"><Calendar size={14} /> {new Date(post.createdAt).toLocaleDateString()} at {new Date(post.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
        </div>

        <div className="prose prose-invert max-w-none text-slate-200 leading-relaxed whitespace-pre-wrap font-body">
          {post.content}
        </div>

        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mt-8 pt-4 border-t border-white/5 gap-4">
          {post.tags && post.tags.length > 0 ? (
            <div className="flex gap-2">
              {post.tags.map(tag => (
                <span key={tag} className="bg-sky-500/10 text-sky-400 px-3 py-1 rounded-full text-xs font-semibold tracking-wider uppercase border border-sky-500/20">
                  {tag}
                </span>
              ))}
            </div>
          ) : <div />}
          
          {user && post.author?._id === user._id && !post.isResolved && (
            <button onClick={() => setShowResolveModal(true)} className="flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-emerald-500/10 hover:text-emerald-400 border border-white/10 hover:border-emerald-500/20 text-slate-300 rounded-lg text-sm font-semibold transition-all">
              <CheckCircle size={16} /> Mark as Solved
            </button>
          )}
        </div>
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
          replies.map((reply, idx) => {
            const isOwnReply = user && (reply.author?._id === user._id);
            return (
              <div key={reply._id} className={`flex ${isOwnReply ? 'justify-end' : 'justify-start'}`}>
                <div className={`p-5 rounded-2xl border relative w-full sm:w-[85%] md:w-[75%] ${isOwnReply ? 'bg-sky-500/10 border-sky-500/20 rounded-tr-md' : 'bg-surface-lowest border-white/5 rounded-tl-md'}`}>
                  <div className={`flex items-center gap-3 mb-3 pb-3 border-b ${isOwnReply ? 'border-sky-500/20' : 'border-white/5'}`}>
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-xs font-bold text-white shadow-lg shrink-0">
                        {reply.author?.name?.[0]?.toUpperCase() || 'U'}
                    </div>
                    <div>
                      <div className="font-semibold text-slate-200">{isOwnReply ? 'You' : (reply.author?.name || 'Unknown User')}</div>
                      <div className="text-xs text-slate-500">{new Date(reply.createdAt).toLocaleDateString()} at {new Date(reply.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</div>
                    </div>
                  </div>
                  <div className="text-slate-200 whitespace-pre-wrap text-sm leading-relaxed">
                    {reply.content}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Add Reply */}
      <div className="glass-card p-6 border border-white/10 relative overflow-hidden">
        <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none text-primary"><Reply size={100} /></div>
        <h3 className="text-lg font-heading font-bold text-white mb-4 relative z-10">Add a Reply</h3>
        {post.isResolved ? (
          <div className="bg-emerald-500/10 border border-emerald-500/20 p-4 rounded-xl flex items-center gap-3 text-emerald-400 relative z-10">
            <CheckCircle size={20} />
            <div>
              <h4 className="font-bold">Discussion Solved</h4>
              <p className="text-sm opacity-90">The author has marked this discussion as solved. No further replies can be added.</p>
            </div>
          </div>
        ) : (
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
        )}
      </div>

      {/* Resolve Confirmation Modal */}
      {showResolveModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-surface-lowest border border-white/10 p-6 rounded-2xl shadow-2xl max-w-md w-full animate-in zoom-in-95 duration-200">
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center gap-3 text-emerald-400">
                <div className="p-2 bg-emerald-500/10 rounded-full">
                  <AlertTriangle size={24} />
                </div>
                <h3 className="text-xl font-heading font-bold text-white">Mark as Solved?</h3>
              </div>
              <button onClick={() => setShowResolveModal(false)} className="text-slate-400 hover:text-white transition-colors">
                <X size={20} />
              </button>
            </div>
            <p className="text-slate-300 mb-6 leading-relaxed">
              Are you sure you want to mark this discussion as solved? <br/>
              <span className="text-red-400 font-semibold text-sm mt-2 block">This action is permanent and will prevent any further replies.</span>
            </p>
            <div className="flex justify-end gap-3">
              <button onClick={() => setShowResolveModal(false)} className="px-5 py-2 rounded-lg font-semibold text-sm text-slate-300 hover:text-white hover:bg-white/5 transition-colors">
                Cancel
              </button>
              <button onClick={confirmResolve} className="px-5 py-2 rounded-lg font-semibold text-sm bg-emerald-500 hover:bg-emerald-600 text-white shadow-lg shadow-emerald-500/20 transition-all flex items-center gap-2">
                <CheckCircle size={16} /> Yes, Mark Solved
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default DiscussionDetail;
