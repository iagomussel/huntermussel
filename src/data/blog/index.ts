import { BlogPost } from '../../types/blog';
import whiteLabelDentalSoftware from './white-label-dental-software';
import dentalPracticeManagement from './dental-practice-management';
import dentalSoftwareFeatures from './dental-software-features';
import roiOdontomaster from './roi-odontomaster';
import cloudVsOnpremises from './cloud-vs-onpremises';
import hipaaCompliance from './hipaa-compliance';
import dentalSystemCaseStudy from './dental-system-case-study';
import ecommerceCaseStudy from './ecommerce-case-study';
import aiInDentalClinics from './ai-in-dental-clinics';

// Combine all blog posts
const blogPosts: BlogPost[] = [
  whiteLabelDentalSoftware,
  dentalPracticeManagement,
  dentalSoftwareFeatures,
  roiOdontomaster,
  cloudVsOnpremises,
  hipaaCompliance,
  dentalSystemCaseStudy,
  ecommerceCaseStudy,
  aiInDentalClinics
];

// Get blog post by slug
export const getBlogPostBySlug = (slug: string): BlogPost | null => {
  return blogPosts.find(post => post.slug === slug) || null;
};

// Get related posts
export const getRelatedPosts = (currentSlug: string, tags: string[], limit: number = 2): BlogPost[] => {
  // Filter out the current post and find posts with matching tags
  return blogPosts
    .filter(post => post.slug !== currentSlug && post.tags.some((tag: string) => tags.includes(tag)))
    .slice(0, limit);
};

// Get all blog posts
export const getAllBlogPosts = (): BlogPost[] => {
  return [...blogPosts];
};

// Get blog posts by tag
export const getBlogPostsByTag = (tag: string): BlogPost[] => {
  return blogPosts.filter(post => post.tags.includes(tag));
};

// Search blog posts
export const searchBlogPosts = (query: string): BlogPost[] => {
  const searchTerm = query.toLowerCase();
  return blogPosts.filter(post => 
    post.title.toLowerCase().includes(searchTerm) || 
    post.excerpt.toLowerCase().includes(searchTerm) ||
    post.content.toLowerCase().includes(searchTerm)
  );
};

export default blogPosts; 