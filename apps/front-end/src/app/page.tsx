import { Hero } from '../components/Hero';
import { BlogGrid } from '../components/BlogGrid';
import { blogPosts } from '../data/blogPosts';

export default function HomePage() {
  const featuredPost = blogPosts[0];

  return (
    <main>
      <Hero
        image={featuredPost.image}
        category={featuredPost.category}
        title={featuredPost.title}
        excerpt={featuredPost.excerpt}
        author={featuredPost.author}
        date={featuredPost.date}
        readTime={featuredPost.readTime}
      />
      <BlogGrid posts={blogPosts} />
    </main>
  );
}
