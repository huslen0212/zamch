'use client';

import Link from 'next/link';
import {
  Search,
  SlidersHorizontal,
  Grid3x3,
  List,
  Calendar,
  User,
  Clock,
} from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';

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

export function AllBlogs() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Бүгд');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [sortBy, setSortBy] = useState<'newest' | 'oldest' | 'popular'>(
    'newest',
  );

  const categories = ['Бүгд', 'Говь цөл', 'Уул', 'Хангай', 'Нуур'];

  /* =========================
     FETCH POSTS FROM DB
  ========================= */
  useEffect(() => {
    fetch('http://localhost:3001/posts')
      .then((res) => {
        if (!res.ok) throw new Error('Failed to fetch posts');
        return res.json();
      })
      .then((data) => setPosts(data))
      .catch(() => setPosts([]))
      .finally(() => setLoading(false));
  }, []);

  const filteredBlogs = useMemo(() => {
    let list = posts.filter((post) => {
      const matchesSearch =
        post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        post.excerpt.toLowerCase().includes(searchTerm.toLowerCase()) ||
        post.author.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesCategory =
        selectedCategory === 'Бүгд' || post.category === selectedCategory;

      return matchesSearch && matchesCategory;
    });

    if (sortBy === 'oldest') {
      list = [...list].reverse();
    }

    return list;
  }, [posts, searchTerm, selectedCategory, sortBy]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Ачаалж байна...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero */}
      <section className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl mb-4">Бүх нийтлэлүүд</h1>
          <p className="text-xl text-blue-100 max-w-2xl mx-auto">
            Аялалын гайхалтай түүх, зөвлөмжүүд
          </p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 py-12">
        {/* Search + Filters */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search */}
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 size-5 text-gray-400" />
              <input
                type="text"
                placeholder="Нийтлэл хайх..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl"
              />
            </div>

            {/* Sort */}
            <div className="flex items-center gap-2">
              <SlidersHorizontal className="size-5 text-gray-400" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="px-4 py-3 border border-gray-300 rounded-xl"
              >
                <option value="newest">Шинээс хуучин</option>
                <option value="oldest">Хуучнаас шинэ</option>
              </select>
            </div>

            {/* View */}
            <div className="flex bg-gray-100 rounded-xl p-1">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded-lg ${
                  viewMode === 'grid' && 'bg-white shadow'
                }`}
              >
                <Grid3x3 className="size-5" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded-lg ${
                  viewMode === 'list' && 'bg-white shadow'
                }`}
              >
                <List className="size-5" />
              </button>
            </div>
          </div>

          {/* Categories */}
          <div className="flex flex-wrap gap-2 mt-6">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-full ${
                  selectedCategory === cat
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Results */}
        <div className="mb-6 text-gray-600">
          <span className="text-2xl text-gray-900">{filteredBlogs.length}</span>{' '}
          нийтлэл олдлоо
        </div>

        {/* Grid */}
        {viewMode === 'grid' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredBlogs.map((post) => (
              <Link
                key={post.id}
                href={`/blog/${post.id}`}
                className="bg-white rounded-xl shadow-md hover:shadow-xl"
              >
                <img
                  src={post.image}
                  className="aspect-[16/10] object-cover w-full"
                />
                <div className="p-6">
                  <span className="text-blue-600 text-sm">{post.category}</span>
                  <h2 className="text-xl mt-2">{post.title}</h2>
                  <p className="text-gray-600 mt-2">{post.excerpt}</p>
                  <div className="flex gap-4 text-sm text-gray-500 mt-4">
                    <User className="size-4" /> {post.author}
                    <Clock className="size-4" /> {post.readTime}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
