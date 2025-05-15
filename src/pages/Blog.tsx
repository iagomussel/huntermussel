import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Clock, User, Search,  ArrowRight, Mail as MailIcon } from 'lucide-react';
import { getAllBlogPosts } from '../data/blogData';

// Carregando posts do blog a partir dos dados reais
const blogPosts = getAllBlogPosts();

const Blog = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTag, setSelectedTag] = useState<string | null>(null);

  // Get all unique tags
  const allTags = Array.from(
    new Set(blogPosts.flatMap(post => post.tags))
  );

  // Filter posts based on search and selected tag
  const filteredPosts = blogPosts.filter(post => {
    const matchesSearch = post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         post.excerpt.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesTag = selectedTag ? post.tags.includes(selectedTag) : true;
    return matchesSearch && matchesTag;
  });

  return (
    <div className="bg-gray-50 min-h-screen pt-24 pb-16">
      <Helmet>
        <title>Dental Software Blog | OdontoMaster</title>
        <meta 
          name="description" 
          content="Read expert articles about dental practice management, white-label software solutions, and modern dental technology. Get insights to improve your dental business."
        />
        <meta name="keywords" content="dental software blog, practice management, white-label solutions, OdontoMaster, dental technology" />
        <link rel="canonical" href="https://odontomaster.com/blog" />
        
        {/* Schema markup for blog */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Blog",
            "name": "OdontoMaster Dental Software Blog",
            "description": "Expert articles about dental practice management and white-label software solutions",
            "url": "https://odontomaster.com/blog",
            "publisher": {
              "@type": "Organization",
              "name": "OdontoMaster",
              "logo": {
                "@type": "ImageObject",
                "url": "https://odontomaster.com/assets/images/logo.svg"
              }
            }
          })}
        </script>
      </Helmet>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Dental Practice Management Blog
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Expert insights, tips, and resources for dental professionals and software providers
          </p>
        </div>
        
        {/* Search and filter section */}
        <div className="mb-12">
          <div className="flex flex-col md:flex-row justify-between gap-6">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search articles..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-3 w-full md:w-80 rounded-lg border-gray-300 border focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
            
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setSelectedTag(null)}
                className={`px-4 py-2 rounded-full text-sm ${
                  selectedTag === null 
                    ? 'bg-indigo-600 text-white' 
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                All
              </button>
              
              {allTags.map((tag, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedTag(tag)}
                  className={`px-4 py-2 rounded-full text-sm ${
                    selectedTag === tag 
                      ? 'bg-indigo-600 text-white' 
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>
        </div>
        
        {/* Blog post grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredPosts.map((post, index) => (
            <motion.div
              key={post.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow"
            >
              <div className="relative">
                <img 
                  src={post.featuredImage}
                  alt={post.title}
                  className="w-full h-48 object-cover"
                />
                <div className="absolute top-3 right-3">
                  <span className="bg-indigo-100 text-indigo-800 text-xs px-3 py-1 rounded-full">
                    {post.tags[0]}
                  </span>
                </div>
              </div>
              
              <div className="p-6">
                <div className="flex items-center text-sm text-gray-500 mb-4">
                  <User className="h-4 w-4 mr-1" />
                  <span className="mr-3">{post.author}</span>
                  <Clock className="h-4 w-4 mr-1" />
                  <span>{post.date} • {post.readTime} min read</span>
                </div>
                
                <h2 className="text-xl font-bold text-gray-900 mb-3">
                  {post.title}
                </h2>
                
                <p className="text-gray-600 mb-4 line-clamp-3">
                  {post.excerpt}
                </p>
                
                <Link
                  to={`/blog/${post.slug}`}
                  className="inline-flex items-center text-indigo-600 hover:text-indigo-800"
                >
                  Read more
                  <ArrowRight className="h-4 w-4 ml-1" />
                </Link>
              </div>
            </motion.div>
          ))}
        </div>
        
        {filteredPosts.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-600 text-lg">
              No articles found matching your search criteria.
            </p>
            <button
              onClick={() => {
                setSearchTerm('');
                setSelectedTag(null);
              }}
              className="mt-4 bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700"
            >
              Reset filters
            </button>
          </div>
        )}
        
        {/* Newsletter subscription */}
        <div className="mt-16 bg-indigo-600 rounded-lg p-8 text-white">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-2xl font-bold mb-4">
              Subscribe to Our Dental Industry Newsletter
            </h2>
            <p className="mb-6">
              Get the latest insights on dental practice management, software trends, and exclusive OdontoMaster updates.
            </p>
            <form className="flex flex-col sm:flex-row gap-3">
              <div className="relative sm:max-w-xl sm:mx-auto">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <MailIcon className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="email"
                  required
                  className="block w-full rounded-l-lg pl-10 pr-3 py-3 border-0 text-gray-900 placeholder-gray-500 focus:ring-indigo-500"
                  placeholder="Your email address"
                />
                <button
                  type="submit"
                  className="rounded-r-lg px-5 py-3 bg-indigo-600 text-white font-medium hover:bg-indigo-700"
                >
                  Subscribe
                </button>
              </div>
            </form>
            <p className="mt-3 text-sm text-indigo-200">
              We respect your privacy. Unsubscribe at any time.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Blog; 