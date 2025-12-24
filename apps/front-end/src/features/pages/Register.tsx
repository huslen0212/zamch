'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useMemo, useState } from 'react';
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  User,
  AlertCircle,
  CheckCircle,
  MapPin,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export function Register() {
  const router = useRouter();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [locationName, setLocationName] = useState('');
  const [selectedLocation, setSelectedLocation] = useState<{
    name: string;
    lat: number;
    lng: number;
  } | null>(null);

  const { register } = useAuth();

  const popularLocations = useMemo(
    () => [
      { name: 'Улаанбаатар', lat: 47.8864, lng: 106.9057 },
      { name: 'Токио', lat: 35.6762, lng: 139.6503 },
      { name: 'Нью-Йорк', lat: 40.7128, lng: -74.006 },
      { name: 'Лондон', lat: 51.5074, lng: -0.1278 },
      { name: 'Парис', lat: 48.8566, lng: 2.3522 },
      { name: 'Сеул', lat: 37.5665, lng: 126.978 },
      { name: 'Дубай', lat: 25.2048, lng: 55.2708 },
      { name: 'Сингапур', lat: 1.3521, lng: 103.8198 },
    ],
    [],
  );

  const filteredLocations = useMemo(() => {
    if (!locationName.trim()) return popularLocations;
    const q = locationName.toLowerCase();
    return popularLocations.filter((l) => l.name.toLowerCase().includes(q));
  }, [locationName, popularLocations]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError('Нууц үг таарахгүй байна');
      return;
    }

    setLoading(true);

    const result = await register(
      name,
      email,
      password,
      selectedLocation || undefined,
    );

    if (result.success) {
      router.push('/');
    } else {
      // 🔥 backend-ээс ирсэн алдаа энд харагдана
      setError(result.message);
    }

    setLoading(false);
  };

  const passwordStrength =
    password.length >= 8
      ? 'Хүчтэй'
      : password.length >= 6
        ? 'Дундаж'
        : password.length > 0
          ? 'Сул'
          : '';

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 flex items-center justify-center px-4 py-12">
      <div className="max-w-md w-full">
        {/* Logo & Title */}
        <div className="text-center mb-8">
          <div className="inline-block p-4 bg-purple-600 rounded-full mb-4">
            <User className="size-8 text-white" />
          </div>
          <h1 className="text-3xl mb-2">Бүртгүүлэх</h1>
          <p className="text-gray-600">Wanderlust нийгэмлэгт нэгдээрэй</p>
        </div>

        {/* Register Form */}
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <form onSubmit={handleSubmit} className="space-y-5">
            {error && (
              <div className="flex items-center gap-2 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
                <AlertCircle className="size-5 flex-shrink-0" />
                <span className="text-sm">{error}</span>
              </div>
            )}

            {/* Name */}
            <div>
              <label
                htmlFor="name"
                className="block text-sm mb-2 text-gray-700"
              >
                Нэр
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 size-5 text-gray-400" />
                <input
                  id="name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  placeholder="Таны нэр"
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent outline-none"
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <label
                htmlFor="email"
                className="block text-sm mb-2 text-gray-700"
              >
                И-мэйл хаяг
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 size-5 text-gray-400" />
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="example@email.com"
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent outline-none"
                />
              </div>
            </div>

            {/* Location */}
            <div>
              <label className="block text-sm mb-2 text-gray-700">
                Байршил
              </label>
              <div className="relative">
                <MapPin className="absolute left-3 top-3 size-5 text-gray-400" />
                <input
                  type="text"
                  value={locationName}
                  onChange={(e) => {
                    setLocationName(e.target.value);
                    setSelectedLocation(null);
                  }}
                  placeholder="Хот сонгох"
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent outline-none"
                />
              </div>

              <div className="mt-2 grid grid-cols-2 gap-2">
                {filteredLocations.map((loc) => {
                  const isSelected = selectedLocation?.name === loc.name;
                  return (
                    <button
                      key={loc.name}
                      type="button"
                      onClick={() => {
                        setSelectedLocation(loc);
                        setLocationName(loc.name);
                      }}
                      className={`flex items-center gap-2 px-3 py-2 rounded-lg border transition-colors text-left ${
                        isSelected
                          ? 'border-purple-600 bg-purple-50'
                          : 'border-gray-200 hover:bg-gray-50'
                      }`}
                    >
                      <MapPin
                        className={`size-4 ${isSelected ? 'text-purple-600' : 'text-gray-400'}`}
                      />
                      <span className="text-sm text-gray-800">{loc.name}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Password */}
            <div>
              <label
                htmlFor="password"
                className="block text-sm mb-2 text-gray-700"
              >
                Нууц үг
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 size-5 text-gray-400" />
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  placeholder="••••••••"
                  className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent outline-none"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  aria-label="Toggle password visibility"
                >
                  {showPassword ? (
                    <EyeOff className="size-5" />
                  ) : (
                    <Eye className="size-5" />
                  )}
                </button>
              </div>

              {passwordStrength && (
                <div className="mt-2 flex items-center gap-2 text-sm">
                  <CheckCircle
                    className={`size-4 ${password.length >= 6 ? 'text-green-600' : 'text-gray-400'}`}
                  />
                  <span className="text-gray-600">Нууц үгийн хүч: </span>
                  <span
                    className={`$${
                      passwordStrength === 'Хүчтэй'
                        ? 'text-green-600'
                        : passwordStrength === 'Дундаж'
                          ? 'text-yellow-600'
                          : 'text-red-600'
                    }`}
                  >
                    {passwordStrength}
                  </span>
                </div>
              )}
            </div>

            {/* Confirm Password */}
            <div>
              <label
                htmlFor="confirmPassword"
                className="block text-sm mb-2 text-gray-700"
              >
                Нууц үг давтах
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 size-5 text-gray-400" />
                <input
                  id="confirmPassword"
                  type={showPassword ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  placeholder="••••••••"
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent outline-none"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <div className="size-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Бүртгэж байна...</span>
                </>
              ) : (
                <>
                  <User className="size-5" />
                  <span>Бүртгүүлэх</span>
                </>
              )}
            </button>
          </form>

          <div className="text-center mt-6">
            <span className="text-gray-600">Аль хэдийн бүртгэлтэй юу? </span>
            <Link
              href="/login"
              className="text-purple-600 hover:text-purple-700"
            >
              Нэвтрэх
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
