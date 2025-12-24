'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { Image as ImageIcon, MapPin, Save, X } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

interface Location {
  name: string;
  lat: number;
  lng: number;
}

type MessageType = 'success' | 'error' | null;

export function CreatePost() {
  const router = useRouter();
  const { user, isAuthenticated } = useAuth();

  const [title, setTitle] = useState('');
  const [excerpt, setExcerpt] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState('Далай');
  const [location, setLocation] = useState<Location | null>(null);
  const [locationName, setLocationName] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [saving, setSaving] = useState(false);

  const [message, setMessage] = useState<string | null>(null);
  const [messageType, setMessageType] = useState<MessageType>(null);

  // Popular locations
  const popularLocations: Location[] = [
    { name: 'Архангай', lat: 47.8971, lng: 100.724 },
    { name: 'Баян-Өлгий', lat: 48.9683, lng: 89.9625 },
    { name: 'Баянхонгор', lat: 46.1944, lng: 100.718 },
    { name: 'Булган', lat: 48.8119, lng: 103.533 },
    { name: 'Говь-Алтай', lat: 45.802, lng: 95.866 },
    { name: 'Говьсүмбэр', lat: 46.36, lng: 108.356 },
    { name: 'Дархан-Уул', lat: 49.486, lng: 105.922 },
    { name: 'Дорноговь', lat: 44.419, lng: 109.001 },
    { name: 'Дорнод', lat: 48.079, lng: 114.535 },
    { name: 'Дундговь', lat: 45.582, lng: 106.764 },
    { name: 'Завхан', lat: 48.238, lng: 96.07 },
    { name: 'Орхон', lat: 49.027, lng: 104.044 },
    { name: 'Өвөрхангай', lat: 46.263, lng: 102.775 },
    { name: 'Өмнөговь', lat: 43.012, lng: 106.463 },
    { name: 'Сүхбаатар', lat: 46.205, lng: 113.285 },
    { name: 'Сэлэнгэ', lat: 50.242, lng: 106.207 },
    { name: 'Төв', lat: 47.212, lng: 106.415 },
    { name: 'Увс', lat: 49.644, lng: 93.273 },
    { name: 'Ховд', lat: 48.005, lng: 91.642 },
    { name: 'Хөвсгөл', lat: 49.63, lng: 100.162 },
    { name: 'Хэнтий', lat: 47.608, lng: 109.938 },
  ];

  const categories = ['Говь цөл', 'Уул', 'Хангай', 'Нуур'];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage(null);
    setMessageType(null);

    try {
      const token = localStorage.getItem('token');

      const res = await fetch('http://localhost:3001/posts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          title,
          excerpt,
          content,
          category,
          imageUrl,
          location,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setMessageType('error');
        setMessage(data.message || 'Нийтлэл хадгалах үед алдаа гарлаа');
        return;
      }

      setMessageType('success');
      setMessage('🎉 Нийтлэл амжилттай хадгалагдлаа!');

      // 1.5 секундийн дараа profile руу
      setTimeout(() => {
        router.push('/profile');
      }, 1500);
    } catch (error) {
      console.error(error);
      setMessageType('error');
      setMessage('🚫 Сервертэй холбогдож чадсангүй');
    } finally {
      setSaving(false);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center">
          <div className="size-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <MapPin className="size-8 text-blue-600" />
          </div>
          <h2 className="text-2xl mb-4">Нэвтрэх шаардлагатай</h2>
          <p className="text-gray-600 mb-6">
            Нийтлэл бичихийн тулд эхлээд нэвтэрнэ үү
          </p>
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
              <p className="text-gray-600">
                Өөрийн аяллын түүхээ хуваалцаарай, {user?.name}
              </p>
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
        {message && (
          <div
            className={`rounded-lg px-4 py-3 mb-6 text-sm font-medium ${
              messageType === 'success'
                ? 'bg-green-50 text-green-700 border border-green-200'
                : 'bg-red-50 text-red-700 border border-red-200'
            }`}
          >
            {message}
          </div>
        )}

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
                <div className="mt-2 text-sm text-gray-500 text-right">
                  {excerpt.length} / 200
                </div>
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
                <label className="block mb-2 text-gray-700">
                  Үндсэн зураг *
                </label>
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
                      <img
                        src={imageUrl}
                        alt="Preview"
                        className="w-full h-full object-cover"
                      />
                      <button
                        type="button"
                        onClick={() => setImageUrl('')}
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
                        category === cat
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
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
                <div className="text-sm text-gray-600 mb-2">
                  Алдартай газрууд:
                </div>
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
                        location?.name === loc.name
                          ? 'bg-blue-50 text-blue-600'
                          : 'hover:bg-gray-50'
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
