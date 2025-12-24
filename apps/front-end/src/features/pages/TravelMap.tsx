"use client";
import { MapPin, Navigation, Plane, Camera, Star } from "lucide-react";
import { useState } from "react";

export function TravelMap() {
  const destinations = [
    {
      id: 1,
      name: "Мальдив",
      country: "Энэтхэг далай",
      position: { top: "52%", left: "58%" },
      category: "Далай",
      visits: 3,
      rating: 5,
      image: "https://images.unsplash.com/photo-1714412192114-61dca8f15f68?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0cm9waWNhbCUyMGJlYWNoJTIwcGFyYWRpc2V8ZW58MXx8fHwxNzY2MjkzMTc1fDA&ixlib=rb-4.1.0&q=80&w=1080",
      description: "Диваажин далай, цэвэр элс",
    },
    {
      id: 2,
      name: "Швейцарийн Альп",
      country: "Швейцар",
      position: { top: "32%", left: "48%" },
      category: "Уул",
      visits: 2,
      rating: 5,
      image: "https://images.unsplash.com/photo-1635351261340-55f437000b21?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb3VudGFpbiUyMGxhbmRzY2FwZSUyMHN1bnNldHxlbnwxfHx8fDE3NjYzMzU5ODV8MA&ixlib=rb-4.1.0&q=80&w=1080",
      description: "Гайхалтай уулын үзэсгэлэн",
    },
    {
      id: 3,
      name: "Киото",
      country: "Япон",
      position: { top: "38%", left: "78%" },
      category: "Соёл",
      visits: 4,
      rating: 5,
      image: "https://images.unsplash.com/photo-1712244876693-a89f6172178e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxqYXBhbiUyMHRlbXBsZSUyMGNoZXJyeSUyMGJsb3Nzb218ZW58MXx8fHwxNzY2MzQ3Mjg1fDA&ixlib=rb-4.1.0&q=80&w=1080",
      description: "Эртний сүм, сакура цэцэг",
    },
    {
      id: 4,
      name: "Парис",
      country: "Франц",
      position: { top: "33%", left: "46%" },
      category: "Хот",
      visits: 5,
      rating: 5,
      image: "https://images.unsplash.com/photo-1431274172761-fca41d930114?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwYXJpcyUyMGVpZmZlbCUyMHRvd2VyfGVufDF8fHx8MTc2NjI1NTI3M3ww&ixlib=rb-4.1.0&q=80&w=1080",
      description: "Гэрлийн хот, романтик",
    },
    {
      id: 5,
      name: "Гранд Каньон",
      country: "АНУ",
      position: { top: "38%", left: "20%" },
      category: "Адал явдал",
      visits: 2,
      rating: 5,
      image: "https://images.unsplash.com/photo-1650911563224-0c843a6d843e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjYW55b24lMjBkZXNlcnQlMjBhZHZlbnR1cmV8ZW58MXx8fHwxNzY2MzQ3Mjg1fDA&ixlib=rb-4.1.0&q=80&w=1080",
      description: "Зэрлэг байгаль, адал явдал",
    },
    {
      id: 6,
      name: "Исланд",
      country: "Исланд",
      position: { top: "18%", left: "42%" },
      category: "Байгаль",
      visits: 1,
      rating: 5,
      image: "https://images.unsplash.com/photo-1488415032361-b7e238421f1b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxub3J0aGVybiUyMGxpZ2h0cyUyMGljZWxhbmR8ZW58MXx8fHwxNzY2MjQxMzAxfDA&ixlib=rb-4.1.0&q=80&w=1080",
      description: "Хойд гэрэл, байгалийн гайхамшиг",
    },
  ];

  const [selectedDestination, setSelectedDestination] = useState<number | null>(null);
  const [hoveredDestination, setHoveredDestination] = useState<number | null>(null);

  const selectedDest = destinations.find((d) => d.id === selectedDestination);
  const totalCountries = destinations.length;
  const totalVisits = destinations.reduce((sum, d) => sum + d.visits, 0);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="relative h-[300px] flex items-center justify-center bg-gradient-to-r from-green-600 to-blue-600">
        <div className="text-center text-white px-4">
          <Navigation className="size-16 mx-auto mb-4" />
          <h1 className="text-4xl md:text-5xl mb-4">Аяллын газрын зураг</h1>
          <p className="text-xl text-green-100">
            Миний аялсан бүх газрууд нэг дор
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
                <span className="text-2xl text-gray-900">{totalCountries}</span>
              </div>
              <div className="text-sm text-gray-600">Орон</div>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center gap-2 mb-1">
                <Plane className="size-5 text-blue-600" />
                <span className="text-2xl text-gray-900">{totalVisits}</span>
              </div>
              <div className="text-sm text-gray-600">Аялал</div>
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
                {destinations.map((destination) => (
                  <button
                    key={destination.id}
                    className="absolute group"
                    style={{
                      top: destination.position.top,
                      left: destination.position.left,
                      transform: "translate(-50%, -50%)",
                    }}
                    onClick={() => setSelectedDestination(destination.id)}
                    onMouseEnter={() => setHoveredDestination(destination.id)}
                    onMouseLeave={() => setHoveredDestination(null)}
                  >
                    <div
                      className={`relative transition-all duration-300 ${
                        selectedDestination === destination.id
                          ? "scale-150"
                          : hoveredDestination === destination.id
                          ? "scale-125"
                          : "scale-100"
                      }`}
                    >
                      <MapPin
                        className={`size-8 transition-colors ${
                          selectedDestination === destination.id
                            ? "text-red-600 fill-red-600"
                            : "text-blue-600 fill-blue-600"
                        } drop-shadow-lg`}
                      />
                      <div className="absolute -top-1 -right-1 size-5 bg-white rounded-full flex items-center justify-center text-xs border-2 border-blue-600">
                        {destination.visits}
                      </div>
                    </div>
                    
                    {/* Tooltip */}
                    {(hoveredDestination === destination.id || selectedDestination === destination.id) && (
                      <div className="absolute top-full mt-2 left-1/2 -translate-x-1/2 bg-white px-3 py-2 rounded-lg shadow-xl whitespace-nowrap z-10 border border-gray-200">
                        <div className="text-sm text-gray-900">{destination.name}</div>
                        <div className="text-xs text-gray-500">{destination.country}</div>
                      </div>
                    )}
                  </button>
                ))}
              </div>

              {/* Legend */}
              <div className="p-4 bg-gray-50 border-t border-gray-200">
                <div className="flex items-center gap-4 text-sm text-gray-600">
                  <div className="flex items-center gap-2">
                    <MapPin className="size-4 text-blue-600 fill-blue-600" />
                    <span>Аялсан газар</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="size-4 text-red-600 fill-red-600" />
                    <span>Сонгогдсон</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="size-4 bg-white rounded-full border-2 border-blue-600 flex items-center justify-center text-xs">
                      3
                    </div>
                    <span>Аялалын тоо</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Destination Details & List */}
          <div className="lg:col-span-1 space-y-6">
            {/* Selected Destination Card */}
            {selectedDest && (
              <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                <img
                  src={selectedDest.image}
                  alt={selectedDest.name}
                  className="w-full h-48 object-cover"
                />
                <div className="p-6">
                  <span className="inline-block px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-sm mb-3">
                    {selectedDest.category}
                  </span>
                  <h3 className="text-2xl mb-2">{selectedDest.name}</h3>
                  <p className="text-gray-600 mb-4">{selectedDest.country}</p>
                  <p className="text-gray-700 mb-4">{selectedDest.description}</p>
                  
                  <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                    <div className="flex items-center gap-1">
                      <Star className="size-5 text-yellow-500 fill-yellow-500" />
                      <span className="text-gray-900">{selectedDest.rating}.0</span>
                    </div>
                    <div className="text-sm text-gray-600">
                      {selectedDest.visits} удаа айлчилсан
                    </div>
                  </div>
                  
                  <button className="w-full mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                    Дэлгэрэнгүй үзэх
                  </button>
                </div>
              </div>
            )}

            {/* Destinations List */}
            <div className="bg-white rounded-xl shadow-lg overflow-hidden">
              <div className="p-4 bg-gray-50 border-b border-gray-200">
                <h3 className="text-lg">Бүх газрууд ({destinations.length})</h3>
              </div>
              <div className="divide-y divide-gray-200 max-h-[500px] overflow-y-auto">
                {destinations.map((destination) => (
                  <button
                    key={destination.id}
                    onClick={() => setSelectedDestination(destination.id)}
                    className={`w-full p-4 text-left hover:bg-gray-50 transition-colors ${
                      selectedDestination === destination.id ? "bg-blue-50" : ""
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <img
                        src={destination.image}
                        alt={destination.name}
                        className="size-12 rounded-lg object-cover flex-shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="truncate">{destination.name}</h4>
                          <span className="flex-shrink-0 px-2 py-0.5 bg-blue-100 text-blue-600 rounded text-xs">
                            {destination.visits}x
                          </span>
                        </div>
                        <p className="text-sm text-gray-500 truncate">
                          {destination.country}
                        </p>
                      </div>
                      <MapPin
                        className={`size-5 flex-shrink-0 ${
                          selectedDestination === destination.id
                            ? "text-red-600"
                            : "text-gray-400"
                        }`}
                      />
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
