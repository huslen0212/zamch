"use client";

import {
  Mail,
  Phone,
  MapPin,
  Send,
  CheckCircle2,
  Loader2,
  Sparkles,
  ChevronDown,
  MessageCircle,
  Clock,
  Globe,
} from "lucide-react";
import { useMemo, useState } from "react";

type FormState = {
  name: string;
  email: string;
  subject: string;
  message: string;
};

type FormErrors = Partial<Record<keyof FormState, string>>;

const initialState: FormState = { name: "", email: "", subject: "", message: "" };

export function Contact() {
  const [formData, setFormData] = useState<FormState>(initialState);
  const [errors, setErrors] = useState<FormErrors>({});
  const [sending, setSending] = useState(false);
  const [toastOpen, setToastOpen] = useState(false);

  const faqs = useMemo(
    () => [
      {
        q: "Та нар аялал зохион байгуулдаг уу?",
        a: "Бид аяллын блог бөгөөд туршлага, зөвлөмж хуваалцдаг. Мөн танд маршрут, төлөвлөгөө, зөвлөмж боловсруулж өгч чадна.",
      },
      {
        q: "Хэрхэн нийтлэл бичиж болох вэ?",
        a: "Нэвтэрсний дараа Нийтлэл бичих хэсгээр нийтлэл оруулах боломжтой. Зочин нийтлэгчдийн санал ч нээлттэй.",
      },
      {
        q: "Сошиал медиад байгаа юу?",
        a: "Тийм ээ! Бид Instagram, Facebook, TikTok дээр шинэ контент байршуулдаг.",
      },
    ],
    []
  );

  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const validate = (data: FormState): FormErrors => {
    const e: FormErrors = {};
    if (!data.name.trim()) e.name = "Нэр заавал шаардлагатай";
    if (!data.email.trim()) e.email = "И-мэйл заавал шаардлагатай";
    else if (!/^\S+@\S+\.\S+$/.test(data.email.trim())) e.email = "И-мэйл формат буруу байна";
    if (!data.subject.trim()) e.subject = "Гарчиг заавал шаардлагатай";
    if (!data.message.trim()) e.message = "Мессеж заавал шаардлагатай";
    else if (data.message.trim().length < 10) e.message = "Мессеж хамгийн багадаа 10 тэмдэгт байх хэрэгтэй";
    return e;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((p) => ({ ...p, [name]: value }));
    setErrors((p) => ({ ...p, [name]: "" }));
  };

  const handleSubmit = async () => {
    const nextErrors = validate(formData);
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    setSending(true);
    try {
      await new Promise((r) => setTimeout(r, 900));
      setFormData(initialState);
      setToastOpen(true);
      setTimeout(() => setToastOpen(false), 3000);
    } finally {
      setSending(false);
    }
  };

  const Field = ({
                   label,
                   name,
                   type = "text",
                   placeholder,
                 }: {
    label: string;
    name: keyof FormState;
    type?: string;
    placeholder: string;
  }) => (
    <div>
      <label htmlFor={name} className="block mb-2 text-gray-700 font-medium">
        {label} <span className="text-red-500">*</span>
      </label>
      <input
        id={name}
        name={name}
        type={type}
        value={formData[name]}
        onChange={handleChange}
        className={`w-full px-4 py-3 rounded-xl border bg-white outline-none transition-all
          ${errors[name] ? "border-red-400 focus:ring-2 focus:ring-red-200" : "border-gray-300 focus:ring-2 focus:ring-blue-400 focus:border-blue-400"}
        `}
        placeholder={placeholder}
        autoComplete="off"
      />
      {errors[name] ? (
        <p className="mt-1 text-sm text-red-600">{errors[name]}</p>
      ) : null}
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 via-white to-gray-50">
      {/* Toast - Enhanced */}
      {toastOpen && (
        <div className="fixed top-5 left-1/2 -translate-x-1/2 z-[80] animate-bounce">
          <div className="flex items-center gap-3 rounded-2xl bg-white shadow-2xl border border-green-200 px-6 py-4">
            <div className="p-2 bg-green-100 rounded-full">
              <CheckCircle2 className="size-6 text-green-600" />
            </div>
            <div>
              <p className="text-gray-900 font-semibold">Амжилттай илгээгдлээ!</p>
              <p className="text-sm text-gray-600">Таны мэдээлэл хүлээн авлаа</p>
            </div>
          </div>
        </div>
      )}

      {/* Hero Section - Enhanced */}
      <section className="relative overflow-hidden">
        <div className="relative h-[400px] md:h-[480px] flex items-center justify-center">
          <img
            src="https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1920&q=80"
            alt="Contact"
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-br from-blue-700/85 via-purple-700/75 to-indigo-700/85" />

          {/* Animated background blobs */}
          <div className="absolute inset-0 opacity-30">
            <div className="absolute -top-40 -right-40 size-[520px] rounded-full bg-white/20 blur-3xl animate-pulse" />
            <div className="absolute -bottom-48 -left-48 size-[520px] rounded-full bg-blue-300/20 blur-3xl animate-pulse delay-700" />
          </div>

          <div className="relative text-center text-white px-4 max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 rounded-full bg-white/20 backdrop-blur-sm px-5 py-2 mb-6 border border-white/30">
              <Sparkles className="size-4 animate-pulse" />
              <span className="text-sm font-medium">Хүсэлт, санал, хамтын ажиллагаа</span>
            </div>
            <h1 className="text-5xl md:text-7xl font-bold mb-6 tracking-tight">
              Холбоо барих
            </h1>
            <p className="text-xl md:text-2xl text-blue-100 leading-relaxed">
              Бидэнтэй холбогдохыг хүсвэл доорх хэлбэрийг бөглөнө үү
            </p>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-16 md:py-20 -mt-20 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Left: Contact Info */}
            <div>
              <div className="bg-white rounded-2xl p-8 shadow-xl border border-gray-100">
                <h2 className="text-3xl font-bold mb-4 text-gray-900">Бидэнтэй холбогдох</h2>
                <p className="text-gray-600 mb-8 leading-relaxed">
                  Танд асуух зүйл эсвэл хамтран ажиллах санал байвал бидэнтэй холбогдоход таатай байна.
                  Бид таны мэдээллийг хүлээн авахыг тэсэн ядан хүлээж байна!
                </p>

                <div className="space-y-5">
                  <div className="group flex items-start gap-4 rounded-2xl border border-gray-200 p-5 bg-gradient-to-br from-blue-50 to-white hover:shadow-lg hover:scale-105 transition-all duration-300">
                    <div className="p-3 bg-blue-100 rounded-xl group-hover:bg-blue-200 transition-colors">
                      <Mail className="size-6 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-2">И-мэйл хаяг</h3>
                      <p className="text-gray-600 hover:text-blue-600 transition-colors cursor-pointer">info@ayalnuudel.mn</p>
                      <p className="text-gray-600 hover:text-blue-600 transition-colors cursor-pointer">contact@ayalnuudel.mn</p>
                    </div>
                  </div>

                  <div className="group flex items-start gap-4 rounded-2xl border border-gray-200 p-5 bg-gradient-to-br from-green-50 to-white hover:shadow-lg hover:scale-105 transition-all duration-300">
                    <div className="p-3 bg-green-100 rounded-xl group-hover:bg-green-200 transition-colors">
                      <Phone className="size-6 text-green-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-2">Утас</h3>
                      <p className="text-gray-600 hover:text-green-600 transition-colors cursor-pointer">+976 1234-5678</p>
                      <p className="text-gray-600 hover:text-green-600 transition-colors cursor-pointer">+976 9876-5432</p>
                    </div>
                  </div>

                  <div className="group flex items-start gap-4 rounded-2xl border border-gray-200 p-5 bg-gradient-to-br from-purple-50 to-white hover:shadow-lg hover:scale-105 transition-all duration-300">
                    <div className="p-3 bg-purple-100 rounded-xl group-hover:bg-purple-200 transition-colors">
                      <MapPin className="size-6 text-purple-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-2">Хаяг</h3>
                      <p className="text-gray-600">
                        Сүхбаатар дүүрэг, 1-р хороо
                        <br />
                        Улаанбаатар хот, Монгол Улс
                      </p>
                    </div>
                  </div>

                  <div className="group flex items-start gap-4 rounded-2xl border border-gray-200 p-5 bg-gradient-to-br from-orange-50 to-white hover:shadow-lg hover:scale-105 transition-all duration-300">
                    <div className="p-3 bg-orange-100 rounded-xl group-hover:bg-orange-200 transition-colors">
                      <Clock className="size-6 text-orange-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-2">Ажлын цаг</h3>
                      <p className="text-gray-600">Даваа - Баасан: 09:00 - 18:00</p>
                      <p className="text-gray-600">Бямба: 10:00 - 14:00</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Map - Enhanced */}
              <div className="mt-6 overflow-hidden rounded-2xl border-2 border-gray-200 shadow-xl">
                <iframe
                  title="map"
                  className="w-full h-[320px]"
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  src="https://www.google.com/maps?q=Ulaanbaatar%20Mongolia&z=12&output=embed"
                />
              </div>
            </div>

            {/* Right: Form - Enhanced */}
            <div>
              <div className="rounded-2xl border border-gray-200 bg-white p-8 shadow-xl">
                <div className="mb-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 bg-blue-100 rounded-xl">
                      <MessageCircle className="size-6 text-blue-600" />
                    </div>
                    <h2 className="text-3xl font-bold text-gray-900">Мессеж илгээх</h2>
                  </div>
                  <p className="text-gray-600 flex items-center gap-2">
                    <Clock className="size-4" />
                    24 цагийн дотор эргэн хариулахыг хичээнэ.
                  </p>
                </div>

                <div className="space-y-5">
                  <Field label="Нэр" name="name" placeholder="Таны нэр" />
                  <Field label="И-мэйл" name="email" type="email" placeholder="your@email.com" />
                  <Field label="Гарчиг" name="subject" placeholder="Мэдээллийн гарчиг" />

                  <div>
                    <label htmlFor="message" className="block mb-2 text-gray-700 font-medium">
                      Мессеж <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      rows={6}
                      maxLength={500}
                      className={`w-full px-4 py-3 rounded-xl border bg-white outline-none transition-all resize-none
                        ${errors.message ? "border-red-400 focus:ring-2 focus:ring-red-200" : "border-gray-300 focus:ring-2 focus:ring-blue-400 focus:border-blue-400"}
                      `}
                      placeholder="Таны мессеж..."
                    />
                    <div className="mt-2 flex items-center justify-between">
                      {errors.message ? <p className="text-sm text-red-600">{errors.message}</p> : <span />}
                      <p className={`text-xs ${formData.message.length > 450 ? 'text-orange-600 font-semibold' : 'text-gray-400'}`}>
                        {formData.message.length}/500
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={handleSubmit}
                    disabled={sending}
                    className="w-full px-6 py-4 rounded-xl bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 text-white font-semibold
                      hover:from-blue-700 hover:via-purple-700 hover:to-indigo-700 transition-all transform hover:scale-105 shadow-2xl shadow-blue-600/30
                      disabled:opacity-60 disabled:cursor-not-allowed disabled:transform-none inline-flex items-center justify-center gap-2"
                  >
                    {sending ? (
                      <>
                        <Loader2 className="size-5 animate-spin" />
                        Илгээж байна...
                      </>
                    ) : (
                      <>
                        <Send className="size-5" />
                        Илгээх
                      </>
                    )}
                  </button>
                </div>
              </div>

              <div className="mt-4 text-xs text-gray-500 text-center bg-gray-50 rounded-xl p-3 border border-gray-200">
                <Globe className="size-4 inline mr-1" />
                Илгээх товч дарснаар таны мэдээлэл бидний үйлчилгээний нөхцөлтэй нийцэж хадгалагдана.
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ - Enhanced */}
      <section className="py-20 bg-gradient-to-b from-white to-gray-100">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-100 text-blue-700 rounded-full mb-4 font-medium">
              <Sparkles className="size-4" />
              <span>FAQ</span>
            </div>
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Түгээмэл асуултууд
            </h2>
            <p className="text-gray-600 text-lg">
              Танд туслах хариултууд
            </p>
          </div>

          <div className="space-y-4">
            {faqs.map((f, idx) => {
              const isOpen = openFaq === idx;
              return (
                <div
                  key={idx}
                  className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-md hover:shadow-xl transition-all duration-300"
                >
                  <button
                    onClick={() => setOpenFaq((p) => (p === idx ? null : idx))}
                    className="w-full px-6 py-5 flex items-center justify-between text-left hover:bg-gradient-to-r hover:from-blue-50 hover:to-transparent transition-all group"
                  >
                    <span className="text-lg font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                      {f.q}
                    </span>
                    <ChevronDown
                      className={`size-6 text-gray-500 transition-all duration-300 ${isOpen ? "rotate-180 text-blue-600" : "group-hover:text-blue-600"}`}
                    />
                  </button>

                  {isOpen && (
                    <div className="px-6 pb-5 text-gray-600 leading-relaxed border-t border-gray-100 pt-4 bg-gradient-to-b from-blue-50/30 to-transparent">
                      {f.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
}
