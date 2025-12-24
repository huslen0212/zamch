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
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { blogPosts } from '../../data/blogPosts';

export function Profile() {
  const { user, isAuthenticated } = useAuth();

  if (!isAuthenticated || !user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center">
          <div className="size-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Users className="size-8 text-blue-600" />
          </div>
          <h2 className="text-2xl mb-4">Нэвтрэх шаардлагатай</h2>
          <p className="text-gray-600 mb-6">
            Профайл харахын тулд эхлээд нэвтэрнэ үү
          </p>
          <Link
            href="/login"
            className="w-full py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Нэвтрэх
          </Link>
        </div>
      </div>
    );
  }

  // Get user's posts (mock - in real app would filter by user.id)
  const userPosts = blogPosts.slice(0, 3);

  // Calculate map position for user location
  const getMapPosition = (lat: number, lng: number) => {
    const x = ((lng + 180) / 360) * 100;
    const y = ((90 - lat) / 180) * 100;
    return { x: `${x}%`, y: `${y}%` };
  };

  const userLocationPos = user.location
    ? getMapPosition(user.location.lat, user.location.lng)
    : null;

  // Get all post locations for map
  const postLocations = userPosts
    .filter((post) => post.location)
    .map((post) => ({
      ...post.location!,
      postId: post.id,
      title: post.title,
      image: post.image,
    }));

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Cover Photo */}
      <div className="relative h-64 bg-gradient-to-r from-blue-600 to-purple-600">
        <img
          src="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb3VudGFpbiUyMGxhbmRzY2FwZXxlbnwxfHx8fDE3NjYzNDc5Njh8MA&ixlib=rb-4.1.0&q=80&w=1080"
          alt="Cover"
          className="w-full h-full object-cover opacity-50"
        />
      </div>

      {/* Profile Info */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-20 relative z-10">
        <div className="bg-white rounded-xl shadow-xl p-8 mb-8">
          <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
            {/* Avatar */}
            <img
              src={user.avatar}
              alt={user.name}
              className="size-32 rounded-full border-4 border-white shadow-lg object-cover"
            />

            {/* User Info */}
            <div className="flex-1">
              <div className="flex items-start justify-between mb-2">
                <div>
                  <h1 className="text-3xl mb-1">{user.name}</h1>
                  <p className="text-gray-600">{user.bio}</p>
                </div>
                <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                  <Edit className="size-4" />
                  <span>Засах</span>
                </button>
              </div>

              {/* Location */}
              {user.location && (
                <div className="flex items-center gap-2 text-gray-600 mb-4">
                  <MapPin className="size-5" />
                  <span>{user.location.name}</span>
                </div>
              )}

              {/* Stats */}
              <div className="flex flex-wrap gap-6 mb-4">
                <div className="flex items-center gap-2">
                  <BookOpen className="size-5 text-blue-600" />
                  <span className="text-gray-900">{user.postsCount}</span>
                  <span className="text-gray-600 text-sm">Нийтлэл</span>
                </div>
                <div className="flex items-center gap-2">
                  <Heart className="size-5 text-red-600" />
                  <span className="text-gray-900">
                    {user.totalLikes.toLocaleString()}
                  </span>
                  <span className="text-gray-600 text-sm">Таалагдсан</span>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="size-5 text-green-600" />
                  <span className="text-gray-900">
                    {user.followers.toLocaleString()}
                  </span>
                  <span className="text-gray-600 text-sm">Дагагч</span>
                </div>
                <div className="flex items-center gap-2">
                  <Globe className="size-5 text-purple-600" />
                  <span className="text-gray-900">{user.countriesVisited}</span>
                  <span className="text-gray-600 text-sm">Улс</span>
                </div>
              </div>

              {/* Join Date */}
              <div className="flex items-center gap-2 text-gray-500 text-sm">
                <Calendar className="size-4" />
                <span>
                  Нэгдсэн: {new Date(user.joinDate).toLocaleDateString('mn-MN')}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
          {/* Posts Section */}
          <div className="lg:col-span-2 space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl">
                Миний нийтлэлүүд ({userPosts.length})
              </h2>
              <Link
                href="/create-post"
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Шинэ нийтлэл
              </Link>
            </div>

            {userPosts.length > 0 ? (
              <div className="space-y-6">
                {userPosts.map((post) => (
                  <Link
                    href={`/blog/${post.id}`}
                    key={post.id}
                    className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-shadow block"
                  >
                    <div className="md:flex">
                      <div className="md:w-1/3">
                        <img
                          src={post.image}
                          alt={post.title}
                          className="w-full h-48 md:h-full object-cover"
                        />
                      </div>
                      <div className="p-6 md:w-2/3">
                        <div className="flex items-center gap-2 mb-3">
                          <span className="px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-sm">
                            {post.category}
                          </span>
                          {post.location && (
                            <div className="flex items-center gap-1 text-gray-500 text-sm">
                              <MapPin className="size-4" />
                              <span>{post.location.name}</span>
                            </div>
                          )}
                        </div>
                        <h3 className="text-xl mb-2 hover:text-blue-600 transition-colors">
                          {post.title}
                        </h3>
                        <p className="text-gray-600 mb-4 line-clamp-2">
                          {post.excerpt}
                        </p>
                        <div className="flex items-center gap-4 text-sm text-gray-500">
                          <span>{post.date}</span>
                          <span>•</span>
                          <span>{post.readTime} унших</span>
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="bg-white rounded-xl p-12 text-center">
                <BookOpen className="size-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-600 mb-4">
                  Та одоогоор нийтлэл бичээгүй байна
                </p>
                <Link
                  href="/create-post"
                  className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Эхний нийтлэл бичих
                </Link>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Travel Map */}
            <div className="bg-white rounded-xl shadow-lg overflow-hidden">
              <div className="p-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
                <h3 className="text-lg flex items-center gap-2">
                  <MapPin className="size-5" />
                  Миний аяллын газрууд
                </h3>
              </div>

              {/* Mini Map */}
              <div className="relative aspect-square bg-gradient-to-br from-blue-100 to-green-100">
                <img
                  src="https://images.unsplash.com/photo-1642009071428-119813340e22?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3b3JsZCUyMG1hcCUyMHRyYXZlbCUyMHBpbnN8ZW58MXx8fHwxNzY2MzQ3OTY4fDA&ixlib=rb-4.1.0&q=80&w=1080"
                  alt="World Map"
                  className="absolute inset-0 w-full h-full object-cover opacity-60"
                />

                {/* User Home Location */}
                {userLocationPos && (
                  <div
                    className="absolute"
                    style={{
                      top: userLocationPos.y,
                      left: userLocationPos.x,
                      transform: 'translate(-50%, -50%)',
                    }}
                  >
                    <div className="relative">
                      <div className="size-4 bg-red-600 rounded-full border-2 border-white shadow-lg animate-pulse" />
                      <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 bg-white px-2 py-1 rounded text-xs whitespace-nowrap shadow-lg">
                        🏠 {user.location?.name}
                      </div>
                    </div>
                  </div>
                )}

                {/* Post Locations */}
                {postLocations.map((loc, index) => {
                  const pos = getMapPosition(loc.lat, loc.lng);
                  return (
                    <div
                      key={index}
                      className="absolute group"
                      style={{
                        top: pos.y,
                        left: pos.x,
                        transform: 'translate(-50%, -50%)',
                      }}
                    >
                      <MapPin className="size-6 text-blue-600 fill-blue-600 drop-shadow-lg hover:scale-125 transition-transform cursor-pointer" />
                      <div className="absolute top-full mt-2 left-1/2 -translate-x-1/2 bg-white p-2 rounded-lg shadow-xl whitespace-nowrap z-10 border border-gray-200 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                        <div className="text-xs">{loc.name}</div>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="p-4 bg-gray-50 border-t border-gray-200">
                <Link
                  href="/travel-map"
                  className="w-full py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
                >
                  Бүтэн зураг харах
                </Link>
              </div>
            </div>

            {/* Activity Stats */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-lg mb-4">Идэвх</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Нийт нийтлэл</span>
                  <span className="text-gray-900">{user.postsCount}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Нийт таалагдсан</span>
                  <span className="text-gray-900">
                    {user.totalLikes.toLocaleString()}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Дагагч</span>
                  <span className="text-gray-900">
                    {user.followers.toLocaleString()}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Дагаж байгаа</span>
                  <span className="text-gray-900">
                    {user.following.toLocaleString()}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Аялсан улс</span>
                  <span className="text-gray-900">{user.countriesVisited}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
