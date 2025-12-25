"use client";

import { Mail, Phone, MapPin, Send, CheckCircle2, Loader2, Sparkles, ChevronDown } from "lucide-react";
import { useMemo, useState } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";

type FormState = {
  name: string;
  email: string;
  subject: string;
  message: string;
};

type FormErrors = Partial<Record<keyof FormState, string>>;

const initialState: FormState = { name: "", email: "", subject: "", message: "" };

export function Contact() {
  const prefersReducedMotion = useReducedMotion();

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
        a: "Нэвтэрсний дараа “Нийтлэл бичих” хэсгээр нийтлэл оруулах боломжтой. Зочин нийтлэгчдийн санал ч нээлттэй.",
      },
      {
        q: "Сошиал медиад байгаа юу?",
        a: "Тийм ээ! Бид Instagram, Facebook, TikTok дээр шинэ контент байршуулдаг.",
      },
    ],
    []
  );

  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const fadeUp = {
    hidden: { opacity: 0, y: 16 },
    show: { opacity: 1, y: 0 },
  };

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
    setErrors((p) => ({ ...p, [name]: "" })); // typing хийхэд error арилгах
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const nextErrors = validate(formData);
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    setSending(true);
    try {
      // TODO: энд backend endpoint руу POST хийх (жишээ нь /contact)
      // await fetch(`${process.env.NEXT_PUBLIC_API_URL}/contact`, { method: "POST", ... })

      await new Promise((r) => setTimeout(r, 900)); // demo fake delay
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
        className={`w-full px-4 py-3 rounded-xl border bg-white outline-none transition
          ${errors[name] ? "border-red-400 focus:ring-2 focus:ring-red-200" : "border-gray-200 focus:ring-2 focus:ring-blue-200"}
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
    <div className="min-h-screen bg-white">
      {/* Toast */}
      <AnimatePresence>
        {toastOpen && (
          <motion.div
            initial={prefersReducedMotion ? false : { opacity: 0, y: -14, scale: 0.98 }}
            animate={prefersReducedMotion ? undefined : { opacity: 1, y: 0, scale: 1 }}
            exit={prefersReducedMotion ? undefined : { opacity: 0, y: -14, scale: 0.98 }}
            className="fixed top-5 left-1/2 -translate-x-1/2 z-[80]"
          >
            <div className="flex items-center gap-2 rounded-full bg-white shadow-xl border border-gray-200 px-5 py-3">
              <CheckCircle2 className="size-5 text-green-600" />
              <span className="text-gray-800 font-medium">Таны мэдээлэл амжилттай илгээгдлээ!</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="relative h-[320px] md:h-[380px] flex items-center justify-center">
          <img
            src="https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1920&q=80"
            alt="Contact"
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-blue-700/80 to-purple-700/70" />
          <div className="absolute -top-40 -right-40 size-[520px] rounded-full bg-white/10 blur-3xl" />
          <div className="absolute -bottom-48 -left-48 size-[520px] rounded-full bg-white/10 blur-3xl" />

          <motion.div
            initial={prefersReducedMotion ? false : "hidden"}
            animate={prefersReducedMotion ? undefined : "show"}
            variants={{ hidden: { opacity: 0, y: 14 }, show: { opacity: 1, y: 0 } }}
            className="relative text-center text-white px-4 max-w-2xl"
          >
            <div className="inline-flex items-center gap-2 rounded-full bg-white/15 px-4 py-2 backdrop-blur mb-4">
              <Sparkles className="size-4" />
              <span className="text-sm">Хүсэлт, санал, хамтын ажиллагаа</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-3">Холбоо барих</h1>
            <p className="text-lg md:text-xl text-blue-100">
              Бидэнтэй холбогдохыг хүсвэл доорх хэлбэрийг бөглөнө үү
            </p>
          </motion.div>
        </div>
      </section>

      {/* Main */}
      <section className="py-14 md:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
            {/* Left: Contact Info */}
            <motion.div
              initial={prefersReducedMotion ? false : "hidden"}
              whileInView={prefersReducedMotion ? undefined : "show"}
              viewport={{ once: true, amount: 0.2 }}
              variants={{ hidden: { opacity: 0, y: 16 }, show: { opacity: 1, y: 0 } }}
            >
              <h2 className="text-3xl font-bold mb-4">Бидэнтэй холбогдох</h2>
              <p className="text-gray-600 mb-8 leading-relaxed">
                Танд асуух зүйл эсвэл хамтран ажиллах санал байвал бидэнтэй холбогдоход таатай байна.
                Бид таны мэдээллийг хүлээн авахыг тэсэн ядан хүлээж байна!
              </p>

              <div className="space-y-5">
                <div className="flex items-start gap-4 rounded-2xl border border-gray-200 p-5 bg-white shadow-sm hover:shadow-md transition">
                  <div className="p-3 bg-blue-50 rounded-xl">
                    <Mail className="size-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">И-мэйл хаяг</h3>
                    <p className="text-gray-600">info@ayalnuudel.mn</p>
                    <p className="text-gray-600">contact@ayalnuudel.mn</p>
                  </div>
                </div>

                <div className="flex items-start gap-4 rounded-2xl border border-gray-200 p-5 bg-white shadow-sm hover:shadow-md transition">
                  <div className="p-3 bg-blue-50 rounded-xl">
                    <Phone className="size-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">Утас</h3>
                    <p className="text-gray-600">+976 1234-5678</p>
                    <p className="text-gray-600">+976 9876-5432</p>
                  </div>
                </div>

                <div className="flex items-start gap-4 rounded-2xl border border-gray-200 p-5 bg-white shadow-sm hover:shadow-md transition">
                  <div className="p-3 bg-blue-50 rounded-xl">
                    <MapPin className="size-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">Хаяг</h3>
                    <p className="text-gray-600">
                      Сүхбаатар дүүрэг, 1-р хороо
                      <br />
                      Улаанбаатар хот, Монгол Улс
                    </p>
                  </div>
                </div>
              </div>

              {/* Map */}
              <div className="mt-8 overflow-hidden rounded-2xl border border-gray-200 shadow-sm">
                {/* Сонголт 1: Google Maps Embed (API key шаардахгүй) */}
                <iframe
                  title="map"
                  className="w-full h-[320px]"
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  src="https://www.google.com/maps?q=Ulaanbaatar%20Mongolia&z=12&output=embed"
                />
              </div>
            </motion.div>

            {/* Right: Form */}
            <motion.div
              initial={prefersReducedMotion ? false : "hidden"}
              whileInView={prefersReducedMotion ? undefined : "show"}
              viewport={{ once: true, amount: 0.2 }}
              variants={{ hidden: { opacity: 0, y: 16 }, show: { opacity: 1, y: 0 } }}
            >
              <div className="rounded-2xl border border-gray-200 bg-gradient-to-b from-gray-50 to-white p-6 md:p-8 shadow-sm">
                <h2 className="text-2xl font-bold mb-2">Мессеж илгээх</h2>
                <p className="text-gray-600 mb-6">
                  24 цагийн дотор эргэн хариулахыг хичээнэ.
                </p>

                <form onSubmit={handleSubmit} className="space-y-5">
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
                      className={`w-full px-4 py-3 rounded-xl border bg-white outline-none transition resize-none
                        ${errors.message ? "border-red-400 focus:ring-2 focus:ring-red-200" : "border-gray-200 focus:ring-2 focus:ring-blue-200"}
                      `}
                      placeholder="Таны мессеж..."
                    />
                    <div className="mt-1 flex items-center justify-between">
                      {errors.message ? <p className="text-sm text-red-600">{errors.message}</p> : <span />}
                      <p className="text-xs text-gray-400">{formData.message.length}/500</p>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={sending}
                    className="w-full px-6 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold
                      hover:from-blue-700 hover:to-purple-700 transition shadow-lg shadow-blue-600/10
                      disabled:opacity-60 disabled:cursor-not-allowed inline-flex items-center justify-center gap-2"
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
                </form>
              </div>

              <div className="mt-4 text-xs text-gray-500">
                Илгээх товч дарснаар таны мэдээлэл бидний үйлчилгээний нөхцөлтэй нийцэж хадгалагдана.
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.h2
            initial={prefersReducedMotion ? false : { opacity: 0, y: 12 }}
            whileInView={prefersReducedMotion ? undefined : { opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.45 }}
            className="text-3xl font-bold text-center mb-10"
          >
            Түгээмэл асуултууд
          </motion.h2>

          <div className="space-y-4">
            {faqs.map((f, idx) => {
              const isOpen = openFaq === idx;
              return (
                <motion.div
                  key={idx}
                  initial={prefersReducedMotion ? false : { opacity: 0, y: 10 }}
                  whileInView={prefersReducedMotion ? undefined : { opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.2 }}
                  transition={{ duration: 0.35 }}
                  className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm"
                >
                  <button
                    onClick={() => setOpenFaq((p) => (p === idx ? null : idx))}
                    className="w-full px-5 py-4 flex items-center justify-between text-left hover:bg-gray-50 transition"
                  >
                    <span className="text-base md:text-lg font-semibold text-gray-900">{f.q}</span>
                    <ChevronDown className={`size-5 text-gray-500 transition-transform ${isOpen ? "rotate-180" : ""}`} />
                  </button>

                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        initial={prefersReducedMotion ? false : { height: 0, opacity: 0 }}
                        animate={prefersReducedMotion ? undefined : { height: "auto", opacity: 1 }}
                        exit={prefersReducedMotion ? undefined : { height: 0, opacity: 0 }}
                        transition={{ duration: 0.25 }}
                      >
                        <div className="px-5 pb-5 text-gray-600 leading-relaxed">
                          {f.a}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
}
