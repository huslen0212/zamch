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
  UserPlus,
  UserCheck
} from 'lucide-react';
import { useEffect, useMemo, useRef, useState } from 'react';
import { TravelBlogLoader } from '@/components/Loader';

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3001';

type LocationDto = { name: string; lat?: number; lng?: number };

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

  likeCount?: number;
  likesCount?: number;
  likedByMe?: boolean;

  followedByMe?: boolean;

  location?: LocationDto | null;
  viewCount?: number;
  commentCount?: number;

  savedByMe?: boolean;
}

function getTokenSafe() {
  if (typeof window === 'undefined') return '';
  return localStorage.getItem('token') ?? '';
}

function categoryToSlug(category: string) {
  return category.toLowerCase().replace(/\s+/g, '-');
}

function estimateReadTime(content: string) {
  const text = (content ?? '').trim();
  if (!text) return 1;
  const words = text.split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / 200));
}

function IconSpinner({ className = 'size-4' }: { className?: string }) {
  return <Loader2 className={`${className} animate-spin`} />;
}

export function BlogPost({ postId }: { postId: number }) {
  const router = useRouter();

  const [post, setPost] = useState<BlogPostType | null>(null);
  const [loading, setLoading] = useState(true);

  // ✅ NEW: notFound / error тусад нь
  const [notFound, setNotFound] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const [shareMenuOpen, setShareMenuOpen] = useState(false);
  const shareRef = useRef<HTMLDivElement | null>(null);

  const [isLiked, setIsLiked] = useState(false);
  const [likes, setLikes] = useState(0);

  const [isSaved, setIsSaved] = useState(false);
  const [isFollowed, setIsFollowed] = useState(false);

  const [likeLoading, setLikeLoading] = useState(false);
  const [saveLoading, setSaveLoading] = useState(false);
  const [followLoading, setFollowLoading] = useState(false);

  const readTime = useMemo(() => {
    if (!post?.content) return 1;
    return estimateReadTime(post.content);
  }, [post?.content]);

  const prettyDate = useMemo(() => {
    if (!post?.createdAt) return '';
    return new Date(post.createdAt).toLocaleDateString('mn-MN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  }, [post?.createdAt]);

  // Share dropdown close: outside click + ESC
  useEffect(() => {
    const onDown = (e: MouseEvent) => {
      const target = e.target as Node;
      if (shareRef.current && !shareRef.current.contains(target)) {
        setShareMenuOpen(false);
      }
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setShareMenuOpen(false);
    };
    document.addEventListener('mousedown', onDown);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onDown);
      document.removeEventListener('keydown', onKey);
    };
  }, []);

  // ✅ FIXED: StrictMode abort flicker арилгах
  useEffect(() => {
    let alive = true;
    const ac = new AbortController();

    setLoading(true);
    setNotFound(false);
    setErrorMsg(null);
    setPost(null);

    const token = getTokenSafe();
    const headers: Record<string, string> = {};
    if (token) headers.Authorization = `Bearer ${token}`;

    (async () => {
      try {
        const res = await fetch(`${API_URL}/posts/${postId}`, {
          headers,
          signal: ac.signal,
        });

        if (!res.ok) {
          if (res.status === 404) {
            if (!alive) return;
            setNotFound(true);
            return;
          }
          const err = await res.json().catch(() => ({}));
          throw new Error(err?.message || `Request failed (${res.status})`);
        }

        const data: BlogPostType = await res.json();
        if (!alive) return;

        setPost(data);

        const likeCount =
          typeof (data as any).likeCount === 'number'
            ? (data as any).likeCount
            : typeof (data as any).likesCount === 'number'
              ? (data as any).likesCount
              : 0;

        setLikes(likeCount);
        setIsLiked(Boolean((data as any).likedByMe));
        setIsFollowed(Boolean((data as any).followedByMe));
        setIsSaved(Boolean((data as any).savedByMe));
      } catch (err: any) {
        if (!alive) return;

        // ✅ AbortError үед UI-г өөрчлөхгүй
        if (err?.name === 'AbortError') return;

        setErrorMsg(err?.message || 'Алдаа гарлаа');
      } finally {
        if (!alive) return;
        setLoading(false);
      }
    })();

    return () => {
      alive = false;
      ac.abort();
    };
  }, [postId]);

  const requireAuth = () => {
    const token = getTokenSafe();
    if (!token) {
      router.push('/login');
      return false;
    }
    return true;
  };

  const handleLike = async () => {
    if (!post) return;
    if (!requireAuth()) return;
    if (likeLoading) return;

    setLikeLoading(true);

    const prevLiked = isLiked;
    const prevLikes = likes;

    // optimistic
    const nextLiked = !prevLiked;
    setIsLiked(nextLiked);
    setLikes((p) => (nextLiked ? p + 1 : Math.max(0, p - 1)));

    try {
      const res = await fetch(`${API_URL}/posts/${post.id}/like`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${getTokenSafe()}` },
      });
      if (!res.ok) throw new Error('like failed');

      const data = await res.json().catch(() => ({} as any));
      if (typeof data?.liked === 'boolean') setIsLiked(Boolean(data.liked));
      if (typeof data?.likeCount === 'number') setLikes(data.likeCount);
    } catch {
      setIsLiked(prevLiked);
      setLikes(prevLikes);
    } finally {
      setLikeLoading(false);
    }
  };

  const handleFollow = async () => {
    if (!post?.authorId) return;
    if (!requireAuth()) return;
    if (followLoading) return;

    setFollowLoading(true);

    const prev = isFollowed;
    setIsFollowed(!prev); // optimistic

    try {
      const res = await fetch(`${API_URL}/users/${post.authorId}/follow`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${getTokenSafe()}` },
      });
      if (!res.ok) throw new Error('follow failed');

      const data = await res.json().catch(() => ({} as any));
      if (typeof data?.followed === 'boolean') setIsFollowed(Boolean(data.followed));
    } catch {
      setIsFollowed(prev);
    } finally {
      setFollowLoading(false);
    }
  };

  const handleSave = async () => {
    if (!post) return;
    if (!requireAuth()) return;
    if (saveLoading) return;

    setSaveLoading(true);

    const prev = isSaved;
    setIsSaved(!prev); // optimistic

    try {
      // TODO: Backend endpoint байвал энд:
      // const res = await fetch(`${API_URL}/posts/${post.id}/save`, { method:'POST', headers:{ Authorization:`Bearer ${getTokenSafe()}` } })
      // if (!res.ok) throw new Error('save failed')
      await new Promise((r) => setTimeout(r, 180));
    } catch {
      setIsSaved(prev);
    } finally {
      setSaveLoading(false);
    }
  };

  const handleShare = (platform: 'facebook' | 'twitter' | 'copy' | 'native') => {
    if (!post) return;

    const url = window.location.href;
    const text = `${post.title} - ${post.excerpt}`;

    if (platform === 'native' && (navigator as any)?.share) {
      (navigator as any).share({ title: post.title, text, url }).catch(() => {});
      setShareMenuOpen(false);
      return;
    }

    if (platform === 'copy') {
      navigator.clipboard.writeText(url);
      setShareMenuOpen(false);
      return;
    }

    const shareUrls: Record<string, string> = {
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
      twitter: `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(text)}`,
    };

    window.open(shareUrls[platform], '_blank', 'width=700,height=500');
    setShareMenuOpen(false);
  };
  const goToAuthorProfile = () => {
    if (post?.authorId) router.push(`/profile/${post?.authorId}`);
  };
  if (loading || (!post && !notFound && !errorMsg)) {
    return (
      <TravelBlogLoader />
    );
  }

  // ✅ 404 үед л not found
  if (notFound) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-gray-50 to-red-50 px-4">
        <div className="text-center max-w-md">
          <div className="size-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <ArrowLeft className="size-10 text-red-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Нийтлэл олдсонгүй</h2>
          <p className="text-gray-600 mb-6">Энэ нийтлэл олдсонгүй эсвэл устгагдсан байна</p>
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

  // ✅ Бусад алдаа
  if (!post) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4 bg-gradient-to-br from-gray-50 to-blue-50">
        <div className="max-w-md w-full bg-white rounded-2xl shadow p-6 text-center">
          <p className="text-red-600 font-medium mb-2">Алдаа гарлаа</p>
          <p className="text-gray-600">{errorMsg ?? 'Түр хүлээгээд дахин оролдоно уу'}</p>
          <button
            onClick={() => router.back()}
            className="mt-5 px-6 py-2.5 bg-gray-900 text-white rounded-lg"
          >
            Буцах
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      {/* Sticky Header (Back + Share) */}
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

            <div className="relative" ref={shareRef}>
              <button
                onClick={() => setShareMenuOpen((v) => !v)}
                className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
                aria-label="Хуваалцах"
              >
                <Share2 className="size-4 text-gray-700" />
              </button>

              {shareMenuOpen && (
                <div className="absolute right-0 mt-2 w-52 bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden z-50">
                  <button
                    onClick={() => handleShare('native')}
                    className="w-full px-4 py-3 text-left hover:bg-gray-50 flex items-center gap-3 transition-colors"
                  >
                    <Share2 className="size-5 text-gray-700" />
                    <span className="text-sm">Share (утсаар)</span>
                  </button>
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

      {/* Hero Image */}
      <div className="relative h-64 sm:h-80 lg:h-[500px] w-full overflow-hidden">
        <img src={post.image} alt={post.title} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />

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

            {/* Meta */}
            <div className="flex flex-wrap items-center gap-4 sm:gap-6 mb-8 pb-6 border-b-2 border-gray-100">
              <div className="flex items-center gap-2 text-gray-600">
                <Calendar className="size-5 text-blue-600" />
                <span className="text-sm">{prettyDate}</span>
              </div>

              <div className="flex items-center gap-2 text-gray-600">
                <Clock className="size-5 text-green-600" />
                <span className="text-sm">{readTime} мин унших</span>
              </div>

              {post.location?.name ? (
                <div className="flex items-center gap-2 text-gray-600">
                  <MapPin className="size-5 text-red-600" />
                  <span className="text-sm">{post.location.name}</span>
                </div>
              ) : null}

              {typeof post.viewCount === 'number' ? (
                <div className="flex items-center gap-2 text-gray-600">
                  <Eye className="size-5 text-purple-600" />
                  <span className="text-sm">{post.viewCount}</span>
                </div>
              ) : null}

              {typeof post.commentCount === 'number' ? (
                <div className="flex items-center gap-2 text-gray-600">
                  <MessageCircle className="size-5 text-orange-600" />
                  <span className="text-sm">{post.commentCount}</span>
                </div>
              ) : null}
            </div>

            {/* Excerpt */}
            <div className="bg-blue-50 border-l-4 border-blue-600 p-4 sm:p-6 mb-6 rounded-r-lg">
              <p className="text-gray-700 text-base sm:text-lg leading-relaxed italic">
                {post.excerpt}
              </p>
            </div>

            {/* Actions */}
            <div className="flex flex-wrap items-center gap-3 mb-8 pb-8 border-b-2 border-gray-100">
              <button
                onClick={handleLike}
                disabled={likeLoading}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-full transition-all font-medium ${
                  isLiked
                    ? 'bg-red-50 text-red-600 border-2 border-red-200 shadow-sm'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200 border-2 border-transparent'
                } ${likeLoading ? 'opacity-60 cursor-not-allowed' : ''}`}
              >
                {likeLoading ? (
                  <IconSpinner className="size-5" />
                ) : (
                  <Heart className={`size-5 ${isLiked ? 'fill-red-600' : ''}`} />
                )}
                <span>{Number.isFinite(likes) ? likes : 0} таалагдсан</span>
              </button>

              <button
                onClick={handleSave}
                disabled={saveLoading}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-full transition-all font-medium ${
                  isSaved
                    ? 'bg-blue-50 text-blue-600 border-2 border-blue-200 shadow-sm'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200 border-2 border-transparent'
                } ${saveLoading ? 'opacity-60 cursor-not-allowed' : ''}`}
              >
                {saveLoading ? (
                  <IconSpinner className="size-5" />
                ) : (
                  <Bookmark className={`size-5 ${isSaved ? 'fill-blue-600' : ''}`} />
                )}
                <span>{isSaved ? 'Хадгалсан' : 'Хадгалах'}</span>
              </button>

              {post.authorId ? (
                <button
                  onClick={handleFollow}
                  disabled={followLoading}
                  className={`flex items-center gap-2 px-5 py-2.5 rounded-full transition-all font-medium border-2 ${
                    isFollowed
                      ? 'bg-blue-50 text-blue-700 border-blue-200'
                      : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-50'
                  } ${followLoading ? 'opacity-60 cursor-not-allowed' : ''}`}
                >
                  {followLoading ? (
                    <IconSpinner className="size-5" />
                  ) : isFollowed ? (
                    <UserCheck className="size-5" />
                  ) : (
                    <UserPlus className="size-5" />
                  )}
                  <span>{isFollowed ? 'Дагаж байна' : 'Дагах'}</span>
                </button>
              ) : null}
            </div>

            {/* Content */}
            <div className="prose prose-lg max-w-none mb-12">
              <div className="text-gray-700 leading-relaxed whitespace-pre-line text-base sm:text-lg">
                {post.content}
              </div>
            </div>

            {/* Author */}
            <div className="mt-12 pt-8 border-t-2 border-gray-100">
              <h3 className="text-xl font-semibold mb-6 text-gray-900">Зохиогч</h3>

              <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl p-6 sm:p-8 border-2 border-blue-100">
                <div className="flex flex-col sm:flex-row gap-6 items-start">
                  <button onClick={() => post.authorId && goToAuthorProfile()} className="shrink-0 group" disabled={!post.authorId}>
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
                      onClick={() => post.authorId && goToAuthorProfile()}
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

                    {post.authorId ? (
                      <button
                        onClick={goToAuthorProfile}
                        className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all font-medium shadow-lg"
                      >
                        <User className="size-5" />
                        <span>Профайл харах</span>
                      </button>
                    ) : null}
                  </div>
                </div>
              </div>
            </div>

            {/* CTA */}
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
