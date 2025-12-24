"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  Bookmark,
  Calendar,
  Clock,
  Facebook,
  Heart,
  Link as LinkIcon,
  Twitter,
  User,
} from "lucide-react";
import { useMemo, useState } from "react";
import { blogPosts } from "../../data/blogPosts";

export function BlogPost({ postId }: { postId: number }) {
  const router = useRouter();

  const currentBlog = useMemo(() => {
    return blogPosts.find((p) => p.id === postId) || blogPosts[0];
  }, [postId]);

  const relatedPosts = useMemo(() => {
    return blogPosts
      .filter((post) => post.category === currentBlog.category && post.id !== currentBlog.id)
      .slice(0, 2);
  }, [currentBlog]);

  const [isLiked, setIsLiked] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [likes, setLikes] = useState(247);

  const handleLike = () => {
    setLikes((prev) => (isLiked ? prev - 1 : prev + 1));
    setIsLiked((v) => !v);
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Back Button */}
      <div className="bg-gray-50 border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <button
            onClick={() => {
              // router.back() sometimes lands on the same page if opened directly
              // so provide a safe fallback.
              router.back();
            }}
            className="flex items-center gap-2 text-gray-600 hover:text-blue-600 transition-colors"
          >
            <ArrowLeft className="size-5" />
            <span>Буцах</span>
          </button>
          <div className="mt-2 text-sm text-gray-500">
            <Link href="/blogs" className="hover:text-blue-600 transition-colors">
              Бүх нийтлэл рүү очих
            </Link>
          </div>
        </div>
      </div>

      {/* Hero Image */}
      <div className="relative h-[500px] w-full">
        <img src={currentBlog.image} alt={currentBlog.title} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 -mt-32 relative z-10">
        <article className="bg-white rounded-xl shadow-xl p-8 md:p-12">
          {/* Category */}
          <Link
            href={`/category/${encodeURIComponent(categoryToSlug(currentBlog.category))}`}
            className="inline-block px-4 py-2 bg-blue-600 text-white rounded-full mb-4 hover:bg-blue-700 transition-colors"
          >
            {currentBlog.category}
          </Link>

          {/* Title */}
          <h1 className="text-3xl md:text-4xl lg:text-5xl mb-6">{currentBlog.title}</h1>

          {/* Meta Info */}
          <div className="flex flex-wrap items-center gap-6 mb-8 pb-8 border-b border-gray-200">
            <div className="flex items-center gap-2 text-gray-600">
              <User className="size-5" />
              <span>{currentBlog.author}</span>
            </div>
            <div className="flex items-center gap-2 text-gray-600">
              <Calendar className="size-5" />
              <span>{currentBlog.date}</span>
            </div>
            <div className="flex items-center gap-2 text-gray-600">
              <Clock className="size-5" />
              <span>{currentBlog.readTime} унших</span>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-between mb-8 pb-8 border-b border-gray-200">
            <div className="flex items-center gap-4">
              <button
                onClick={handleLike}
                className={`flex items-center gap-2 px-4 py-2 rounded-full transition-colors ${
                  isLiked ? "bg-red-50 text-red-600" : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                <Heart className={`size-5 ${isLiked ? "fill-red-600" : ""}`} />
                <span>{likes}</span>
              </button>
              <button
                onClick={() => setIsSaved((v) => !v)}
                className={`p-2 rounded-full transition-colors ${
                  isSaved ? "bg-blue-50 text-blue-600" : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                <Bookmark className={`size-5 ${isSaved ? "fill-blue-600" : ""}`} />
              </button>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-gray-600 mr-2">Хуваалцах:</span>
              <button className="p-2 bg-gray-100 hover:bg-blue-50 text-gray-700 hover:text-blue-600 rounded-full transition-colors">
                <Facebook className="size-5" />
              </button>
              <button className="p-2 bg-gray-100 hover:bg-blue-50 text-gray-700 hover:text-blue-600 rounded-full transition-colors">
                <Twitter className="size-5" />
              </button>
              <button className="p-2 bg-gray-100 hover:bg-blue-50 text-gray-700 hover:text-blue-600 rounded-full transition-colors">
                <LinkIcon className="size-5" />
              </button>
            </div>
          </div>

          {/* Article Content */}
          <div className="prose prose-lg max-w-none">
            <p>
              Дэлхийн хамгийн үзэсгэлэнтэй газруудын нэг болох энэхүү газар танд мартагдашгүй дурсамж
              бэлэглэх болно. Миний аялал эхлэх үед би хэзээ ч мартахгүй байх адал явдлуудыг олохоо
              мэдсэнгүй.
            </p>

            <h2>Аялал эхэлсэн нь</h2>
            <p>
              Өглөө эрт босоод онгоц буух газар руу явахдаа сэтгэл хөдлөлөө барьж чадахгүй байлаа.
              Энэ бол миний урт хугацаанд мөрөөдөж байсан аялал байсан бөгөөд эцэст нь бодит болж
              байв. Онгоцны цонхоор харахад гайхалтай байгаль надад инээмсэглэж байсан юм шиг
              санагдаж байлаа.
            </p>

            <h2>Хамгийн сайхан мөчүүд</h2>
            <p>
              Энэ аяллын туршид би олон гайхалтай хүмүүстэй танилцаж, өөр өөр соёлыг мэдэрч, шинэ
              хоолнууд амталсан. Гэхдээ хамгийн их дурсамж үлдээсэн нь нарны жаргалтыг уулын
              оргилоос үзэж байсан тэр мөч байлаа.
            </p>

            <blockquote>
              "Аялал бол танд хэзээ ч мартагдахгүй дурсамж, туршлага бэлэглэдэг цорын ганц зүйл юм."
            </blockquote>

            <h2>Зөвлөмж</h2>
            <p>Хэрэв та ийм аялал хийхээр төлөвлөж байгаа бол эдгээр зөвлөмжүүдийг анхаарна уу:</p>
            <ul>
              <li>Өмнө нь бэлтгэл сайн хийгээрэй</li>
              <li>Орон нутгийн соёлыг хүндэтгээрэй</li>
              <li>Шинэ зүйлийг туршиж үзэхээс бүү ай</li>
              <li>Бүх мөчийг сайхан дурсамжаар дүүргээрэй</li>
            </ul>

            <h2>Төгсгөлд</h2>
            <p>
              Энэхүү аялал миний амьдралд маш их өөрчлөлт авчирсан. Би шинэ хүнтэй болж, дэлхийг өөр
              нүдээр харах болсон. Та бүгдэд ч мөн ийм гайхалтай туршлага олохыг хүсч байна. Аялах нь
              амьдрах, амьдрах нь аялах юм!
            </p>
          </div>

          {/* Author Bio */}
          <div className="mt-12 pt-8 border-t border-gray-200">
            <div className="flex items-start gap-4">
              <img
                src="https://images.unsplash.com/photo-1585624196654-d78397524a51?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwZXJzb24lMjB0cmF2ZWwlMjBibG9nZ2VyfGVufDF8fHx8MTc2NjM0NzY1OHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
                alt={currentBlog.author}
                className="size-16 rounded-full object-cover"
              />
              <div>
                <h3 className="text-xl mb-2">{currentBlog.author}</h3>
                <p className="text-gray-600">
                  Аяллын блогер, гэрэл зурагчин. 50 гаруй орныг аялсан туршлагатай. Дэлхийн
                  гайхамшгуудыг хуваалцах дуртай.
                </p>
              </div>
            </div>
          </div>
        </article>

        {/* Related Posts */}
        {relatedPosts.length > 0 && (
          <div className="mt-16 mb-16">
            <h2 className="text-3xl mb-8">Холбоотой нийтлэлүүд</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {relatedPosts.map((post) => (
                <Link
                  key={post.id}
                  href={`/blog/${post.id}`}
                  className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-shadow group"
                >
                  <div className="aspect-[16/10] overflow-hidden">
                    <img
                      src={post.image}
                      alt={post.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                  <div className="p-6">
                    <span className="inline-block px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-sm mb-3">
                      {post.category}
                    </span>
                    <h3 className="text-xl mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors">
                      {post.title}
                    </h3>
                    <p className="text-gray-600 text-sm line-clamp-2 mb-4">{post.excerpt}</p>
                    <div className="flex items-center gap-4 text-sm text-gray-500">
                      <div className="flex items-center gap-1">
                        <User className="size-4" />
                        <span>{post.author}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="size-4" />
                        <span>{post.readTime}</span>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function categoryToSlug(category: string) {
  switch (category) {
    case "Далай":
      return "dalai";
    case "Уул":
      return "uul";
    case "Соёл":
      return "soyl";
    case "Хот":
      return "hot";
    case "Адал явдал":
      return "adal";
    case "Байгаль":
      return "baigal";
    default:
      return category.toLowerCase();
  }
}
