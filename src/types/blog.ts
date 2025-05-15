export interface BlogPost {
  id: number;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  featuredImage: string;
  author: string;
  date: string;
  tags: string[];
  readTime: number;
  authorBio?: string;
  authorImage?: string;
} 