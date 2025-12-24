'use client';

import { useState } from 'react';
import { BlogCard } from './BlogCard';

/* 🔹 DB-ээс ирэх post type */
export interface BlogPost {
  id: number;
  image: string;
  category: string;
  title: string;
  excerpt: string;
  author: string;
  date: string;
  readTime: string;
}

interface BlogGridProps {
  posts: BlogPost[];
}

export function BlogGrid({ posts }: BlogGridProps) {
  const [selectedCategory, setSelectedCategory] = useState('Бүгд');

  const categories = ['Бүгд', 'Говь цөл', 'Уул', 'Хангай', 'Нуур'];

  const filteredPosts =
    selectedCategory === 'Бүгд'
      ? posts
      : posts.filter((post) => post.category === selectedCategory);

  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl mb-4">Сүүлийн үеийн түүхүүд</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Дэлхийн өнцөг булан бүрээс ирсэн аяллын түүхүүдийн цуглуулгыг
            судлаарай
          </p>
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap items-center justify-center gap-3 mb-12">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-6 py-2 rounded-full transition-colors ${
                selectedCategory === category
                  ? 'bg-blue-600 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-100'
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredPosts.map((post) => (
            <BlogCard
              key={post.id}
              id={post.id}
              image={post.image}
              category={post.category}
              title={post.title}
              excerpt={post.excerpt}
              author={post.author}
              date={new Date(post.date).toLocaleDateString('mn-MN')}
              readTime={post.readTime}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
