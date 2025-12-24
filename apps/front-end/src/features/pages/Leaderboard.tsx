"use client";

import Link from "next/link";
import { Trophy, TrendingUp, Heart, Users, BookOpen, Globe, Medal, Crown, Award, MapPin } from "lucide-react";
import { useState } from "react";
import { leaderboardUsers } from "../../data/users";

type SortBy = "rating" | "likes" | "followers" | "posts";

export function Leaderboard() {
  const [sortBy, setSortBy] = useState<SortBy>("rating");

  // Sort users based on selected criteria
  const sortedUsers = [...leaderboardUsers].sort((a, b) => {
    switch (sortBy) {
      case "rating":
        return b.rating - a.rating;
      case "likes":
        return b.totalLikes - a.totalLikes;
      case "followers":
        return b.followers - a.followers;
      case "posts":
        return b.postsCount - a.postsCount;
      default:
        return 0;
    }
  });

  const getMedalIcon = (index: number) => {
    if (index === 0) return <Crown className="size-6 text-yellow-500" />;
    if (index === 1) return <Medal className="size-6 text-gray-400" />;
    if (index === 2) return <Award className="size-6 text-orange-600" />;
    return null;
  };

  const getMapPosition = (lat: number, lng: number) => {
    const x = ((lng + 180) / 360) * 100;
    const y = ((90 - lat) / 180) * 100;
    return { x: `${x}%`, y: `${y}%` };
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="relative h-[300px] flex items-center justify-center bg-gradient-to-r from-yellow-600 via-orange-600 to-red-600">
        <div className="text-center text-white px-4">
          <Trophy className="size-16 mx-auto mb-4" />
          <h1 className="text-4xl md:text-5xl mb-4">Эрхлэгчдийн самбар</h1>
          <p className="text-xl text-yellow-100">
            Шилдэг аяллын блогерууд
          </p>
        </div>
      </section>

      {/* Sort Tabs */}
      <section className="bg-white border-b border-gray-200 sticky top-0 z-20 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center gap-2 overflow-x-auto">
            <button
              onClick={() => setSortBy("rating")}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg whitespace-nowrap transition-colors ${
                sortBy === "rating"
                  ? "bg-yellow-600 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              <TrendingUp className="size-4" />
              <span>Рейтинг</span>
            </button>
            <button
              onClick={() => setSortBy("likes")}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg whitespace-nowrap transition-colors ${
                sortBy === "likes"
                  ? "bg-red-600 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              <Heart className="size-4" />
              <span>Таалагдсан</span>
            </button>
            <button
              onClick={() => setSortBy("followers")}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg whitespace-nowrap transition-colors ${
                sortBy === "followers"
                  ? "bg-green-600 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              <Users className="size-4" />
              <span>Дагагч</span>
            </button>
            <button
              onClick={() => setSortBy("posts")}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg whitespace-nowrap transition-colors ${
                sortBy === "posts"
                  ? "bg-blue-600 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              <BookOpen className="size-4" />
              <span>Нийтлэл</span>
            </button>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Leaderboard List */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-lg overflow-hidden">
              {/* Header */}
              <div className="p-6 bg-gradient-to-r from-yellow-600 to-orange-600 text-white">
                <h2 className="text-2xl">
                  {sortBy === "rating" && "Рейтингийн жагсаалт"}
                  {sortBy === "likes" && "Таалагдсаны жагсаалт"}
                  {sortBy === "followers" && "Дагагчийн жагсаалт"}
                  {sortBy === "posts" && "Нийтлэлийн жагсаалт"}
                </h2>
              </div>

              {/* Top 3 Podium */}
              <div className="p-6 bg-gradient-to-b from-yellow-50 to-white">
                <div className="flex items-end justify-center gap-4">
                  {/* 2nd Place */}
                  {sortedUsers[1] && (
                    <div className="flex flex-col items-center">
                      <div className="relative mb-2">
                        <img
                          src={sortedUsers[1].avatar}
                          alt={sortedUsers[1].name}
                          className="size-20 rounded-full border-4 border-gray-300 object-cover"
                        />
                        <div className="absolute -top-2 -right-2">
                          <Medal className="size-8 text-gray-400" />
                        </div>
                      </div>
                      <div className="text-center mb-2">
                        <div className="text-sm mb-1">{sortedUsers[1].name}</div>
                        <div className="text-2xl text-gray-700">
                          {sortBy === "rating" && `${sortedUsers[1].rating}`}
                          {sortBy === "likes" && sortedUsers[1].totalLikes.toLocaleString()}
                          {sortBy === "followers" && sortedUsers[1].followers.toLocaleString()}
                          {sortBy === "posts" && sortedUsers[1].postsCount}
                        </div>
                      </div>
                      <div className="w-32 h-24 bg-gradient-to-t from-gray-300 to-gray-200 rounded-t-lg flex items-center justify-center">
                        <span className="text-3xl text-white">2</span>
                      </div>
                    </div>
                  )}

                  {/* 1st Place */}
                  {sortedUsers[0] && (
                    <div className="flex flex-col items-center">
                      <div className="relative mb-2">
                        <img
                          src={sortedUsers[0].avatar}
                          alt={sortedUsers[0].name}
                          className="size-24 rounded-full border-4 border-yellow-400 object-cover ring-4 ring-yellow-100"
                        />
                        <div className="absolute -top-3 -right-2">
                          <Crown className="size-10 text-yellow-500" />
                        </div>
                      </div>
                      <div className="text-center mb-2">
                        <div className="mb-1">{sortedUsers[0].name}</div>
                        <div className="text-3xl text-yellow-600">
                          {sortBy === "rating" && `${sortedUsers[0].rating}`}
                          {sortBy === "likes" && sortedUsers[0].totalLikes.toLocaleString()}
                          {sortBy === "followers" && sortedUsers[0].followers.toLocaleString()}
                          {sortBy === "posts" && sortedUsers[0].postsCount}
                        </div>
                      </div>
                      <div className="w-32 h-32 bg-gradient-to-t from-yellow-500 to-yellow-400 rounded-t-lg flex items-center justify-center">
                        <span className="text-4xl text-white">1</span>
                      </div>
                    </div>
                  )}

                  {/* 3rd Place */}
                  {sortedUsers[2] && (
                    <div className="flex flex-col items-center">
                      <div className="relative mb-2">
                        <img
                          src={sortedUsers[2].avatar}
                          alt={sortedUsers[2].name}
                          className="size-20 rounded-full border-4 border-orange-300 object-cover"
                        />
                        <div className="absolute -top-2 -right-2">
                          <Award className="size-8 text-orange-600" />
                        </div>
                      </div>
                      <div className="text-center mb-2">
                        <div className="text-sm mb-1">{sortedUsers[2].name}</div>
                        <div className="text-2xl text-orange-700">
                          {sortBy === "rating" && `${sortedUsers[2].rating}`}
                          {sortBy === "likes" && sortedUsers[2].totalLikes.toLocaleString()}
                          {sortBy === "followers" && sortedUsers[2].followers.toLocaleString()}
                          {sortBy === "posts" && sortedUsers[2].postsCount}
                        </div>
                      </div>
                      <div className="w-32 h-20 bg-gradient-to-t from-orange-500 to-orange-400 rounded-t-lg flex items-center justify-center">
                        <span className="text-3xl text-white">3</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Rest of List */}
              <div className="divide-y divide-gray-200">
                {sortedUsers.slice(3).map((user, index) => (
                  <div
                    key={user.id}
                    className="p-4 hover:bg-gray-50 transition-colors flex items-center gap-4"
                  >
                    <div className="size-12 flex items-center justify-center text-xl text-gray-500">
                      #{index + 4}
                    </div>
                    <img
                      src={user.avatar}
                      alt={user.name}
                      className="size-16 rounded-full object-cover"
                    />
                    <div className="flex-1">
                      <h3 className="mb-1">{user.name}</h3>
                      <div className="flex items-center gap-4 text-sm text-gray-600">
                        {user.location && (
                          <div className="flex items-center gap-1">
                            <MapPin className="size-4" />
                            <span>{user.location.name}</span>
                          </div>
                        )}
                        <div className="flex items-center gap-1">
                          <Globe className="size-4" />
                          <span>{user.countriesVisited} улс</span>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl mb-1 text-gray-900">
                        {sortBy === "rating" && `${user.rating}`}
                        {sortBy === "likes" && user.totalLikes.toLocaleString()}
                        {sortBy === "followers" && user.followers.toLocaleString()}
                        {sortBy === "posts" && user.postsCount}
                      </div>
                      <div className="text-sm text-gray-500">
                        {sortBy === "rating" && "оноо"}
                        {sortBy === "likes" && "таалагдсан"}
                        {sortBy === "followers" && "дагагч"}
                        {sortBy === "posts" && "нийтлэл"}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Global Map */}
            <div className="bg-white rounded-xl shadow-lg overflow-hidden">
              <div className="p-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
                <h3 className="text-lg">Блогеруудын байршил</h3>
              </div>
              <div className="relative aspect-square bg-gradient-to-br from-blue-100 to-green-100">
                <img
                  src="https://images.unsplash.com/photo-1642009071428-119813340e22?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3b3JsZCUyMG1hcCUyMHRyYXZlbCUyMHBpbnN8ZW58MXx8fHwxNzY2MzQ3OTY4fDA&ixlib=rb-4.1.0&q=80&w=1080"
                  alt="World Map"
                  className="absolute inset-0 w-full h-full object-cover opacity-60"
                />
                {sortedUsers
                  .filter((user) => user.location)
                  .map((user, index) => {
                    const pos = getMapPosition(user.location!.lat, user.location!.lng);
                    return (
                      <div
                        key={user.id}
                        className="absolute group"
                        style={{
                          top: pos.y,
                          left: pos.x,
                          transform: "translate(-50%, -50%)",
                        }}
                      >
                        <div className="relative">
                          <img
                            src={user.avatar}
                            alt={user.name}
                            className="size-8 rounded-full border-2 border-white shadow-lg object-cover hover:scale-125 transition-transform"
                          />
                          {index < 3 && getMedalIcon(index) && (
                            <div className="absolute -top-1 -right-1">
                              {getMedalIcon(index)}
                            </div>
                          )}
                        </div>
                        <div className="absolute top-full mt-2 left-1/2 -translate-x-1/2 bg-white px-3 py-2 rounded-lg shadow-xl whitespace-nowrap z-10 border border-gray-200 opacity-0 group-hover:opacity-100 transition-opacity">
                          <div className="text-sm">{user.name}</div>
                          <div className="text-xs text-gray-500">{user.location?.name}</div>
                        </div>
                      </div>
                    );
                  })}
              </div>
            </div>

            {/* Stats Card */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-lg mb-4">Нийт статистик</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-gray-600">
                    <Users className="size-5" />
                    <span>Нийт блогер</span>
                  </div>
                  <span className="text-gray-900 text-xl">{leaderboardUsers.length}</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-gray-600">
                    <BookOpen className="size-5" />
                    <span>Нийт нийтлэл</span>
                  </div>
                  <span className="text-gray-900 text-xl">
                    {leaderboardUsers.reduce((sum, u) => sum + u.postsCount, 0)}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-gray-600">
                    <Heart className="size-5" />
                    <span>Нийт таалагдсан</span>
                  </div>
                  <span className="text-gray-900 text-xl">
                    {leaderboardUsers.reduce((sum, u) => sum + u.totalLikes, 0).toLocaleString()}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-gray-600">
                    <Globe className="size-5" />
                    <span>Нийт улс</span>
                  </div>
                  <span className="text-gray-900 text-xl">
                    {leaderboardUsers.reduce((sum, u) => sum + u.countriesVisited, 0)}
                  </span>
                </div>
              </div>
            </div>

            {/* CTA */}
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl shadow-lg p-6 text-white text-center">
              <Trophy className="size-12 mx-auto mb-4" />
              <h3 className="text-xl mb-2">Та ч нэгдээрэй!</h3>
              <p className="text-blue-100 mb-4 text-sm">
                Аяллынхаа түүхийг хуваалцаж, эрхлэгчдийн жагсаалтад орцгооё
              </p>
              <Link href="/register"
                className="w-full py-3 bg-white text-blue-600 rounded-lg hover:bg-blue-50 transition-colors"
              >
                Бүртгүүлэх
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
