"use client";

import Link from "next/link";
import { Calendar, Clock, User, ArrowRight } from "lucide-react";

interface HeroProps {
  image: string;
  category: string;
  title: string;
  excerpt: string;
  author: string;
  date: string;
  readTime: string;
}

export function Hero({
  image,
  category,
  title,
  excerpt,
  author,
  date,
  readTime,
}: HeroProps) {
  return (
    <section className="relative h-[600px] flex items-center justify-center overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0">
        <img src={image} alt={title} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/20" />
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-white">
        <span className="inline-block px-4 py-2 bg-blue-600 rounded-full mb-4">{category}</span>
        <h1 className="text-4xl md:text-5xl lg:text-6xl mb-6">{title}</h1>
        <p className="text-lg md:text-xl text-gray-200 mb-8 max-w-2xl mx-auto">{excerpt}</p>

        {/* Meta */}
        <div className="flex items-center gap-4 mb-6 text-white/90">
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

        <Link
          href="/blog/1"
          className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors group"
        >
          Унших
          <ArrowRight className="size-5 group-hover:translate-x-1 transition-transform" />
        </Link>
      </div>
    </section>
  );
}
