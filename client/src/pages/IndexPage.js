import React, { useEffect, useState, useContext } from "react";
import Post from "../components/Post";
import { UserContext } from "../UserContext";
import { motion } from "framer-motion";

export default function IndexPage() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { userInfo } = useContext(UserContext);

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const response = await fetch('http://localhost:4000/post');
      if (!response.ok) {
        throw new Error('Failed to fetch posts');
      }
      const data = await response.json();
      setPosts(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const deleteAllPosts = async () => {
    if (window.confirm('Are you sure you want to delete all posts? This action cannot be undone.')) {
      try {
        const response = await fetch('http://localhost:4000/posts', {
          method: 'DELETE',
          credentials: 'include',
        });
        if (response.ok) {
          setPosts([]);
          alert('All posts have been deleted successfully.');
        } else {
          throw new Error('Failed to delete posts');
        }
      } catch (err) {
        setError(err.message);
      }
    }
  };

  if (loading) return (
    <div className="flex justify-center items-center h-screen">
      <div className="animate-spin rounded-full h-32 w-32 border-t-4 border-b-4 border-primary-500"></div>
    </div>
  );
  
  if (error) return (
    <div className="flex items-center justify-center h-screen">
      <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded-lg shadow-lg" role="alert">
        <p className="font-bold">Error</p>
        <p>{error}</p>
      </div>
    </div>
  );

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen bg-gradient-to-br from-primary-50 to-secondary-50 py-12 px-4 sm:px-6 lg:px-8"
    >
      <div className="max-w-7xl mx-auto">
        <motion.h1 
          initial={{ y: -50 }}
          animate={{ y: 0 }}
          transition={{ type: "spring", stiffness: 100 }}
          className="text-5xl font-serif font-bold text-primary-800 mb-12 text-center"
        >
          Latest Posts
        </motion.h1>
        
        {userInfo && userInfo.username === 'admin' && (
          <motion.div 
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 200, delay: 0.2 }}
            className="mb-12 text-center"
          >
            <button
              onClick={deleteAllPosts}
              className="bg-red-500 hover:bg-red-700 text-white font-bold py-3 px-6 rounded-full transition duration-300 ease-in-out transform hover:scale-105 hover:shadow-lg"
            >
              Delete All Posts
            </button>
          </motion.div>
        )}

        {posts.length > 0 ? (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {posts.map((post, index) => (
              <motion.div
                key={post._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Post {...post} />
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="text-center text-2xl text-gray-600 mt-12"
          >
            No posts available. Be the first to create one!
          </motion.p>
        )}
      </div>
    </motion.div>
  );
}