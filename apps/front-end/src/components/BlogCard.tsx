"use client";

import Link from "next/link";
import { Calendar, Clock, User, ArrowRight } from "lucide-react";

export interface BlogCardProps {
  id: number;
  image: string;
  category: string;
  title: string;
  excerpt: string;
  author: string;
  date: string;
  readTime: string;
}

export function BlogCard({
  id,
  image,
  category,
  title,
  excerpt,
  author,
  date,
  readTime,
}: BlogCardProps) {
  return (
    <Link
      href={`/blog/${id}`}
      className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-shadow group"
    >
      {/* Image */}
      <div className="aspect-[4/3] overflow-hidden">
        <img
          src={image}
          alt={title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
      </div>

      {/* Content */}
      <div className="p-6">
        {/* Category */}
        <span className="inline-block px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-sm mb-3">
          {category}
        </span>

        {/* Title */}
        <h2 className="text-xl mb-3 line-clamp-2 group-hover:text-blue-600 transition-colors">
          {title}
        </h2>

        {/* Excerpt */}
        <p className="text-gray-600 mb-4 line-clamp-2">{excerpt}</p>

        {/* Meta Info */}
        <div className="flex items-center gap-4 text-sm text-gray-500 mb-4">
          <div className="flex items-center gap-1">
            <User className="size-4" />
            <span>{author}</span>
          </div>
          <div className="flex items-center gap-1">
            <Calendar className="size-4" />
            <span>{date}</span>
          </div>
          <div className="flex items-center gap-1">
            <Clock className="size-4" />
            <span>{readTime}</span>
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
