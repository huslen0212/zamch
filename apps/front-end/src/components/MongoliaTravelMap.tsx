"use client";

import "leaflet-defaulticon-compatibility";
import "leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css";

import Link from "next/link";
import { MapContainer, TileLayer, Marker, Popup, CircleMarker } from "react-leaflet";

type HomeLocation = { name: string; lat: number; lng: number };

type PostPin = {
  id: string | number;
  title: string;
  category?: string;
  name: string;
  lat: number;
  lng: number;
  href?: string;
};

const MN_BOUNDS: [[number, number], [number, number]] = [
  [41.5, 87.7],  // South-West (lat, lng)
  [52.2, 119.9], // North-East
];

const UB: [number, number] = [47.918, 106.917]; // Ulaanbaatar center

export function MongoliaTravelMap({
                                    home,
                                    posts,
                                    height = 360,
                                  }: {
  home?: HomeLocation;
  posts: PostPin[];
  height?: number;
}) {
  // Монгол дотор координаттай pin-үүд
  const safePosts = posts.filter(
    (p) =>
      Number.isFinite(p.lat) &&
      Number.isFinite(p.lng) &&
      p.lat >= MN_BOUNDS[0][0] &&
      p.lat <= MN_BOUNDS[1][0] &&
      p.lng >= MN_BOUNDS[0][1] &&
      p.lng <= MN_BOUNDS[1][1]
  );

  const center: [number, number] =
    home?.lat && home?.lng ? [home.lat, home.lng] : UB;

  return (
    <div
      className="rounded-xl overflow-hidden border border-gray-200 shadow-sm"
      style={{ height }}
    >
      <MapContainer
        center={center}
        zoom={5}
        minZoom={4}
        maxZoom={12}
        scrollWheelZoom
        className="h-full w-full"
        maxBounds={MN_BOUNDS}
        maxBoundsViscosity={1.0}
      >
        <TileLayer
          attribution='&copy; OpenStreetMap contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {/* 🏠 Home */}
        {home && (
          <CircleMarker
            center={[home.lat, home.lng]}
            radius={8}
            pathOptions={{ color: "#ef4444", fillColor: "#ef4444", fillOpacity: 0.9 }}
          >
            <Popup>
              <div className="text-sm">
                <div className="font-semibold">🏠 {home.name}</div>
                <div className="text-gray-600 text-xs">
                  {home.lat.toFixed(4)}, {home.lng.toFixed(4)}
                </div>
              </div>
            </Popup>
          </CircleMarker>
        )}

        {/* 📌 Posts */}
        {safePosts.map((p) => (
          <Marker key={String(p.id)} position={[p.lat, p.lng]}>
            <Popup>
              <div className="text-sm">
                <div className="font-semibold">{p.name}</div>
                <div className="text-xs text-gray-600 mt-1">
                  {p.category ? `#${p.category}` : null}
                </div>
                <div className="mt-2">
                  {p.href ? (
                    <Link
                      href={p.href}
                      className="text-blue-600 underline underline-offset-2"
                    >
                      Нийтлэл нээх →
                    </Link>
                  ) : (
                    <span className="text-gray-500 text-xs">{p.title}</span>
                  )}
                </div>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>

      {/* Координатгүй бол тайлбар */}
      {posts.length > 0 && safePosts.length === 0 && (
        <div className="p-3 text-xs text-gray-600 bg-white border-t border-gray-200">
          Координат (lat/lng) байхгүй тул газрын зураг дээр pin харагдахгүй байна.
        </div>
      )}
    </div>
  );
}
