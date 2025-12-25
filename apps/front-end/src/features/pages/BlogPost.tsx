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
  Link2,
  Twitter,
  User,
  MapPin,
  Share2,
  MessageCircle,
  Eye,
  Loader2,
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
  authorId?: number;
  authorAvatar?: string;
  authorBio?: string;
  likeCount: number;
  likedByMe: boolean;
  location?: {
    name: string;
    lat?: number;
    lng?: number;
  };
  viewCount?: number;
  commentCount?: number;
}

export function BlogPost({ postId }: { postId: number }) {
  const router = useRouter();

  const [post, setPost] = useState<BlogPostType | null>(null);
  const [loading, setLoading] = useState(true);
  const [shareMenuOpen, setShareMenuOpen] = useState(false);

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
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-gray-50 to-blue-50">
        <Loader2 className="size-12 text-blue-600 animate-spin mb-4" />
        <p className="text-gray-600 text-lg">Нийтлэл ачааллаж байна...</p>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-gray-50 to-red-50 px-4">
        <div className="text-center max-w-md">
          <div className="size-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <ArrowLeft className="size-10 text-red-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Нийтлэл олдсонгүй</h2>
          <p className="text-gray-600 mb-6">Уучлаарай, энэ нийтлэл олдсонгүй эсвэл устгагдсан байна</p>
          <button
            onClick={() => router.back()}
            className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all font-medium shadow-lg"
          >
            Буцах
          </button>
        </div>
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

  const handleShare = (platform: string) => {
    const url = window.location.href;
    const text = `${post.title} - ${post.excerpt}`;

    const shareUrls: { [key: string]: string } = {
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
      twitter: `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(text)}`,
      copy: url,
    };

    if (platform === 'copy') {
      navigator.clipboard.writeText(url);
      alert('Холбоос хуулагдлаа!');
    } else {
      window.open(shareUrls[platform], '_blank', 'width=600,height=400');
    }
    setShareMenuOpen(false);
  };

  const goToAuthorProfile = () => {
    if (post.authorId) {
      router.push(`/profile/${post.authorId}`);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      {/* Header with Back Button */}
      <div className="bg-white/80 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-40 shadow-sm">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <button
              onClick={() => router.back()}
              className="flex items-center gap-2 text-gray-600 hover:text-blue-600 transition-colors font-medium"
            >
              <ArrowLeft className="size-5" />
              <span className="hidden sm:inline">Буцах</span>
            </button>

            <div className="flex items-center gap-3">
              <button
                onClick={handleLike}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-full transition-all ${
                  isLiked
                    ? 'bg-red-50 text-red-600 border-2 border-red-200'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <Heart className={`size-4 ${isLiked ? 'fill-red-600' : ''}`} />
                <span className="text-sm font-medium">{likes}</span>
              </button>

              <div className="relative">
                <button
                  onClick={() => setShareMenuOpen(!shareMenuOpen)}
                  className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
                >
                  <Share2 className="size-4 text-gray-700" />
                </button>

                {shareMenuOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden z-50">
                    <button
                      onClick={() => handleShare('facebook')}
                      className="w-full px-4 py-3 text-left hover:bg-gray-50 flex items-center gap-3 transition-colors"
                    >
                      <Facebook className="size-5 text-blue-600" />
                      <span className="text-sm">Facebook</span>
                    </button>
                    <button
                      onClick={() => handleShare('twitter')}
                      className="w-full px-4 py-3 text-left hover:bg-gray-50 flex items-center gap-3 transition-colors"
                    >
                      <Twitter className="size-5 text-sky-500" />
                      <span className="text-sm">Twitter</span>
                    </button>
                    <button
                      onClick={() => handleShare('copy')}
                      className="w-full px-4 py-3 text-left hover:bg-gray-50 flex items-center gap-3 transition-colors"
                    >
                      <Link2 className="size-5 text-gray-600" />
                      <span className="text-sm">Холбоос хуулах</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Hero Image */}
      <div className="relative h-64 sm:h-80 lg:h-[500px] w-full overflow-hidden">
        <img
          src={post.image}
          alt={post.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />

        {/* Category Badge */}
        <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-6 lg:p-8">
          <div className="max-w-5xl mx-auto">
            <Link
              href={`/category/${categoryToSlug(post.category)}`}
              className="inline-block px-4 py-2 bg-white/20 backdrop-blur-sm text-white rounded-full mb-3 text-sm font-medium hover:bg-white/30 transition-all"
            >
              {post.category}
            </Link>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 -mt-12 sm:-mt-16 lg:-mt-24 relative z-10 pb-12">
        <article className="bg-white rounded-2xl shadow-2xl overflow-hidden">
          <div className="p-6 sm:p-8 lg:p-12">
            {/* Title */}
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-6 leading-tight">
              {post.title}
            </h1>

            {/* Meta Info */}
            <div className="flex flex-wrap items-center gap-4 sm:gap-6 mb-8 pb-6 border-b-2 border-gray-100">
              <div className="flex items-center gap-2 text-gray-600">
                <Calendar className="size-5 text-blue-600" />
                <span className="text-sm">
                  {new Date(post.createdAt).toLocaleDateString('mn-MN', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </span>
              </div>

              <div className="flex items-center gap-2 text-gray-600">
                <Clock className="size-5 text-green-600" />
                <span className="text-sm">{readTime} мин унших</span>
              </div>

              {post.location?.name && (
                <div className="flex items-center gap-2 text-gray-600">
                  <MapPin className="size-5 text-red-600" />
                  <span className="text-sm">{post.location.name}</span>
                </div>
              )}

              {post.viewCount !== undefined && (
                <div className="flex items-center gap-2 text-gray-600">
                  <Eye className="size-5 text-purple-600" />
                  <span className="text-sm">{post.viewCount}</span>
                </div>
              )}

              {post.commentCount !== undefined && (
                <div className="flex items-center gap-2 text-gray-600">
                  <MessageCircle className="size-5 text-orange-600" />
                  <span className="text-sm">{post.commentCount}</span>
                </div>
              )}
            </div>

            {/* Excerpt */}
            <div className="bg-blue-50 border-l-4 border-blue-600 p-4 sm:p-6 mb-8 rounded-r-lg">
              <p className="text-gray-700 text-base sm:text-lg leading-relaxed italic">
                {post.excerpt}
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8 pb-8 border-b-2 border-gray-100">
              <div className="flex items-center gap-3 flex-wrap">
                <button
                  onClick={handleLike}
                  className={`flex items-center gap-2 px-5 py-2.5 rounded-full transition-all font-medium ${
                    isLiked
                      ? 'bg-red-50 text-red-600 border-2 border-red-200 shadow-sm'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200 border-2 border-transparent'
                  }`}
                >
                  <Heart className={`size-5 ${isLiked ? 'fill-red-600' : ''}`} />
                  <span>{likes} таалагдсан</span>
                </button>

                <button
                  onClick={() => setIsSaved((v) => !v)}
                  className={`flex items-center gap-2 px-5 py-2.5 rounded-full transition-all font-medium ${
                    isSaved
                      ? 'bg-blue-50 text-blue-600 border-2 border-blue-200 shadow-sm'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200 border-2 border-transparent'
                  }`}
                >
                  <Bookmark className={`size-5 ${isSaved ? 'fill-blue-600' : ''}`} />
                  <span className="hidden sm:inline">{isSaved ? 'Хадгалсан' : 'Хадгалах'}</span>
                </button>
              </div>
            </div>

            {/* Article Content */}
            <div className="prose prose-lg max-w-none mb-12">
              <div className="text-gray-700 leading-relaxed whitespace-pre-line text-base sm:text-lg">
                {post.content}
              </div>
            </div>

            {/* Author Section */}
            <div className="mt-12 pt-8 border-t-2 border-gray-100">
              <h3 className="text-xl font-semibold mb-6 text-gray-900">Зохиогч</h3>
              <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl p-6 sm:p-8 border-2 border-blue-100">
                <div className="flex flex-col sm:flex-row gap-6 items-start">
                  <button
                    onClick={goToAuthorProfile}
                    className="shrink-0 group"
                    disabled={!post.authorId}
                  >
                    <img
                      src={post.authorAvatar || '/avatar.png'}
                      alt={post.author}
                      className={`size-20 sm:size-24 rounded-full object-cover border-4 border-white shadow-lg transition-transform ${
                        post.authorId ? 'group-hover:scale-105 cursor-pointer' : ''
                      }`}
                    />
                  </button>

                  <div className="flex-1">
                    <button
                      onClick={goToAuthorProfile}
                      className={`text-2xl font-bold text-gray-900 mb-2 transition-colors text-left ${
                        post.authorId ? 'hover:text-blue-600 cursor-pointer' : ''
                      }`}
                      disabled={!post.authorId}
                    >
                      {post.author}
                    </button>
                    <p className="text-gray-600 mb-4 leading-relaxed">
                      {post.authorBio || 'Тухайн хэрэглэгч танилцуулга оруулаагүй байна.'}
                    </p>

                    {post.authorId && (
                      <button
                        onClick={goToAuthorProfile}
                        className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all font-medium shadow-lg"
                      >
                        <User className="size-5" />
                        <span>Профайл харах</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* CTA Section */}
            <div className="mt-12 p-6 sm:p-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl text-white text-center">
              <h3 className="text-2xl font-bold mb-2">Таалагдсан уу?</h3>
              <p className="mb-6 text-blue-100">Бусад нийтлэлүүдийг үзээрэй</p>
              <Link
                href="/blogs"
                className="inline-block px-6 py-3 bg-white text-blue-600 rounded-lg hover:bg-gray-100 transition-all font-medium shadow-lg"
              >
                Бүх нийтлэл үзэх
              </Link>
            </div>
          </div>
        </article>
      </div>
    </div>
  );
}

function categoryToSlug(category: string) {
  return category.toLowerCase().replace(/\s+/g, '-');
}
