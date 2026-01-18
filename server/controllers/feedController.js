import Post from '../models/Post.js';

export const getFeed = async (limit = 10, cursor = null) => {
  let query = {};

  if (cursor) {
    try {
      const decodedCursor = Buffer.from(cursor, 'base64').toString('utf-8');
      const [dateStr, id] = decodedCursor.split('_');
      const date = new Date(dateStr);
      
      query = {
        $or: [
          { createdAt: { $lt: date } },
          { 
            createdAt: date,
            _id: { $lt: id }
          }
        ]
      };
    } catch (e) {
      console.error("Invalid cursor format", e);
    }
  }

  const posts = await Post.find(query)
    .sort({ createdAt: -1, _id: -1 }) 
    .limit(limit + 1)
    .lean();

  const hasNextPage = posts.length > limit;
  const items = hasNextPage ? posts.slice(0, limit) : posts;

  let nextCursor = null;
  if (hasNextPage) {
    const lastItem = items[items.length - 1];
    const rawCursor = `${lastItem.createdAt.toISOString()}_${lastItem._id}`;
    nextCursor = Buffer.from(rawCursor).toString('base64');
  }

  return { items, nextCursor };
};

export const createPost = async (data) => {
    return await Post.create(data);
}

export const deletePost = async (id) => {
    return await Post.findByIdAndDelete(id);
}
