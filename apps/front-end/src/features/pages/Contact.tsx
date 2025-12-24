"use client";
import { Mail, Phone, MapPin, Send } from "lucide-react";
import { useState } from "react";

export function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission
    alert("Таны мэдээлэл амжилттай илгээгдлээ!");
    setFormData({ name: "", email: "", subject: "", message: "" });
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative h-[300px] flex items-center justify-center bg-gradient-to-r from-blue-600 to-blue-800">
        <div className="text-center text-white px-4">
          <h1 className="text-4xl md:text-5xl mb-4">Холбоо барих</h1>
          <p className="text-xl text-blue-100">
            Бидэнтэй холбогдохыг хүсвэл доорх хэлбэрийг бөглөнө үү
          </p>
        </div>
      </section>

      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Contact Info */}
            <div>
              <h2 className="text-3xl mb-6">Бидэнтэй холбогдох</h2>
              <p className="text-gray-600 mb-8">
                Танд асуух зүйл эсвэл хамтран ажиллах санал байвал бидэнтэй 
                холбогдоход таатай байна. Бид таны мэдээллийг хүлээн авахыг 
                тэсэн ядан хүлээж байна!
              </p>

              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-blue-50 rounded-lg">
                    <Mail className="size-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="mb-1">И-мэйл хаяг</h3>
                    <p className="text-gray-600">info@ayalnuudel.mn</p>
                    <p className="text-gray-600">contact@ayalnuudel.mn</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="p-3 bg-blue-50 rounded-lg">
                    <Phone className="size-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="mb-1">Утас</h3>
                    <p className="text-gray-600">+976 1234-5678</p>
                    <p className="text-gray-600">+976 9876-5432</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="p-3 bg-blue-50 rounded-lg">
                    <MapPin className="size-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="mb-1">Хаяг</h3>
                    <p className="text-gray-600">
                      Сүхбаатар дүүрэг, 1-р хороо
                      <br />
                      Улаанбаатар хот, Монгол Улс
                    </p>
                  </div>
                </div>
              </div>

              {/* Map placeholder */}
              <div className="mt-8 h-[300px] bg-gray-200 rounded-xl flex items-center justify-center">
                <div className="text-center text-gray-500">
                  <MapPin className="size-12 mx-auto mb-2" />
                  <p>Газрын зураг</p>
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <div>
              <div className="bg-gray-50 rounded-xl p-8">
                <h2 className="text-2xl mb-6">Мессеж илгээх</h2>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <label
                      htmlFor="name"
                      className="block mb-2 text-gray-700"
                    >
                      Нэр *
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none"
                      placeholder="Таны нэр"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="email"
                      className="block mb-2 text-gray-700"
                    >
                      И-мэйл *
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none"
                      placeholder="your@email.com"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="subject"
                      className="block mb-2 text-gray-700"
                    >
                      Гарчиг *
                    </label>
                    <input
                      type="text"
                      id="subject"
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none"
                      placeholder="Мэдээллийн гарчиг"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="message"
                      className="block mb-2 text-gray-700"
                    >
                      Мессеж *
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      required
                      rows={6}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none resize-none"
                      placeholder="Таны мессеж..."
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
                  >
                    <Send className="size-5" />
                    Илгээх
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl text-center mb-12">Түгээмэл асуултууд</h2>
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-xl">
              <h3 className="text-xl mb-2">
                Та нар аялал зохион байгуулдаг уу?
              </h3>
              <p className="text-gray-600">
                Бид аяллын блог бөгөөд туршлага хуваалцдаг. Гэхдээ аяллын 
                зөвлөмж, санал өгч чадна.
              </p>
            </div>

            <div className="bg-white p-6 rounded-xl">
              <h3 className="text-xl mb-2">
                Хэрхэн нийтлэл бичиж болох вэ?
              </h3>
              <p className="text-gray-600">
                Хэрэв танд аяллын сонирхолтой түүх байвал бидэнтэй холбогдоорой. 
                Бид зочин нийтлэгчдийг үргэлж хүлээн авдаг.
              </p>
            </div>

            <div className="bg-white p-6 rounded-xl">
              <h3 className="text-xl mb-2">
                Сошиал медиад байгаа юу?
              </h3>
              <p className="text-gray-600">
                Тийм ээ! Биднийг Instagram, Facebook, Twitter дээр дагаарай. 
                Өдөр бүр шинэ контент байршуулдаг.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
