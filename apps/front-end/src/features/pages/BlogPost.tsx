'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  ArrowLeft,
  Bookmark,
  Calendar,
  Clock,
  Facebook,
  Heart,
  Link as LinkIcon,
  Twitter,
  User,
} from 'lucide-react';
import { useEffect, useState } from 'react';

interface BlogPostType {
  id: number;
  title: string;
  excerpt: string;
  content: string;
  category: string;
  image: string;
  createdAt: string;
  author: string;
  authorAvatar?: string;
  authorBio?: string;
  likeCount: number;
  likedByMe: boolean;
}

export function BlogPost({ postId }: { postId: number }) {
  const router = useRouter();

  const [post, setPost] = useState<BlogPostType | null>(null);
  const [loading, setLoading] = useState(true);

  const [isLiked, setIsLiked] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [likes, setLikes] = useState(0);

  useEffect(() => {
    setLoading(true);

    fetch(`http://localhost:3001/posts/${postId}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token') ?? ''}`,
      },
    })
      .then((res) => {
        if (!res.ok) throw new Error('Post not found');
        return res.json();
      })
      .then((data) => {
        setPost(data);
        setLikes(typeof data.likesCount === 'number' ? data.likesCount : 0);
        setIsLiked(Boolean(data.likedByMe));
      })
      .catch(() => setPost(null))
      .finally(() => setLoading(false));
  }, [postId]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Ачаалж байна...
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen flex items-center justify-center text-red-600">
        Нийтлэл олдсонгүй
      </div>
    );
  }

  const readTime = Math.max(1, Math.ceil(post.content.length / 1000));

  const handleLike = async () => {
    const res = await fetch(`http://localhost:3001/posts/${post.id}/like`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    });

    if (!res.ok) return;

    const data = await res.json();
    setIsLiked(data.liked);
    setLikes((prev) => (data.liked ? prev + 1 : prev - 1));
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Back Button */}
      <div className="bg-gray-50 border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-gray-600 hover:text-blue-600"
          >
            <ArrowLeft className="size-5" />
            <span>Буцах</span>
          </button>
        </div>
      </div>

      {/* Hero Image */}
      <div className="relative h-[500px] w-full">
        <img
          src={post.image}
          alt={post.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 -mt-32 relative z-10 mb-10">
        <article className="bg-white rounded-xl shadow-xl p-8 md:p-12">
          {/* Category */}
          <Link
            href={`/category/${categoryToSlug(post.category)}`}
            className="inline-block px-4 py-2 bg-blue-600 text-white rounded-full mb-4"
          >
            {post.category}
          </Link>

          {/* Title */}
          <h1 className="text-4xl mb-6">{post.title}</h1>

          {/* Meta */}
          <div className="flex flex-wrap items-center gap-6 mb-8 pb-8 border-b">
            <div className="flex items-center gap-2 text-gray-600">
              <User className="size-5" />
              <span>{post.author}</span>
            </div>

            <div className="flex items-center gap-2 text-gray-600">
              <Calendar className="size-5" />
              <span>
                {new Date(post.createdAt).toLocaleDateString('mn-MN')}
              </span>
            </div>

            <div className="flex items-center gap-2 text-gray-600">
              <Clock className="size-5" />
              <span>{readTime} мин унших</span>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-between mb-8 pb-8 border-b">
            <div className="flex items-center gap-4">
              <button
                onClick={handleLike}
                className={`flex items-center gap-2 px-4 py-2 rounded-full ${
                  isLiked
                    ? 'bg-red-50 text-red-600'
                    : 'bg-gray-100 text-gray-700'
                }`}
              >
                <Heart className={`size-5 ${isLiked ? 'fill-red-600' : ''}`} />
                <span>{Number.isFinite(likes) ? likes : 0}</span>
              </button>

              <button
                onClick={() => setIsSaved((v) => !v)}
                className={`p-2 rounded-full ${
                  isSaved
                    ? 'bg-blue-50 text-blue-600'
                    : 'bg-gray-100 text-gray-700'
                }`}
              >
                <Bookmark
                  className={`size-5 ${isSaved ? 'fill-blue-600' : ''}`}
                />
              </button>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-gray-600">Хуваалцах:</span>
              <Facebook className="size-5 text-gray-600" />
              <Twitter className="size-5 text-gray-600" />
              <LinkIcon className="size-5 text-gray-600" />
            </div>
          </div>

          {/* Article Content */}
          <div className="prose prose-lg max-w-none whitespace-pre-line">
            {post.content}
          </div>

          {/* Author */}
          <div className="mt-12 pt-8 border-t flex gap-4">
            <img
              src={post.authorAvatar || '/avatar.png'}
              alt={post.author}
              className="size-16 rounded-full object-cover"
            />
            <div>
              <h3 className="text-xl mb-1">{post.author}</h3>
              <p className="text-gray-600">
                {post.authorBio || 'Тухайн хэрэглэгч био оруулаагүй байна'}
              </p>
            </div>
          </div>
        </article>
      </div>
    </div>
  );
}

function categoryToSlug(category: string) {
  return category.toLowerCase();
}
