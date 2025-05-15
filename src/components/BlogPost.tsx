import React from 'react';
import { motion } from 'framer-motion';
import { Clock, User, Tag } from 'lucide-react';

interface BlogPostProps {
  title: string;
  excerpt: string;
  content: string;
  author: string;
  date: string;
  tags: string[];
  featuredImage: string;
  readTime: number;
}

const BlogPost: React.FC<BlogPostProps> = ({
  title,
  excerpt,
  content,
  author,
  date,
  tags,
  featuredImage,
  readTime,
}) => {
  // Format the content with proper paragraph breaks
  const formattedContent = content.split('\\n\\n').map((paragraph, index) => (
    <p key={index} className="mb-6 text-gray-700 leading-relaxed">
      {paragraph}
    </p>
  ));
  
  return (
    <article className="max-w-4xl mx-auto bg-white rounded-xl shadow-md overflow-hidden">
      <div className="relative">
        <img
          src={featuredImage}
          alt={title}
          className="w-full h-64 object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
        <div className="absolute bottom-0 left-0 p-6">
          <h1 className="text-3xl font-bold text-white mb-2">{title}</h1>
          <div className="flex flex-wrap items-center text-sm text-white/80 gap-4">
            <div className="flex items-center">
              <User className="h-4 w-4 mr-1" />
              <span>{author}</span>
            </div>
            <div className="flex items-center">
              <Clock className="h-4 w-4 mr-1" />
              <span>{date} • {readTime} min read</span>
            </div>
          </div>
        </div>
      </div>
      
      <div className="p-8">
        <div className="flex flex-wrap gap-2 mb-6">
          {tags.map((tag, index) => (
            <span 
              key={index}
              className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-indigo-100 text-indigo-800"
            >
              <Tag className="h-3 w-3 mr-1" />
              {tag}
            </span>
          ))}
        </div>
        
        <p className="text-xl text-gray-800 font-medium mb-6 leading-relaxed">
          {excerpt}
        </p>
        
        <div className="prose max-w-none">
          {formattedContent}
        </div>
        
        <div className="mt-10 pt-6 border-t border-gray-200">
          <h3 className="text-xl font-semibold mb-4">Share this article:</h3>
          <div className="flex space-x-4">
            <motion.a
              whileHover={{ y: -2 }}
              href="#"
              className="bg-blue-600 text-white p-2 rounded-full"
              aria-label="Share on Facebook"
            >
              <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M22.675 0h-21.35c-.732 0-1.325.593-1.325 1.325v21.351c0 .731.593 1.324 1.325 1.324h11.495v-9.294h-3.128v-3.622h3.128v-2.671c0-3.1 1.893-4.788 4.659-4.788 1.325 0 2.463.099 2.795.143v3.24l-1.918.001c-1.504 0-1.795.715-1.795 1.763v2.313h3.587l-.467 3.622h-3.12v9.293h6.116c.73 0 1.323-.593 1.323-1.325v-21.35c0-.732-.593-1.325-1.325-1.325z" />
              </svg>
            </motion.a>
            <motion.a
              whileHover={{ y: -2 }}
              href="#"
              className="bg-blue-400 text-white p-2 rounded-full"
              aria-label="Share on Twitter"
            >
              <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723 10.054 10.054 0 01-3.127 1.195 4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.937 4.937 0 004.604 3.417 9.868 9.868 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.054 0 13.999-7.496 13.999-13.986 0-.209 0-.42-.015-.63a9.936 9.936 0 002.46-2.548l-.047-.02z" />
              </svg>
            </motion.a>
            <motion.a
              whileHover={{ y: -2 }}
              href="#"
              className="bg-blue-800 text-white p-2 rounded-full"
              aria-label="Share on LinkedIn"
            >
              <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
              </svg>
            </motion.a>
          </div>
        </div>
      </div>
    </article>
  );
};

export default BlogPost; 