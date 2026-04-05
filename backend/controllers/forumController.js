import ForumPost from '../models/ForumPost.js';
import ForumReply from '../models/ForumReply.js';

// @desc    Get all forum posts
// @route   GET /api/forum
// @access  Private
export const getPosts = async (req, res) => {
  try {
    const posts = await ForumPost.find()
      .populate('author', 'name _id')
      .sort({ createdAt: -1 });

    const postsWithReplyCount = await Promise.all(
      posts.map(async (post) => {
        const count = await ForumReply.countDocuments({ post: post._id });
        return { ...post._doc, replyCount: count };
      })
    );

    res.json({ success: true, data: postsWithReplyCount });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Create a new formulation post
// @route   POST /api/forum
// @access  Private
export const createPost = async (req, res) => {
  try {
    const { title, content, tags } = req.body;

    if (!title || !content) {
      return res.status(400).json({ success: false, message: 'Title and content are required' });
    }

    const post = await ForumPost.create({
      title,
      content,
      tags: tags || [],
      author: req.user._id,
    });

    const populatedPost = await ForumPost.findById(post._id).populate('author', 'name _id');

    const io = req.app.get('io');
    if (io) {
      io.emit('new_discussion', { ...populatedPost._doc, replyCount: 0 });
    }

    res.status(201).json({ success: true, data: populatedPost });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get post by ID with replies
// @route   GET /api/forum/:id
// @access  Private
export const getPostById = async (req, res) => {
  try {
    const post = await ForumPost.findById(req.params.id).populate('author', 'name _id');

    if (!post) {
      return res.status(404).json({ success: false, message: 'Post not found' });
    }

    const replies = await ForumReply.find({ post: req.params.id })
      .populate('author', 'name _id')
      .sort({ createdAt: 1 });

    res.json({ success: true, data: { post, replies } });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Add a reply to a post
// @route   POST /api/forum/:id/reply
// @access  Private
export const addReply = async (req, res) => {
  try {
    const { content } = req.body;

    if (!content) {
      return res.status(400).json({ success: false, message: 'Reply content is required' });
    }

    const post = await ForumPost.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ success: false, message: 'Post not found' });
    }

    if (post.isResolved) {
      return res.status(400).json({ success: false, message: 'Discussion is marked as solved and cannot accept new replies.' });
    }

    const reply = await ForumReply.create({
      post: req.params.id,
      content,
      author: req.user._id,
    });

    const populatedReply = await ForumReply.findById(reply._id).populate('author', 'name _id');

    const io = req.app.get('io');
    if (io) {
      io.emit('new_reply', { discussionId: req.params.id, reply: populatedReply });
    }

    res.status(201).json({ success: true, data: populatedReply });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Mark post as resolved
// @route   PUT /api/forum/:id/resolve
// @access  Private
export const resolvePost = async (req, res) => {
  try {
    const post = await ForumPost.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ success: false, message: 'Post not found' });
    }

    if (post.author.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Not authorized to resolve this discussion' });
    }

    post.isResolved = true;
    await post.save();

    const io = req.app.get('io');
    if (io) {
      io.emit('discussion_resolved', { discussionId: post._id });
    }

    res.json({ success: true, message: 'Discussion marked as solved' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
