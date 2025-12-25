"use client";

import Link from "next/link";
import { Calendar, Clock, User, ArrowRight } from "lucide-react";
import { useMemo, useState } from "react";

import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";

dayjs.extend(utc);
dayjs.extend(timezone);

const FALLBACK_IMAGE = "/placeholder.jpg";
const TZ = "Asia/Ulaanbaatar";

export interface BlogCardProps {
  id: number | string;
  image?: string | null;

  category: string;
  title: string;
  excerpt?: string | null;

  author?: string | null;

  // ✅ API чинь createdAt өгч байна, түүнийг ашиглая
  createdAt?: string | null;

  // ❗️Серверээс readTime ирж байж болно, гэхдээ буруу байвал createdAt-аас бодно
  readTime?: string | null;
}

function estimateReadTime(text?: string | null) {
  const t = (text ?? "").trim();
  if (!t) return "1 мин";
  const words = t.split(/\s+/).filter(Boolean).length;
  const mins = Math.max(1, Math.round(words / 200));
  return `${mins} мин`;
}

function formatDateTimeMN(iso?: string | null) {
  if (!iso) return "";
  const d = dayjs(iso);
  if (!d.isValid()) return "";
  // ISO нь Z (UTC) байвал Mongolia timezone руу зөв хөрвүүлнэ
  return d.tz(TZ).format("YYYY-MM-DD HH:mm");
}

function relativeTimeMN(iso?: string | null) {
  if (!iso) return "";
  const d = dayjs(iso);
  if (!d.isValid()) return "";

  const now = dayjs();
  let diffMs = now.valueOf() - d.valueOf();
  if (diffMs < 0) diffMs = 0;

  const minutes = Math.floor(diffMs / (1000 * 60));
  const hours = Math.floor(diffMs / (1000 * 60 * 60));
  const days = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (minutes < 1) return "Дөнгөж сая";
  if (minutes < 60) return `${minutes} минутын өмнө`;
  if (hours < 24) return `${hours} цагийн өмнө`;
  return `${days} өдрийн өмнө`;
}

export function BlogCard({
                           id,
                           image,
                           category,
                           title,
                           excerpt,
                           author,
                           createdAt,
                           readTime,
                         }: BlogCardProps) {
  const [imgSrc, setImgSrc] = useState<string>(() => {
    const s = (image ?? "").trim();
    return s ? s : FALLBACK_IMAGE;
  });

  const safeAuthor = (author ?? "").trim() || "Нэргүй";
  const safeExcerpt = (excerpt ?? "").trim();
  const safeCategory = (category ?? "").trim() || "Ангилалгүй";

  // ✅ createdAt-аас яг огноо/цаг (UB timezone)
  const formattedDateTime = useMemo(() => {
    return formatDateTimeMN(createdAt);
  }, [createdAt]);

  // ✅ createdAt-аас relative time (серверийн readTime буруу байж болох тул)
  const relative = useMemo(() => {
    // хэрвээ createdAt байхгүй бол fallback болгож readTime хэрэглэе
    if (!createdAt) return (readTime ?? "").trim();
    return relativeTimeMN(createdAt);
  }, [createdAt, readTime]);

  // ✅ “унших хугацаа” (excerpt-ээс)
  const reading = useMemo(() => {
    return `${estimateReadTime(safeExcerpt)} унших`;
  }, [safeExcerpt]);

  return (
    <Link
      href={`/blog/${encodeURIComponent(String(id))}`}
      className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-shadow group block"
    >
      {/* Image */}
      <div className="aspect-[4/3] overflow-hidden bg-gray-100">
        <img
          src={imgSrc}
          alt={title}
          loading="lazy"
          onError={() => {
            if (imgSrc !== FALLBACK_IMAGE) setImgSrc(FALLBACK_IMAGE);
          }}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
      </div>

      {/* Content */}
      <div className="p-6">
        {/* Category */}
        <span className="inline-block px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-sm mb-3">
          {safeCategory}
        </span>

        {/* Title */}
        <h2 className="text-xl font-semibold mb-3 line-clamp-2 group-hover:text-blue-600 transition-colors">
          {title}
        </h2>

        {/* Excerpt */}
        {safeExcerpt ? (
          <p className="text-gray-600 mb-4 line-clamp-2">{safeExcerpt}</p>
        ) : (
          <p className="text-gray-400 mb-4 italic">Тайлбар алга байна</p>
        )}

        {/* Meta Info */}
        <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-gray-500 mb-4">
          <div className="flex items-center gap-1">
            <User className="size-4" />
            <span className="line-clamp-1">{safeAuthor}</span>
          </div>

          {formattedDateTime ? (
            <div className="flex items-center gap-1">
              <Calendar className="size-4" />
              <span>{formattedDateTime}</span>
            </div>
          ) : null}

          {relative ? (
            <div className="flex items-center gap-1">
              <Clock className="size-4" />
              <span>{relative}</span>
            </div>
          ) : null}

          {/* хүсвэл унших хугацааг мөн харуулж болно */}
          <div className="flex items-center gap-1">
            <Clock className="size-4" />
            <span>{reading}</span>
          </div>
        </div>

        {/* Read More Button */}
        <div className="flex items-center gap-2 text-blue-600 group-hover:gap-3 transition-all">
          <span>Дэлгэрэнгүй унших</span>
          <ArrowRight className="size-4" />
        </div>
      </div>
    </Link>
  );
}
