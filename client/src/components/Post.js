import React from "react";
import { formatISO9075 } from "date-fns";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

export default function Post({ _id, title, summary, cover, createdAt, author }) {
  return (
    <motion.article 
      whileHover={{ scale: 1.03 }}
      className="bg-white rounded-lg shadow-lg overflow-hidden transition-all duration-300 hover:shadow-xl"
    >
      <Link to={`/post/${_id}`}>
        <img 
          src={`http://localhost:4000/${cover}`}
          alt={title}
          className="w-full h-48 object-cover transition-transform duration-300 transform hover:scale-105"
        />
      </Link>
      <div className="p-6">
        <Link to={`/post/${_id}`}>
          <h2 className="text-2xl font-serif font-bold text-primary-800 mb-2 hover:text-primary-600 transition-colors duration-300">{title}</h2>
        </Link>
        <div className="flex items-center text-sm text-gray-500 mb-4">
          <span className="font-medium text-secondary-600">{author.username}</span>
          <span className="mx-2">•</span>
          <time>{formatISO9075(new Date(createdAt))}</time>
        </div>
        <p className="text-gray-600 mb-4 line-clamp-3">{summary}</p>
        <Link 
          to={`/post/${_id}`}
          className="inline-block bg-primary-500 hover:bg-primary-600 text-white py-2 px-4 rounded-full transition-colors duration-300"
        >
          Read More
        </Link>
      </div>
    </motion.article>
  );
}