---
title: "How to build a backendless Blog"
date: "2026-02-09"
status: "published"
subtitle: ""
description: ""
tags: ""
image: "/images/blog/1770685010_image_3.webp"
---

## Introduction

## The Problem

Building a blog has always been a challenge. Traditional platforms like WordPress promised to make it easier, but they came with significant infrastructure costs and complexity. Now you can build a professional blog completely free if you have basic coding skills.

Building a blog no longer requires complex backend infrastructure. With modern tools like React and Cloudflare Pages, you can create a fast, infinitely scalable blog that costs almost nothing to run. In this tutorial, we'll walk through building a markdown-based blog using React and deploying it to Cloudflare Pages.

## Why Build Your Own?

Certainly, ready-made tools exist for this purpose: Hugo, Jekyll, and HydePHP, to name a few. I tested several of them, and they're excellent options. However, they weren't quite what I wanted, so I decided to build my own solution. The plan is straightforward: write in pure markdown, and let a React site read those files and render them using a custom theme, custom fonts, and even dynamic components if desired.

## What You'll Need

- Node.js installed on your machine
- A GitHub account
- A Cloudflare account (free tier works great)
- Basic knowledge of React and command line
- Your custom domain, only part non-free here

## Step 1: Set Up Your React Project

Create a new React project using Vite for faster development:

```bash
npm create vite@latest my-awesome-blog-name -- --template react
cd my-awesome-blog-name
npm install
```

Install the markdown rendering library:

```bash
npm install react-markdown gray-matter
```

## Step 2: Organize Your Blog Structure

Create a folder structure for your blog posts:

```
src/
├── components/
│   ├── BlogPost.jsx
│   ├── BlogList.jsx
│   └── Layout.jsx
├── posts/
│   ├── first-post.md
│   └── second-post.md
├── App.jsx
└── index.css
```

## Step 3: Create Your First Blog Post

Create a markdown file in the `posts` folder with frontmatter:

```markdown
---
title: "Fast Code, Weak Engineers"
date: "2026-01-09"
image: "/images/blog/1770673296_image_2.webp"
subtitle: "The Risk of Becoming an AI-Dependent Developer"
---

We are shipping faster than ever...
```

## Step 4: Parse Frontmatter and Markdown

Create a utility function to parse your markdown files:

```javascript
// src/utils/parseMarkdown.js
import matter from 'gray-matter';

export const parseMarkdown = (content) => {
  const { data, content: markdown } = matter(content);
  return {
    frontmatter: data,
    content: markdown,
  };
};
```

## Step 5: Build the Blog Post Component

Create a component to render individual blog posts:

```javascript
// src/components/BlogPost.jsx
import ReactMarkdown from 'react-markdown';
import { useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';

export default function BlogPost() {
  const { slug } = useParams();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    import(`../posts/${slug}.md?raw`)
      .then((module) => {
        const { parseMarkdown } = require('../utils/parseMarkdown');
        const parsed = parseMarkdown(module.default);
        setPost(parsed);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [slug]);

  if (loading) return <div>Loading...</div>;
  if (!post) return <div>Post not found</div>;

  return (
    <article className="blog-post">
      <header>
        <h1>{post.frontmatter.title}</h1>
        <time>{post.frontmatter.date}</time>
      </header>
      <ReactMarkdown>{post.content}</ReactMarkdown>
    </article>
  );
}
```

## Step 6: Create Blog Listing Page

```javascript
// src/components/BlogList.jsx
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

export default function BlogList() {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    const loadPosts = async () => {
      const postModules = import.meta.glob('../posts/*.md?raw', { eager: true });
      const postList = Object.entries(postModules).map(([path, module]) => {
        const slug = path.match(/\/([^/]+)\.md/)[1];
        const { parseMarkdown } = require('../utils/parseMarkdown');
        const { frontmatter } = parseMarkdown(module.default);
        return { slug, ...frontmatter };
      });
      setPosts(postList);
    };
    loadPosts();
  }, []);

  return (
    <section className="blog-list">
      <h1>Blog Posts</h1>
      {posts.map((post) => (
        <article key={post.slug} className="post-preview">
          <Link to={`/post/${post.slug}`}>
            <h2>{post.title}</h2>
          </Link>
          <p>{post.description}</p>
          <time>{post.date}</time>
          {post.tags && <div className="tags">{post.tags}</div>}
        </article>
      ))}
    </section>
  );
}
```

## Step 7: Set Up Routing

Install React Router:

```bash
npm install react-router-dom
```

Update your App.jsx:

```javascript
// src/App.jsx
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import BlogList from './components/BlogList';
import BlogPost from './components/BlogPost';
import Layout from './components/Layout';

function App() {
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<BlogList />} />
          <Route path="/post/:slug" element={<BlogPost />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}

export default App;
```

## Step 8: Deploy to Cloudflare Pages

1. Push your code to a GitHub repository
2. Log into your Cloudflare dashboard
3. Navigate to Pages and select "Create a project"
4. Connect your GitHub repository
5. Set build command: `npm run build`
6. Set build output directory: `dist`
7. Click "Save and Deploy"

Cloudflare will automatically deploy your site whenever you push to your repository.

## Step 9: Add Custom Domain (Optional)

In Cloudflare Pages settings, add your custom domain for free using Cloudflare's DNS.

## Step 10: Optimize Performance

Add static site generation for even better performance:

```bash
npm install @vitejs/plugin-react
```

Configure your Vite config to optimize for static generation. Cloudflare Pages will cache your static files globally.

## Best Practices

- Keep markdown files organized by year or category
- Use meaningful slugs in filenames
- Add meta tags to frontmatter for SEO
- Implement syntax highlighting with `react-syntax-highlighter`
- Cache posts in state to improve navigation speed
- Add a search feature using a lightweight solution like `minisearch`

## Conclusion

You now have a fully functional, fast, and free blog running on React and Cloudflare Pages. No backend, no database, no monthly fees. Just pure static content served globally at the edge. Your blog will load in milliseconds anywhere in the world, and you can update it by simply pushing to GitHub.