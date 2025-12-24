import { Hero } from '../components/Hero';
import { BlogGrid } from '../components/BlogGrid';

interface BlogPost {
  id: number;
  image: string;
  category: string;
  title: string;
  excerpt: string;
  author: string;
  date: string;
  readTime: string;
}

async function getPosts(): Promise<BlogPost[]> {
  const res = await fetch('http://localhost:3001/posts', {
    cache: 'no-store',
  });

  if (!res.ok) {
    throw new Error('Failed to fetch posts');
  }

  return res.json();
}

export default async function HomePage() {
  const posts = await getPosts();

  if (posts.length === 0) {
    return (
      <div className="p-10 text-center text-gray-600">Нийтлэл олдсонгүй</div>
    );
  }

  const featuredPost = posts[0];

  return (
    <main>
      <Hero
        id={featuredPost.id}
        image={featuredPost.image}
        category={featuredPost.category}
        title={featuredPost.title}
        excerpt={featuredPost.excerpt}
        author={featuredPost.author}
        date={new Date(featuredPost.date).toLocaleDateString('mn-MN')}
        readTime={featuredPost.readTime}
      />

      <BlogGrid posts={posts} />
    </main>
  );
}
