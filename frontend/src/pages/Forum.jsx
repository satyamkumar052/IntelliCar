import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../api';
import { Loader2, MessageSquarePlus, MessageCircle, User as UserIcon, Calendar } from 'lucide-react';
import { toast } from 'react-toastify';

const Forum = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({ title: '', content: '', tags: '' });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const res = await api.get('/forum');
      setPosts(res.data.data);
    } catch (err) {
      console.error(err);
      toast.error('Failed to load discussions.');
    } finally {
      setLoading(false);
    }
  };

  const handleCreatePost = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const tagsArray = formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag);
      await api.post('/forum', { ...formData, tags: tagsArray });
      setShowForm(false);
      setFormData({ title: '', content: '', tags: '' });
      fetchPosts();
      toast.success('Discussion posted successfully!');
    } catch (err) {
      toast.error(err.response?.data?.message || err.message || "Error posting discussion.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <div className="p-8 mt-20 text-center animate-pulse flex items-center justify-center gap-2"><Loader2 className="animate-spin" /> Loading Community Forum...</div>;

  return (
    <div className="p-6 md:p-12 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 border-b border-surface-container-high pb-4 gap-4">
        <div>
          <h1 className="text-3xl font-heading font-bold text-white">Community Forum</h1>
          <p className="text-sm text-secondary mt-1">Ask questions and share advice with other IntelliCar owners.</p>
        </div>
        <button onClick={() => setShowForm(!showForm)} className="btn-primary flex items-center gap-2 shrink-0">
          {showForm ? 'Cancel Discussion' : <><MessageSquarePlus size={18} /> New Discussion</>}
        </button>
      </div>

      {showForm && (
        <div className="glass-card p-6 mb-8 transform origin-top animate-in fade-in slide-in-from-top-4 duration-300">
          <h2 className="text-xl font-heading font-semibold text-white mb-4">Start a Discussion</h2>
          <form onSubmit={handleCreatePost} className="flex flex-col gap-4">
            <input 
              className="input-glow w-full" 
              placeholder="Title (e.g. Engine making whining noise when accelerating)" 
              required 
              value={formData.title} 
              onChange={e => setFormData({ ...formData, title: e.target.value })} 
            />
            <textarea 
              className="input-glow w-full min-h-[120px] resize-y" 
              placeholder="Describe your issue or question in detail..." 
              required 
              value={formData.content} 
              onChange={e => setFormData({ ...formData, content: e.target.value })} 
            />
            <input 
              className="input-glow w-full" 
              placeholder="Tags (comma separated, e.g. engine, noise, maintenance)" 
              value={formData.tags} 
              onChange={e => setFormData({ ...formData, tags: e.target.value })} 
            />
            <div className="flex justify-end">
              <button disabled={submitting} type="submit" className="btn-primary px-8">
                {submitting ? <Loader2 size={16} className="animate-spin" /> : 'Post'}
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="flex flex-col gap-4">
        {posts.length === 0 ? (
          <div className="text-center p-12 glass-card flex flex-col items-center">
            <MessageCircle size={48} className="text-surface-container-highest mb-4" />
            <h3 className="text-lg font-semibold text-white mb-2">No discussions yet</h3>
            <p className="text-secondary mb-4">Be the first to ask a question or start a conversation.</p>
            {!showForm && (
              <button onClick={() => setShowForm(true)} className="btn-primary">Start Discussion</button>
            )}
          </div>
        ) : (
          posts.map(post => (
            <Link key={post._id} to={`/forum/${post._id}`} className="block no-underline">
              <div className="glass-card p-5 border-l-4 border-transparent hover:border-primary transition-all group flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
                <div className="flex-grow">
                  <h3 className="text-xl font-heading font-bold text-white mb-2 group-hover:text-primary transition-colors">{post.title}</h3>
                  <p className="text-sm text-secondary line-clamp-2 mb-3 max-w-4xl">{post.content}</p>
                  
                  <div className="flex flex-wrap items-center gap-4 text-xs text-secondary/80">
                    <span className="flex items-center gap-1.5"><UserIcon size={14} /> {post.author?.name || 'Unknown User'}</span>
                    <span className="flex items-center gap-1.5"><Calendar size={14} /> {new Date(post.createdAt).toLocaleDateString()}</span>
                    {post.tags && post.tags.length > 0 && (
                      <div className="flex gap-2 ml-auto sm:ml-0">
                        {post.tags.map(tag => (
                          <span key={tag} className="bg-sky-500/10 text-sky-400 px-2 py-0.5 rounded-full text-[10px] border border-sky-500/20 font-semibold tracking-wider uppercase">
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="flex items-center gap-2 bg-surface-lowest px-4 py-3 rounded-xl border border-white/5 shrink-0 w-full sm:w-auto mt-2 sm:mt-0 justify-between sm:justify-start">
                   <div className="flex items-center gap-2">
                     <MessageCircle size={18} className="text-slate-400" />
                     <span className="font-mono text-lg font-semibold text-white">{post.replyCount || 0}</span>
                   </div>
                   <span className="text-xs text-slate-400 font-semibold uppercase tracking-wider sm:hidden">Replies</span>
                </div>
              </div>
            </Link>
          ))
        )}
      </div>
    </div>
  );
};

export default Forum;
