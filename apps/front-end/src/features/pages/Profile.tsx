'use client';

import Link from 'next/link';
import {
  BookOpen,
  Calendar,
  Edit,
  Globe,
  Heart,
  MapPin,
  Users,
  X,
  Loader2,
  Camera,
  Upload,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useEffect, useMemo, useState } from 'react';
import { TravelBlogLoader } from '@/components/Loader';

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3001';

/* ================= TYPES ================= */

type LocationDto =
  | string
  | {
      name: string;
      lat?: number;
      lng?: number;
    };

interface Post {
  id: string | number;
  title: string;
  excerpt: string;
  category: string;
  image?: string | null;
  location?: {
    name: string;
    lat?: number;
    lng?: number;
  } | null;
  createdAt: string;
  readTime?: string;
  date?: string;
}

/* ================= HELPERS ================= */

function getTokenSafe(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('token');
}

function formatDateMN(dateStr?: string) {
  if (!dateStr) return '';
  const d = new Date(dateStr);
  if (Number.isNaN(d.getTime())) return '';
  return d.toLocaleDateString('mn-MN');
}

function normalizeLocation(loc: LocationDto | null | undefined):
  | {
      name: string;
      lat?: number;
      lng?: number;
    }
  | undefined {
  if (!loc) return undefined;
  if (typeof loc === 'string') return { name: loc };
  return {
    name: loc.name ?? '',
    lat: loc.lat,
    lng: loc.lng,
  };
}

function estimateReadTime(excerpt?: string) {
  const text = (excerpt ?? '').trim();
  if (!text) return '1 мин';
  const words = text.split(/\s+/).filter(Boolean).length;
  const mins = Math.max(1, Math.round(words / 200));
  return `${mins} мин`;
}

/* ================= EDIT MODAL ================= */

type EditFormState = {
  name: string;
  bio: string;
  avatar: string;
  locationName: string;
  lat: string;
  lng: string;
};

function EditProfileModal({
  open,
  initial,
  saving,
  onClose,
  onSave,
}: {
  open: boolean;
  initial: EditFormState;
  saving: boolean;
  onClose: () => void;
  onSave: (next: EditFormState) => void;
}) {
  const [form, setForm] = useState<EditFormState>(initial);
  const [previewAvatar, setPreviewAvatar] = useState(initial.avatar);

  useEffect(() => {
    if (open) {
      setForm(initial);
      setPreviewAvatar(initial.avatar);
    }
  }, [open, initial]);

  useEffect(() => {
    setPreviewAvatar(form.avatar);
  }, [form.avatar]);

  if (!open) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(form);
  };

  return (
    <div className="fixed inset-0 z-[60] animate-fadeIn">
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="absolute inset-0 flex items-center justify-center p-4 overflow-y-auto">
        <div className="w-full max-w-2xl rounded-2xl bg-white shadow-2xl overflow-hidden my-8 animate-slideUp">
          {/* Header */}
          <div className="relative bg-gradient-to-r from-blue-600 to-purple-600 px-6 py-5">
            <div className="flex items-center justify-between text-white">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm">
                  <Edit className="size-5" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold">Профайл засах</h2>
                  <p className="text-sm text-blue-100">Мэдээллээ шинэчлэх</p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-2 rounded-full hover:bg-white/20 transition-colors"
                aria-label="Хаах"
              >
                <X className="size-5" />
              </button>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            {/* Avatar Section */}
            <div className="flex flex-col items-center gap-4 pb-6 border-b border-gray-200">
              <div className="relative group">
                <img
                  src={previewAvatar || '/default-avatar.png'}
                  alt="Avatar preview"
                  className="size-28 rounded-full object-cover border-4 border-gray-200 shadow-lg"
                />
                <div className="absolute inset-0 rounded-full bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <Camera className="size-8 text-white" />
                </div>
              </div>
              <div className="text-center">
                <p className="text-sm text-gray-600 mb-1">Профайл зураг</p>
                <p className="text-xs text-gray-400">Зургийн URL оруулна уу</p>
              </div>
            </div>

            {/* Form Fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {/* Name */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Нэр <span className="text-red-500">*</span>
                </label>
                <input
                  value={form.name}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, name: e.target.value }))
                  }
                  className="w-full rounded-lg border border-gray-300 px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  placeholder="Таны нэр"
                  required
                />
              </div>

              {/* Bio */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Танилцуулга
                </label>
                <textarea
                  value={form.bio}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, bio: e.target.value }))
                  }
                  className="w-full min-h-[100px] rounded-lg border border-gray-300 px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none"
                  placeholder="Өөрийнхөө тухай товч бичнэ үү..."
                />
                <p className="text-xs text-gray-400 mt-1">
                  {form.bio.length}/200 тэмдэгт
                </p>
              </div>

              {/* Avatar URL */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Зургийн URL
                </label>
                <div className="relative">
                  <input
                    value={form.avatar}
                    onChange={(e) =>
                      setForm((p) => ({ ...p, avatar: e.target.value }))
                    }
                    className="w-full rounded-lg border border-gray-300 pl-10 pr-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    placeholder="https://example.com/avatar.jpg"
                  />
                  <Upload className="absolute left-3 top-1/2 -translate-y-1/2 size-5 text-gray-400" />
                </div>
              </div>
            </div>
          </form>
          <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-100 transition-colors font-medium"
              disabled={saving}
            >
              Цуцлах
            </button>
            <button
              type="submit"
              onClick={handleSubmit}
              className="px-5 py-2.5 rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700 disabled:opacity-60 disabled:cursor-not-allowed transition-all inline-flex items-center gap-2 font-medium shadow-lg"
              disabled={saving}
            >
              {saving ? (
                <>
                  <Loader2 className="size-4 animate-spin" />
                  <span>Хадгалж байна...</span>
                </>
              ) : (
                <>
                  <Upload className="size-4" />
                  <span>Хадгалах</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.2s ease-out;
        }
        .animate-slideUp {
          animation: slideUp 0.3s ease-out;
        }
      `}</style>
    </div>
  );
}

/* ================= MAIN ================= */

export function Profile() {
  const { user, isAuthenticated, refreshMe, loading } = useAuth() as any;
  const [userPosts, setUserPosts] = useState<Post[]>([]);
  const [postsLoading, setPostsLoading] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [saving, setSaving] = useState(false);

  const stats = useMemo(() => {
    return {
      postsCount: user?.postsCount ?? 0,
      totalLikes: user?.totalLikes ?? 0,
      followersCount: user?.followersCount ?? 0,
      followingCount: user?.followingCount ?? 0,
      countriesVisited: user?.countriesVisited ?? 0,
    };
  }, [user]);

  useEffect(() => {
    if (!isAuthenticated) return;

    const token = getTokenSafe();
    if (!token) return;

    const ac = new AbortController();

    setPostsLoading(true);
    fetch(`${API_URL}/posts/me`, {
      headers: { Authorization: `Bearer ${token}` },
      signal: ac.signal,
    })
      .then((res) => {
        if (!res.ok) throw new Error('Failed to fetch posts');
        return res.json();
      })
      .then((raw) => {
        const arr = Array.isArray(raw)
          ? raw
          : Array.isArray(raw?.data)
            ? raw.data
            : [];
        const normalized: Post[] = arr.map((p: any) => {
          const loc = normalizeLocation(p.location ?? null);
          const createdAt = p.createdAt ?? p.cdate ?? new Date().toISOString();
          return {
            id: p.id,
            title: p.title ?? '',
            excerpt: p.excerpt ?? p.description ?? '',
            category: p.category ?? p.categoryName ?? 'Ерөнхий',
            image: p.image ?? p.thumbnail ?? null,
            location: loc ? { ...loc } : null,
            createdAt,
            date: formatDateMN(createdAt),
            readTime:
              p.readTime ?? estimateReadTime(p.excerpt ?? p.description),
          };
        });
        setUserPosts(normalized);
      })
      .catch((err) => {
        if (err?.name !== 'AbortError') console.error(err);
        setUserPosts([]);
      })
      .finally(() => setPostsLoading(false));

    return () => ac.abort();
  }, [isAuthenticated]);

  if (loading) return <TravelBlogLoader label="Та түр хүлээнэ үү" />;

  if (!isAuthenticated || !user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center px-4">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-2xl p-8 text-center">
          <div className="size-20 bg-gradient-to-br from-blue-600 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <Users className="size-10 text-white" />
          </div>
          <h2 className="text-2xl font-bold mb-2">Нэвтрэх шаардлагатай</h2>
          <p className="text-gray-600 mb-6">
            Профайл харахын тулд эхлээд нэвтэрнэ үү
          </p>
          <Link
            href="/login"
            className="block w-full py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all font-medium shadow-lg"
          >
            Нэвтрэх
          </Link>
        </div>
      </div>
    );
  }

  const safeAvatar = user.avatar ?? '/default-avatar.png';
  const safeBio = user.bio ?? 'Танилцуулга алга байна.';
  const safeJoinDate = user.joinDate ? formatDateMN(user.joinDate) : '';

  const userLoc = normalizeLocation(user.location as any);

  const editInitial: EditFormState = {
    name: user.name ?? '',
    bio: user.bio ?? '',
    avatar: user.avatar ?? '',
    locationName: userLoc?.name ?? '',
    lat: userLoc?.lat != null ? String(userLoc.lat) : '',
    lng: userLoc?.lng != null ? String(userLoc.lng) : '',
  };

  const onSaveProfile = async (next: EditFormState) => {
    const token = getTokenSafe();
    if (!token) return;

    setSaving(true);
    try {
      const latNum =
        next.lat.trim() === '' ? undefined : Number(next.lat.trim());
      const lngNum =
        next.lng.trim() === '' ? undefined : Number(next.lng.trim());

      const payload: any = {
        name: next.name.trim(),
        bio: next.bio.trim(),
        avatar: next.avatar.trim() || null,
        location: next.locationName.trim() || null,
      };

      if (Number.isFinite(latNum)) payload.lat = latNum;
      if (Number.isFinite(lngNum)) payload.lng = lngNum;

      const res = await fetch(`${API_URL}/auth/me`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err?.message || 'Профайл хадгалах үед алдаа гарлаа');
      }

      if (typeof refreshMe === 'function') {
        await refreshMe();
      }

      setEditOpen(false);
    } catch (e) {
      console.error(e);
      alert(e instanceof Error ? e.message : 'Алдаа гарлаа');
    } finally {
      setSaving(false);
    }
  };
  return (
    <div className="min-h-screen bg-gray-50">
      <EditProfileModal
        open={editOpen}
        initial={editInitial}
        saving={saving}
        onClose={() => setEditOpen(false)}
        onSave={onSaveProfile}
      />

      {/* Cover Photo */}
      <div className="relative h-48 sm:h-64 lg:h-80 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080"
          alt="Cover"
          className="w-full h-full object-cover opacity-40"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
      </div>

      {/* Profile Info */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-16 sm:-mt-20 relative z-10">
        <div className="bg-white rounded-2xl shadow-xl p-4 sm:p-6 lg:p-8 mb-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6">
            {/* Avatar */}
            <div className="relative group">
              <img
                src={safeAvatar}
                alt={user.name ?? 'User'}
                className="size-24 sm:size-28 lg:size-32 rounded-full border-4 border-white shadow-lg object-cover"
              />
              <div className="absolute inset-0 rounded-full bg-gradient-to-br from-blue-600/20 to-purple-600/20 opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>

            {/* User Info */}
            <div className="flex-1 w-full">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-3">
                <div className="flex-1">
                  <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-1">
                    {user.name}
                  </h1>
                  <p className="text-gray-600 text-sm sm:text-base">
                    {safeBio}
                  </p>
                </div>

                <button
                  onClick={() => setEditOpen(true)}
                  className="flex items-center gap-2 px-4 py-2 border-2 border-gray-300 rounded-lg hover:border-blue-600 hover:bg-blue-50 hover:text-blue-600 transition-all shrink-0 font-medium"
                >
                  <Edit className="size-4" />
                  <span>Засах</span>
                </button>
              </div>

              {/* Location */}
              {userLoc?.name && (
                <div className="flex items-center gap-2 text-gray-600 mb-4">
                  <MapPin className="size-5 text-blue-600" />
                  <span>{userLoc.name}</span>
                </div>
              )}

              {/* Stats */}
              <div className="grid grid-cols-2 sm:flex sm:flex-wrap gap-4 sm:gap-6 mb-4">
                <div className="flex items-center gap-2">
                  <div className="p-2 bg-blue-50 rounded-lg">
                    <BookOpen className="size-5 text-blue-600" />
                  </div>
                  <div>
                    <div className="text-lg font-semibold text-gray-900">
                      {stats.postsCount}
                    </div>
                    <div className="text-xs text-gray-600">Нийтлэл</div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <div className="p-2 bg-red-50 rounded-lg">
                    <Heart className="size-5 text-red-600" />
                  </div>
                  <div>
                    <div className="text-lg font-semibold text-gray-900">
                      {stats.totalLikes.toLocaleString()}
                    </div>
                    <div className="text-xs text-gray-600">Таалагдсан</div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <div className="p-2 bg-green-50 rounded-lg">
                    <Users className="size-5 text-green-600" />
                  </div>
                  <div>
                    <div className="text-lg font-semibold text-gray-900">
                      {stats.followersCount.toLocaleString()}
                    </div>
                    <div className="text-xs text-gray-600">Дагагч</div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <div className="p-2 bg-purple-50 rounded-lg">
                    <Globe className="size-5 text-purple-600" />
                  </div>
                  <div>
                    <div className="text-lg font-semibold text-gray-900">
                      {stats.countriesVisited}
                    </div>
                    <div className="text-xs text-gray-600">Улс</div>
                  </div>
                </div>
              </div>

              {/* Join Date */}
              {safeJoinDate && (
                <div className="flex items-center gap-2 text-gray-500 text-sm">
                  <Calendar className="size-4" />
                  <span>Нэгдсэн: {safeJoinDate}</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8 mb-12">
          {/* Posts */}
          <div className="lg:col-span-2 space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <h2 className="text-xl sm:text-2xl font-bold">
                Миний нийтлэлүүд ({userPosts.length})
              </h2>
              <Link
                href="/create-post"
                className="px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all font-medium shadow-lg"
              >
                + Шинэ нийтлэл
              </Link>
            </div>

            {postsLoading ? (
              <div className="bg-white rounded-xl p-10 text-center text-gray-600">
                <Loader2 className="size-6 animate-spin mx-auto mb-3 text-blue-600" />
                Нийтлэлүүд ачаалж байна...
              </div>
            ) : userPosts.length > 0 ? (
              <div className="space-y-4">
                {userPosts.map((post) => (
                  <Link
                    href={`/blog/${post.id}`}
                    key={String(post.id)}
                    className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all block group"
                  >
                    <div className="flex flex-col sm:flex-row">
                      <div className="sm:w-1/3 bg-gray-100 relative overflow-hidden h-48 sm:h-auto">
                        <img
                          src={post.image || '/placeholder.jpg'}
                          alt={post.title}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                        />
                      </div>
                      <div className="p-4 sm:p-6 sm:w-2/3">
                        <div className="flex flex-wrap items-center gap-2 mb-3">
                          <span className="px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-xs font-medium">
                            {post.category}
                          </span>
                          {post.location?.name && (
                            <div className="flex items-center gap-1 text-gray-500 text-xs">
                              <MapPin className="size-3" />
                              <span>{post.location.name}</span>
                            </div>
                          )}
                        </div>

                        <h3 className="text-lg sm:text-xl font-semibold mb-2 group-hover:text-blue-600 transition-colors line-clamp-2">
                          {post.title}
                        </h3>

                        <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                          {post.excerpt}
                        </p>

                        <div className="flex items-center gap-3 text-xs text-gray-500">
                          <span>
                            {post.date ?? formatDateMN(post.createdAt)}
                          </span>
                          <span>•</span>
                          <span>
                            {post.readTime ?? estimateReadTime(post.excerpt)}{' '}
                            унших
                          </span>
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="bg-white rounded-xl p-8 sm:p-12 text-center">
                <BookOpen className="size-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">Нийтлэл алга</h3>
                <p className="text-gray-600 mb-6">
                  Та одоогоор нийтлэл бичээгүй байна
                </p>
                <Link
                  href="/create-post"
                  className="inline-block px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all font-medium shadow-lg"
                >
                  Эхний нийтлэл бичих
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
