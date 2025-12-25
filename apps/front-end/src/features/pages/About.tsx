"use client";

import { MapPin, Users, Target, Heart, ArrowRight, Sparkles } from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";
import Link from 'next/link';

export function About() {
  const prefersReducedMotion = useReducedMotion();

  const team = [
    {
      name: "Сарантуяа",
      role: "Үүсгэн байгуулагч & Аяллын зохион байгуулагч",
      image:
        "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=1200&q=80",
      description: "45 орныг аялсан туршлагатай",
    },
    {
      name: "Батбаяр",
      role: "Гэрэл зурагчин",
      image:
        "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=1200&q=80",
      description: "10 жил гэрэл зурагчин",
    },
    {
      name: "Оюунчимэг",
      role: "Контент бүтээгч",
      image:
        "https://images.unsplash.com/photo-1548142813-c348350df52b?auto=format&fit=crop&w=1200&q=80",
      description: "Соёл, түүх судлаач",
    },
  ];

  const stats = [
    { label: "Аялсан орон", value: "50+" },
    { label: "Нийтлэл", value: "200+" },
    { label: "Уншигчид", value: "100K+" },
    { label: "Гэрэл зураг", value: "5000+" },
  ];

  const features = [
    {
      icon: MapPin,
      title: "Бидний эрхэм зорилго",
      text: "Хүн бүрт дэлхийн гайхамшгийг харах боломж олгох",
    },
    {
      icon: Target,
      title: "Бидний зорилт",
      text: "Үнэн зөв мэдээлэл, туршлагаар хүмүүсийг дэмжих",
    },
    {
      icon: Heart,
      title: "Бидний үнэт зүйлс",
      text: "Соёлыг хүндэтгэх, байгаль орчныг хамгаалах",
    },
  ];

  const fadeUp = {
    hidden: { opacity: 0, y: 16 },
    show: { opacity: 1, y: 0 },
  };

  const stagger = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.08, delayChildren: 0.08 },
    },
  };

  return (
    <div className="min-h-screen bg-white">
      {/* HERO */}
      <section className="relative overflow-hidden">
        <div className="relative h-[420px] md:h-[520px]">
          {/* BG image */}
          <img
            src="https://images.unsplash.com/photo-1526779259212-939e64788e3c?auto=format&fit=crop&w=1920&q=80"
            alt="About us"
            className="absolute inset-0 h-full w-full object-cover"
          />
          {/* overlay */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-white/0" />
          {/* subtle shapes */}
          <div className="absolute -top-40 -right-40 size-[520px] rounded-full bg-blue-500/20 blur-3xl" />
          <div className="absolute -bottom-48 -left-48 size-[520px] rounded-full bg-purple-500/20 blur-3xl" />

          <div className="relative z-10 mx-auto flex h-full max-w-7xl items-center px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={prefersReducedMotion ? false : "hidden"}
              animate={prefersReducedMotion ? undefined : "show"}
              variants={stagger}
              className="max-w-2xl text-white"
            >
              <motion.div variants={fadeUp} className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-sm backdrop-blur">
                <Sparkles className="size-4" />
                <span>Аяллын түүх, зөвлөмж, бодит туршлага</span>
              </motion.div>

              <motion.h1
                variants={fadeUp}
                className="mt-5 text-4xl font-bold leading-tight md:text-5xl lg:text-6xl"
              >
                Бидний тухай
              </motion.h1>

              <motion.p variants={fadeUp} className="mt-4 text-lg text-gray-200 md:text-xl">
                “Аялал Нүүдэл” — Дэлхийг хамтдаа нээх аялал.
              </motion.p>

              <motion.div variants={fadeUp} className="mt-8 flex flex-wrap gap-3">
                <a
                  href="#team"
                  className="inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 text-blue-700 font-semibold shadow-lg shadow-black/10 hover:bg-gray-100 transition"
                >
                  Багаа танилцах
                  <ArrowRight className="size-4" />
                </a>
                <a
                  href="#story"
                  className="inline-flex items-center gap-2 rounded-full bg-white/10 px-6 py-3 text-white font-semibold backdrop-blur hover:bg-white/15 transition"
                >
                  Манай түүх
                </a>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* STORY */}
      <section id="story" className="py-16 md:py-20 bg-white">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={prefersReducedMotion ? false : "hidden"}
            whileInView={prefersReducedMotion ? undefined : "show"}
            viewport={{ once: true, amount: 0.25 }}
            variants={stagger}
            className="text-center"
          >
            <motion.h2 variants={fadeUp} className="text-3xl md:text-4xl font-bold text-gray-900">
              Бидний түүх
            </motion.h2>
            <motion.p variants={fadeUp} className="mt-5 text-lg text-gray-600 leading-relaxed">
              2018 онд эхэлсэн “Аялал Нүүдэл” бол зөвхөн блог биш, харин аялах дуртай хүмүүсийн Аялагчид юм.
              Бид дэлхийн өнцөг булан бүрээс түүх, туршлага хуваалцаж, хүмүүст шинэ газар нээх урам зориг өгдөг.
            </motion.p>
          </motion.div>

          <motion.div
            initial={prefersReducedMotion ? false : "hidden"}
            whileInView={prefersReducedMotion ? undefined : "show"}
            viewport={{ once: true, amount: 0.25 }}
            variants={stagger}
            className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6"
          >
            {features.map((f, idx) => {
              const Icon = f.icon;
              return (
                <motion.div
                  key={idx}
                  variants={fadeUp}
                  whileHover={prefersReducedMotion ? undefined : { y: -6 }}
                  transition={{ type: "spring", stiffness: 260, damping: 18 }}
                  className="group rounded-2xl border border-gray-200 bg-gradient-to-b from-white to-gray-50 p-6 shadow-sm hover:shadow-lg transition"
                >
                  <div className="mx-auto mb-4 flex size-12 items-center justify-center rounded-2xl bg-blue-600/10 text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition">
                    <Icon className="size-6" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900">{f.title}</h3>
                  <p className="mt-2 text-gray-600 text-sm leading-relaxed">{f.text}</p>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </section>

      {/* STATS */}
      <section className="py-16 bg-gray-50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={prefersReducedMotion ? false : "hidden"}
            whileInView={prefersReducedMotion ? undefined : "show"}
            viewport={{ once: true, amount: 0.25 }}
            variants={stagger}
            className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6"
          >
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                variants={fadeUp}
                className="rounded-2xl border border-gray-200 bg-white p-6 text-center shadow-sm hover:shadow-md transition"
              >
                <div className="text-4xl md:text-5xl font-extrabold text-blue-600">
                  {stat.value}
                </div>
                <div className="mt-2 text-gray-600">{stat.label}</div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* TEAM */}
      <section id="team" className="py-16 md:py-20 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={prefersReducedMotion ? false : "hidden"}
            whileInView={prefersReducedMotion ? undefined : "show"}
            viewport={{ once: true, amount: 0.25 }}
            variants={stagger}
            className="text-center"
          >
            <motion.div variants={fadeUp} className="mx-auto mb-4 flex size-12 items-center justify-center rounded-2xl bg-blue-600/10 text-blue-600">
              <Users className="size-6" />
            </motion.div>
            <motion.h2 variants={fadeUp} className="text-3xl md:text-4xl font-bold text-gray-900">
              Бидний баг
            </motion.h2>
            <motion.p variants={fadeUp} className="mt-3 text-gray-600 max-w-2xl mx-auto">
              Аялах дуртай, туршлагатай мэргэжилтнүүдийн баг
            </motion.p>
          </motion.div>

          <motion.div
            initial={prefersReducedMotion ? false : "hidden"}
            whileInView={prefersReducedMotion ? undefined : "show"}
            viewport={{ once: true, amount: 0.25 }}
            variants={stagger}
            className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6"
          >
            {team.map((member, index) => (
              <motion.div
                key={index}
                variants={fadeUp}
                whileHover={prefersReducedMotion ? undefined : { y: -8 }}
                transition={{ type: "spring", stiffness: 260, damping: 18 }}
                className="group overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm hover:shadow-xl transition"
              >
                <div className="relative aspect-[4/4] overflow-hidden">
                  <img
                    src={member.image}
                    alt={member.name}
                    className="h-full w-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/35 via-black/0 to-black/0 opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>

                <div className="p-6 text-center">
                  <h3 className="text-xl font-semibold text-gray-900">{member.name}</h3>
                  <p className="mt-1 text-blue-600 font-medium">{member.role}</p>
                  <p className="mt-2 text-gray-600 text-sm">{member.description}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={prefersReducedMotion ? false : { opacity: 0, y: 14 }}
            whileInView={prefersReducedMotion ? undefined : { opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.25 }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Бидэнтэй нэгдээрэй!</h2>
            <p className="text-xl text-blue-100 mb-8">
              Сар бүр шинэ аяллын түүх, зөвлөмж авахыг хүсвэл бидэнтэй холбогдоорой
            </p>

            <Link  className="inline-flex items-center gap-2 rounded-full bg-white px-8 py-3 text-blue-700 font-semibold hover:bg-gray-100 transition shadow-lg shadow-black/10" href='/register'>
              И-мэйл бүртгүүлэх
              <ArrowRight className="size-4" />
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
