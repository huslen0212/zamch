'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import {
  Image,
  MapPin,
  Save,
  X,
  Upload,
  FileText,
  Tag,
  Globe,
  CheckCircle,
  AlertCircle,
  Loader2
} from 'lucide-react';
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
  const [category, setCategory] = useState('Говь цөл');
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
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center px-4">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-2xl p-8 text-center">
          <div className="size-20 bg-gradient-to-br from-blue-600 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <FileText className="size-10 text-white" />
          </div>
          <h2 className="text-2xl font-bold mb-2">Нэвтрэх шаардлагатай</h2>
          <p className="text-gray-600 mb-6">
            Нийтлэл бичихийн тулд эхлээд нэвтэрнэ үү
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

  const isFormValid = title && excerpt && content && category && location && imageUrl;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 shadow-sm sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-start gap-3">
              <div className="p-2 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg">
                <FileText className="size-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
                  Шинэ нийтлэл бичих
                </h1>
                <p className="text-sm sm:text-base text-gray-600 mt-1">
                  Өөрийн аяллын түүхээ хуваалцаарай, {user?.name}
                </p>
              </div>
            </div>
            <Link
              href="/profile"
              className="w-full sm:w-auto px-4 py-2 border-2 border-gray-300 rounded-lg hover:border-gray-400 hover:bg-gray-50 transition-all text-center font-medium"
            >
              Буцах
            </Link>
          </div>
        </div>
      </div>

      {/* Form */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-12">
        {message && (
          <div
            className={`rounded-xl px-4 py-3 mb-6 text-sm font-medium flex items-center gap-3 shadow-lg animate-slideDown ${
              messageType === 'success'
                ? 'bg-green-50 text-green-700 border-2 border-green-200'
                : 'bg-red-50 text-red-700 border-2 border-red-200'
            }`}
          >
            {messageType === 'success' ? (
              <CheckCircle className="size-5 shrink-0" />
            ) : (
              <AlertCircle className="size-5 shrink-0" />
            )}
            <span>{message}</span>
          </div>
        )}

        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Title */}
              <div className="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow p-4 sm:p-6">
                <label htmlFor="title" className="flex items-center gap-2 mb-3 text-gray-700 font-medium">
                  <FileText className="size-5 text-blue-600" />
                  Гарчиг <span className="text-red-500">*</span>
                </label>
                <input
                  id="title"
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Таны аяллын түүхийн гарчиг..."
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-blue-600 outline-none text-lg sm:text-xl transition-all"
                />
                <div className="mt-2 text-xs text-gray-500">
                  {title.length}/100 тэмдэгт
                </div>
              </div>

              {/* Excerpt */}
              <div className="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow p-4 sm:p-6">
                <label htmlFor="excerpt" className="flex items-center gap-2 mb-3 text-gray-700 font-medium">
                  <Tag className="size-5 text-purple-600" />
                  Товч тайлбар <span className="text-red-500">*</span>
                </label>
                <textarea
                  id="excerpt"
                  value={excerpt}
                  onChange={(e) => setExcerpt(e.target.value)}
                  rows={3}
                  maxLength={200}
                  placeholder="2-3 өгүүлбэрт нийтлэлийн агуулгыг товч танилцуулна уу..."
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-blue-600 outline-none resize-none transition-all"
                />
                <div className="mt-2 flex justify-between items-center">
                  <span className="text-xs text-gray-500">Товч тайлбар нь нийтлэлийн хамгийн чухал хэсэг</span>
                  <span className={`text-xs font-medium ${excerpt.length > 180 ? 'text-red-500' : 'text-gray-500'}`}>
                    {excerpt.length}/200
                  </span>
                </div>
              </div>

              {/* Content */}
              <div className="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow p-4 sm:p-6">
                <label htmlFor="content" className="flex items-center gap-2 mb-3 text-gray-700 font-medium">
                  <FileText className="size-5 text-green-600" />
                  Нийтлэлийн агуулга <span className="text-red-500">*</span>
                </label>
                <textarea
                  id="content"
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  rows={12}
                  placeholder="Өөрийн аяллын түүх, туршлагаа дэлгэрэнгүй бичнэ үү..."
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-blue-600 outline-none resize-none transition-all"
                />
                <div className="mt-2 text-xs text-gray-500">
                  {content.split(/\s+/).filter(Boolean).length} үг
                </div>
              </div>

              {/* Image */}
              <div className="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow p-4 sm:p-6">
                <label className="flex items-center gap-2 mb-3 text-gray-700 font-medium">
                  <Image className="size-5 text-pink-600" />
                  Үндсэн зураг <span className="text-red-500">*</span>
                </label>
                <div className="space-y-4">
                  <div className="relative">
                    <input
                      type="url"
                      value={imageUrl}
                      onChange={(e) => setImageUrl(e.target.value)}
                      placeholder="Зургийн URL оруулах (https://...)"
                      className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-blue-600 outline-none transition-all"
                    />
                    <Upload className="absolute left-3 top-1/2 -translate-y-1/2 size-5 text-gray-400" />
                  </div>

                  {imageUrl ? (
                    <div className="relative aspect-video rounded-lg overflow-hidden border-2 border-gray-200 group">
                      <img
                        src={imageUrl}
                        alt="Preview"
                        className="w-full h-full object-cover"
                        onError={() => setImageUrl('')}
                      />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <button
                          type="button"
                          onClick={() => setImageUrl('')}
                          className="p-3 bg-red-600 text-white rounded-full hover:bg-red-700 transition-all shadow-lg"
                        >
                          <X className="size-5" />
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="aspect-video border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center gap-3 text-gray-400 hover:border-blue-400 hover:text-blue-400 transition-all">
                      <Image className="size-12 sm:size-16" />
                      <span className="text-sm sm:text-base">Зураг оруулна уу</span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Category */}
              <div className="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow p-4 sm:p-6 lg:sticky lg:top-24">
                <label className="flex items-center gap-2 mb-4 text-gray-700 font-medium">
                  <Tag className="size-5 text-orange-600" />
                  Ангилал <span className="text-red-500">*</span>
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {categories.map((cat) => (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => setCategory(cat)}
                      className={`px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                        category === cat
                          ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg scale-105'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200 hover:scale-105'
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              {/* Location */}
              <div className="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow p-4 sm:p-6">
                <label className="flex items-center gap-2 mb-4 text-gray-700 font-medium">
                  <MapPin className="size-5 text-red-600" />
                  Газар байршил <span className="text-red-500">*</span>
                </label>

                <input
                  type="text"
                  value={locationName}
                  onChange={(e) => setLocationName(e.target.value)}
                  placeholder="Газрын нэр хайх..."
                  className="w-full px-4 py-2.5 mb-4 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-blue-600 outline-none transition-all"
                />

                <div className="text-sm text-gray-600 mb-3 flex items-center gap-2">
                  <Globe className="size-4" />
                  Алдартай газрууд:
                </div>

                <div className="space-y-1 max-h-64 overflow-y-auto custom-scrollbar">
                  {popularLocations
                    .filter(loc =>
                      locationName === '' ||
                      loc.name.toLowerCase().includes(locationName.toLowerCase())
                    )
                    .map((loc) => (
                      <button
                        key={loc.name}
                        type="button"
                        onClick={() => {
                          setLocation(loc);
                          setLocationName(loc.name);
                        }}
                        className={`w-full px-3 py-2.5 text-left text-sm rounded-lg transition-all flex items-center justify-between ${
                          location?.name === loc.name
                            ? 'bg-blue-50 text-blue-600 border-2 border-blue-200 font-medium'
                            : 'hover:bg-gray-50 border-2 border-transparent'
                        }`}
                      >
                        <span>{loc.name}</span>
                        {location?.name === loc.name && (
                          <CheckCircle className="size-4" />
                        )}
                      </button>
                    ))}
                </div>

                {location && (
                  <div className="mt-4 p-3 bg-green-50 border-2 border-green-200 rounded-lg text-sm text-green-700 flex items-center gap-2">
                    <CheckCircle className="size-5 shrink-0" />
                    <div>
                      <div className="font-medium">{location.name} сонгогдлоо</div>
                      <div className="text-xs text-green-600 mt-0.5">
                        {location.lat.toFixed(4)}, {location.lng.toFixed(4)}
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Progress Indicator */}
              <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl shadow-md p-4 sm:p-6 border-2 border-blue-100">
                <h3 className="text-sm font-medium text-gray-700 mb-3">Гүйцэтгэл</h3>
                <div className="space-y-2">
                  {[
                    { label: 'Гарчиг', done: !!title },
                    { label: 'Товч тайлбар', done: !!excerpt },
                    { label: 'Агуулга', done: !!content },
                    { label: 'Ангилал', done: !!category },
                    { label: 'Байршил', done: !!location },
                    { label: 'Зураг', done: !!imageUrl }
                  ].map((item, i) => (
                    <div key={i} className="flex items-center gap-2 text-sm">
                      <div className={`size-5 rounded-full flex items-center justify-center ${
                        item.done ? 'bg-green-500' : 'bg-gray-300'
                      }`}>
                        {item.done && <CheckCircle className="size-3 text-white" />}
                      </div>
                      <span className={item.done ? 'text-green-700 font-medium' : 'text-gray-500'}>
                        {item.label}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Save Button */}
              <button
                type="button"
                onClick={handleSubmit}
                disabled={saving || !isFormValid}
                className="w-full flex items-center justify-center gap-2 py-3.5 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all disabled:from-gray-400 disabled:to-gray-400 disabled:cursor-not-allowed font-medium shadow-lg hover:shadow-xl disabled:shadow-none text-base sm:text-lg"
              >
                {saving ? (
                  <>
                    <Loader2 className="size-5 animate-spin" />
                    <span>Хадгалж байна...</span>
                  </>
                ) : (
                  <>
                    <Save className="size-5" />
                    <span>Нийтлэл хадгалах</span>
                  </>
                )}
              </button>

              {!isFormValid && !saving && (
                <p className="text-xs text-center text-gray-500">
                  * Бүх талбарыг бөглөнө үү
                </p>
              )}
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #f1f1f1;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #cbd5e1;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #94a3b8;
        }
        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-slideDown {
          animation: slideDown 0.3s ease-out;
        }
      `}</style>
    </div>
  );
}
