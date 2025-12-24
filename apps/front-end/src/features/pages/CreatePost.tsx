"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Image as ImageIcon, MapPin, Save, X } from "lucide-react";
import { useAuth } from "../../context/AuthContext";

interface Location {
  name: string;
  lat: number;
  lng: number;
}

export function CreatePost() {
  const router = useRouter();
  const { user, isAuthenticated } = useAuth();

  const [title, setTitle] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [content, setContent] = useState("");
  const [category, setCategory] = useState("Далай");
  const [location, setLocation] = useState<Location | null>(null);
  const [locationName, setLocationName] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [saving, setSaving] = useState(false);

  // Popular locations
  const popularLocations: Location[] = [
    { name: "Мальдив", lat: 3.2028, lng: 73.2207 },
    { name: "Парис", lat: 48.8566, lng: 2.3522 },
    { name: "Токио", lat: 35.6762, lng: 139.6503 },
    { name: "Нью-Йорк", lat: 40.7128, lng: -74.006 },
    { name: "Лондон", lat: 51.5074, lng: -0.1278 },
    { name: "Барселона", lat: 41.3851, lng: 2.1734 },
    { name: "Бали", lat: -8.3405, lng: 115.092 },
    { name: "Дубай", lat: 25.2048, lng: 55.2708 },
  ];

  const categories = ["Далай", "Уул", "Соёл", "Хот", "Адал явдал", "Байгаль"];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    // Mock save - API-р орлуулах боломжтой
    setTimeout(() => {
      setSaving(false);
      alert("Нийтлэл амжилттай хадгалагдлаа!");
      router.push("/");
    }, 1500);
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center">
          <div className="size-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <MapPin className="size-8 text-blue-600" />
          </div>
          <h2 className="text-2xl mb-4">Нэвтрэх шаардлагатай</h2>
          <p className="text-gray-600 mb-6">Нийтлэл бичихийн тулд эхлээд нэвтэрнэ үү</p>
          <Link
            href="/login"
            className="block w-full py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Нэвтрэх
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl mb-2">Шинэ нийтлэл бичих</h1>
              <p className="text-gray-600">Өөрийн аяллын түүхээ хуваалцаарай, {user?.name}</p>
            </div>
            <div className="flex items-center gap-3">
              <Link
                href="/"
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Цуцлах
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Form */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Title */}
              <div className="bg-white rounded-xl shadow-md p-6">
                <label htmlFor="title" className="block mb-2 text-gray-700">
                  Гарчиг *
                </label>
                <input
                  id="title"
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                  placeholder="Таны аяллын түүхийн гарчиг..."
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none text-xl"
                />
              </div>

              {/* Excerpt */}
              <div className="bg-white rounded-xl shadow-md p-6">
                <label htmlFor="excerpt" className="block mb-2 text-gray-700">
                  Товч тайлбар *
                </label>
                <textarea
                  id="excerpt"
                  value={excerpt}
                  onChange={(e) => setExcerpt(e.target.value)}
                  required
                  rows={3}
                  placeholder="2-3 өгүүлбэрт нийтлэлийн агуулгыг товч танилцуулна уу..."
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none resize-none"
                />
                <div className="mt-2 text-sm text-gray-500 text-right">{excerpt.length} / 200</div>
              </div>

              {/* Content */}
              <div className="bg-white rounded-xl shadow-md p-6">
                <label htmlFor="content" className="block mb-2 text-gray-700">
                  Нийтлэлийн агуулга *
                </label>
                <textarea
                  id="content"
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  required
                  rows={12}
                  placeholder="Өөрийн аяллын түүх, туршлагаа дэлгэрэнгүй бичнэ үү..."
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none resize-none"
                />
              </div>

              {/* Image */}
              <div className="bg-white rounded-xl shadow-md p-6">
                <label className="block mb-2 text-gray-700">Үндсэн зураг *</label>
                <div className="space-y-4">
                  <input
                    type="url"
                    value={imageUrl}
                    onChange={(e) => setImageUrl(e.target.value)}
                    placeholder="Зургийн URL оруулах эсвэл Unsplash-аас сонгоно уу"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none"
                  />
                  {imageUrl ? (
                    <div className="relative aspect-video rounded-lg overflow-hidden border border-gray-200">
                      <img src={imageUrl} alt="Preview" className="w-full h-full object-cover" />
                      <button
                        type="button"
                        onClick={() => setImageUrl("")}
                        className="absolute top-2 right-2 p-2 bg-red-600 text-white rounded-full hover:bg-red-700 transition-colors"
                      >
                        <X className="size-4" />
                      </button>
                    </div>
                  ) : (
                    <div className="aspect-video border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center gap-2 text-gray-400">
                      <ImageIcon className="size-12" />
                      <span>Зураг оруулна уу</span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Category */}
              <div className="bg-white rounded-xl shadow-md p-6">
                <label className="block mb-3 text-gray-700">Ангилал *</label>
                <div className="grid grid-cols-2 gap-2">
                  {categories.map((cat) => (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => setCategory(cat)}
                      className={`px-3 py-2 rounded-lg text-sm transition-colors ${
                        category === cat ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              {/* Location */}
              <div className="bg-white rounded-xl shadow-md p-6">
                <label className="block mb-3 text-gray-700">
                  <MapPin className="inline size-5 mr-1" />
                  Газар байршил *
                </label>
                <input
                  type="text"
                  value={locationName}
                  onChange={(e) => setLocationName(e.target.value)}
                  placeholder="Газрын нэр"
                  className="w-full px-4 py-2 mb-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none"
                />
                <div className="text-sm text-gray-600 mb-2">Алдартай газрууд:</div>
                <div className="space-y-1 max-h-48 overflow-y-auto">
                  {popularLocations.map((loc) => (
                    <button
                      key={loc.name}
                      type="button"
                      onClick={() => {
                        setLocation(loc);
                        setLocationName(loc.name);
                      }}
                      className={`w-full px-3 py-2 text-left text-sm rounded-lg transition-colors ${
                        location?.name === loc.name ? "bg-blue-50 text-blue-600" : "hover:bg-gray-50"
                      }`}
                    >
                      {loc.name}
                    </button>
                  ))}
                </div>
                {location && (
                  <div className="mt-3 p-3 bg-green-50 border border-green-200 rounded-lg text-sm text-green-700">
                    ✓ {location.name} сонгогдлоо
                  </div>
                )}
              </div>

              {/* Save Button */}
              <button
                type="submit"
                disabled={saving}
                className="w-full flex items-center justify-center gap-2 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
              >
                {saving ? (
                  <>
                    <div className="size-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Хадгалж байна...</span>
                  </>
                ) : (
                  <>
                    <Save className="size-5" />
                    <span>Нийтлэл хадгалах</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
