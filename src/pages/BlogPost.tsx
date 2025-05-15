import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { useParams, Link } from 'react-router-dom';
import { Clock, User, Tag, ArrowLeft, ChevronRight, Mail } from 'lucide-react';
import { BlogPost as BlogPostType } from '../types/blog';

// Importando os dados reais de blog posts
import { getBlogPostBySlug, getRelatedPosts } from '../data';

const BlogPost = () => {
  const params = useParams();
  const slug = params.slug || '';
  const [post, setPost] = useState<BlogPostType | null>(null);
  const [relatedPosts, setRelatedPosts] = useState<BlogPostType[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Carregar o post de blog e posts relacionados quando o componente montar ou o slug mudar
    if (slug) {
      const currentPost = getBlogPostBySlug(slug);
      if (currentPost) {
        setPost(currentPost);
        setRelatedPosts(getRelatedPosts(slug, currentPost.tags));
      }
    }
    setLoading(false);
  }, [slug]);

  if (loading) {
    return <div className="py-16 text-center">Loading...</div>;
  }

  if (!post) {
    return (
      <div className="py-16 text-center">
        <h1 className="text-2xl font-bold text-gray-800 mb-4">Post not found</h1>
        <p className="text-gray-600 mb-6">The blog post you're looking for doesn't exist or has been removed.</p>
        <Link to="/blog" className="inline-flex items-center text-indigo-600 hover:text-indigo-800">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Blog
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen pt-24 pb-16">
      <Helmet>
        <title>{post.title} | Huntermussel Blog</title>
        <meta 
          name="description" 
          content={post.excerpt}
        />
        <meta name="keywords" content={post.tags.join(', ') + ', OdontoMaster, dental software'} />
        <link rel="canonical" href={`https://huntermussel.com/blog/${post.slug}`} />
        
        {/* Open Graph / Social Media Meta Tags */}
        <meta property="og:type" content="article" />
        <meta property="og:title" content={post.title} />
        <meta property="og:description" content={post.excerpt} />
        <meta property="og:image" content={post.featuredImage} />
        <meta property="og:url" content={`https://huntermussel.com/blog/${post.slug}`} />
        <meta property="article:published_time" content={post.date} />
        
        {/* Structured Data */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BlogPosting",
            "headline": post.title,
            "image": post.featuredImage,
            "datePublished": post.date,
            "dateModified": post.date,
            "author": {
              "@type": "Person",
              "name": post.author
            },
            "publisher": {
              "@type": "Organization",
              "name": "OdontoMaster",
              "logo": {
                "@type": "ImageObject",
                "url": "https://odontomaster.com/assets/images/logo.svg"
              }
            },
            "description": post.excerpt
          })}
        </script>
      </Helmet>
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumbs */}
        <nav className="flex items-center text-sm text-gray-500 mb-6">
          <Link to="/" className="hover:text-indigo-600">Home</Link>
          <ChevronRight className="h-4 w-4 mx-2" />
          <Link to="/blog" className="hover:text-indigo-600">Blog</Link>
          <ChevronRight className="h-4 w-4 mx-2" />
          <span className="text-gray-700">{post.title}</span>
        </nav>
        
        {/* Featured Image */}
        <img 
          src={post.featuredImage}
          alt={post.title}
          className="w-full h-[400px] object-cover rounded-lg shadow-md mb-8"
        />
        
        {/* Post Header */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            {post.title}
          </h1>
          
          <div className="flex flex-wrap items-center text-sm text-gray-500 gap-4">
            <div className="flex items-center">
              <User className="h-4 w-4 mr-2" />
              <span>{post.author}</span>
            </div>
            <div className="flex items-center">
              <Clock className="h-4 w-4 mr-2" />
              <span>{post.date} • {post.readTime} min read</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {post.tags.map((tag, index) => (
                <Link 
                  key={index} 
                  to={`/blog?tag=${tag}`}
                  className="bg-indigo-100 text-indigo-800 text-xs px-3 py-1 rounded-full hover:bg-indigo-200"
                >
                  <Tag className="h-3 w-3 inline mr-1" />
                  {tag}
                </Link>
              ))}
            </div>
          </div>
        </div>
        
        {/* Post Content */}
        <div className="bg-white rounded-lg shadow-md p-6 md:p-8 mb-12">
          <div 
            className="prose prose-lg max-w-none prose-indigo prose-headings:text-gray-900 prose-a:text-indigo-600"
            dangerouslySetInnerHTML={{ __html: post.content }}
          />
        </div>
        
        {/* Author Bio */}
        {post.authorBio && (
          <div className="bg-indigo-50 rounded-lg p-6 mb-12">
            <h2 className="text-xl font-semibold mb-4">About the Author</h2>
            <div className="flex items-start">
              {post.authorImage && (
                <img 
                  src={post.authorImage} 
                  alt={post.author}
                  className="w-16 h-16 rounded-full mr-4 object-cover"
                />
              )}
              <div>
                <h3 className="font-semibold text-lg">{post.author}</h3>
                <p className="text-gray-600">{post.authorBio}</p>
              </div>
            </div>
          </div>
        )}
        
        {/* Related Posts */}
        {relatedPosts.length > 0 && (
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Related Articles</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {relatedPosts.map((relatedPost) => (
                <Link 
                  key={relatedPost.id}
                  to={`/blog/${relatedPost.slug}`}
                  className="flex bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
                >
                  <img 
                    src={relatedPost.featuredImage}
                    alt={relatedPost.title}
                    className="w-24 h-24 object-cover"
                  />
                  <div className="p-4">
                    <h3 className="font-semibold text-gray-900 mb-1 line-clamp-2">
                      {relatedPost.title}
                    </h3>
                    <div className="text-sm text-gray-500">
                      {relatedPost.readTime} min read
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
        
        {/* Subscribe Section */}
        <div className="bg-indigo-600 rounded-lg p-8 text-white">
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-4">
              Subscribe to Our Newsletter
            </h2>
            <p className="mb-6 text-indigo-100">
              Get the latest insights and updates on dental practice management and technology.
            </p>
            <div className="relative sm:max-w-xl sm:mx-auto">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <Mail className="h-5 w-5 text-gray-400" />
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
          </div>
        </div>
        
        {/* Back to Blog */}
        <div className="mt-12 text-center">
          <Link
            to="/blog"
            className="inline-flex items-center text-indigo-600 hover:text-indigo-800"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Blog
          </Link>
        </div>
      </div>
    </div>
  );
};

export default BlogPost; 