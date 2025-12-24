"use client";
import {Camera, Filter, MapPin, Navigation, Plane, X} from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import {blogPosts} from "../../data/blogPosts";

export function TravelMapNew() {
  const router = useRouter();
  const [selectedLocation, setSelectedLocation] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>("Бүгд");

  // Get unique locations from blog posts
  const locations = blogPosts
    .filter((post) => post.location)
    .map((post) => ({
      ...post.location!,
      posts: blogPosts.filter((p) => p.location?.name === post.location?.name),
    }))
    .filter((loc, index, self) => 
      index === self.findIndex((l) => l.name === loc.name)
    );

  const selectedLoc = locations.find((loc) => loc.name === selectedLocation);
  const selectedLocPosts = selectedLoc?.posts || [];

  // Filter posts by category
  const filteredPosts = selectedCategory === "Бүгд" 
    ? selectedLocPosts 
    : selectedLocPosts.filter((post) => post.category === selectedCategory);

  const categories = ["Бүгд", "Далай", "Уул", "Соёл", "Хот", "Адал явдал", "Байгаль"];

  // Calculate map position for markers
  const getMapPosition = (lat: number, lng: number) => {
    // Simplified map projection (for demo purposes)
    const x = ((lng + 180) / 360) * 100;
    const y = ((90 - lat) / 180) * 100;
    return { x: `${x}%`, y: `${y}%` };
  };

  const totalLocations = locations.length;
  const totalPosts = blogPosts.filter((p) => p.location).length;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="relative h-[300px] flex items-center justify-center bg-gradient-to-r from-green-600 to-blue-600">
        <div className="text-center text-white px-4">
          <Navigation className="size-16 mx-auto mb-4" />
          <h1 className="text-4xl md:text-5xl mb-4">Аяллын газрын зураг</h1>
          <p className="text-xl text-green-100">
            Нийтлэлүүдийг газрын зураг дээр харах
          </p>
        </div>
      </section>

      {/* Stats Bar */}
      <section className="bg-white border-b border-gray-200 sticky top-0 z-20 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-around">
            <div className="text-center">
              <div className="flex items-center justify-center gap-2 mb-1">
                <MapPin className="size-5 text-blue-600" />
                <span className="text-2xl text-gray-900">{totalLocations}</span>
              </div>
              <div className="text-sm text-gray-600">Газар</div>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center gap-2 mb-1">
                <Plane className="size-5 text-blue-600" />
                <span className="text-2xl text-gray-900">{totalPosts}</span>
              </div>
              <div className="text-sm text-gray-600">Нийтлэл</div>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center gap-2 mb-1">
                <Camera className="size-5 text-blue-600" />
                <span className="text-2xl text-gray-900">5000+</span>
              </div>
              <div className="text-sm text-gray-600">Зураг</div>
            </div>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Map Section */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-lg overflow-hidden">
              <div className="p-4 bg-gray-50 border-b border-gray-200">
                <h2 className="text-xl flex items-center gap-2">
                  <MapPin className="size-6 text-blue-600" />
                  Дэлхийн газрын зураг
                </h2>
              </div>
              
              {/* Interactive Map */}
              <div className="relative aspect-[16/10] bg-gradient-to-br from-blue-100 to-green-100">
                <img
                  src="https://images.unsplash.com/photo-1642009071428-119813340e22?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3b3JsZCUyMG1hcCUyMHRyYXZlbCUyMHBpbnN8ZW58MXx8fHwxNzY2MzQ3OTY4fDA&ixlib=rb-4.1.0&q=80&w=1080"
                  alt="World Map"
                  className="absolute inset-0 w-full h-full object-cover opacity-60"
                />
                
                {/* Destination Markers */}
                {locations.map((location) => {
                  const pos = getMapPosition(location.lat, location.lng);
                  const postCount = location.posts.length;
                  
                  return (
                    <button
                      key={location.name}
                      className="absolute group"
                      style={{
                        top: pos.y,
                        left: pos.x,
                        transform: "translate(-50%, -50%)",
                      }}
                      onClick={() => setSelectedLocation(location.name)}
                    >
                      <div
                        className={`relative transition-all duration-300 ${
                          selectedLocation === location.name
                            ? "scale-150"
                            : "scale-100 group-hover:scale-125"
                        }`}
                      >
                        <MapPin
                          className={`size-8 transition-colors ${
                            selectedLocation === location.name
                              ? "text-red-600 fill-red-600"
                              : "text-blue-600 fill-blue-600"
                          } drop-shadow-lg`}
                        />
                        <div className="absolute -top-1 -right-1 size-5 bg-white rounded-full flex items-center justify-center text-xs border-2 border-blue-600">
                          {postCount}
                        </div>
                      </div>
                      
                      {/* Tooltip */}
                      <div className="absolute top-full mt-2 left-1/2 -translate-x-1/2 bg-white px-3 py-2 rounded-lg shadow-xl whitespace-nowrap z-10 border border-gray-200 opacity-0 group-hover:opacity-100 transition-opacity">
                        <div className="text-sm text-gray-900">{location.name}</div>
                        <div className="text-xs text-gray-500">{postCount} нийтлэл</div>
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Legend */}
              <div className="p-4 bg-gray-50 border-t border-gray-200">
                <div className="flex items-center gap-4 text-sm text-gray-600">
                  <div className="flex items-center gap-2">
                    <MapPin className="size-4 text-blue-600 fill-blue-600" />
                    <span>Газар</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="size-4 text-red-600 fill-red-600" />
                    <span>Сонгогдсон</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="size-4 bg-white rounded-full border-2 border-blue-600 flex items-center justify-center text-xs">
                      3
                    </div>
                    <span>Нийтлэлийн тоо</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Posts Panel */}
          <div className="lg:col-span-1 space-y-6">
            {/* Selected Location Info */}
            {selectedLoc ? (
              <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                <div className="p-4 bg-blue-600 text-white flex items-center justify-between">
                  <div>
                    <h3 className="text-xl">{selectedLoc.name}</h3>
                    <p className="text-blue-100 text-sm">
                      {selectedLoc.posts.length} нийтлэл
                    </p>
                  </div>
                  <button
                    onClick={() => setSelectedLocation(null)}
                    className="p-2 hover:bg-blue-700 rounded-lg transition-colors"
                  >
                    <X className="size-5" />
                  </button>
                </div>

                {/* Category Filter */}
                <div className="p-4 border-b border-gray-200">
                  <div className="flex items-center gap-2 mb-3">
                    <Filter className="size-4 text-gray-500" />
                    <span className="text-sm text-gray-600">Ангилал:</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {categories.map((cat) => (
                      <button
                        key={cat}
                        onClick={() => setSelectedCategory(cat)}
                        className={`px-3 py-1 rounded-full text-sm transition-colors ${
                          selectedCategory === cat
                            ? "bg-blue-600 text-white"
                            : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                        }`}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Posts List */}
                <div className="divide-y divide-gray-200 max-h-[600px] overflow-y-auto">
                  {filteredPosts.length > 0 ? (
                    filteredPosts.map((post) => (
                      <button
                        key={post.id}
                        onClick={() => router.push(`/blog/${post.id}`)}
                        className="w-full p-4 text-left hover:bg-gray-50 transition-colors"
                      >
                        <div className="flex gap-3">
                          <img
                            src={post.image}
                            alt={post.title}
                            className="size-20 rounded-lg object-cover flex-shrink-0"
                          />
                          <div className="flex-1 min-w-0">
                            <span className="inline-block px-2 py-0.5 bg-blue-50 text-blue-600 rounded text-xs mb-1">
                              {post.category}
                            </span>
                            <h4 className="line-clamp-2 mb-1 text-sm">
                              {post.title}
                            </h4>
                            <div className="flex items-center gap-2 text-xs text-gray-500">
                              <span>{post.author}</span>
                              <span>•</span>
                              <span>{post.readTime}</span>
                            </div>
                          </div>
                        </div>
                      </button>
                    ))
                  ) : (
                    <div className="p-8 text-center text-gray-500">
                      <Filter className="size-12 mx-auto mb-3 text-gray-300" />
                      <p>Энэ ангилалд нийтлэл байхгүй</p>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-xl shadow-lg p-8 text-center">
                <MapPin className="size-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-xl mb-2 text-gray-900">
                  Газар сонгоно уу
                </h3>
                <p className="text-gray-600">
                  Газрын зураг дээрх цэг дээр дарж тухайн газрын нийтлэлүүдийг харна уу
                </p>
              </div>
            )}

            {/* All Locations List */}
            <div className="bg-white rounded-xl shadow-lg overflow-hidden">
              <div className="p-4 bg-gray-50 border-b border-gray-200">
                <h3 className="text-lg">Бүх газрууд ({locations.length})</h3>
              </div>
              <div className="divide-y divide-gray-200 max-h-[400px] overflow-y-auto">
                {locations.map((location) => (
                  <button
                    key={location.name}
                    onClick={() => setSelectedLocation(location.name)}
                    className={`w-full p-4 text-left hover:bg-gray-50 transition-colors ${
                      selectedLocation === location.name ? "bg-blue-50" : ""
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <MapPin
                          className={`size-5 ${
                            selectedLocation === location.name
                              ? "text-red-600"
                              : "text-blue-600"
                          }`}
                        />
                        <div>
                          <div className="text-sm">{location.name}</div>
                          <div className="text-xs text-gray-500">
                            {location.posts.length} нийтлэл
                          </div>
                        </div>
                      </div>
                      <div className="size-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-xs">
                        {location.posts.length}
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
