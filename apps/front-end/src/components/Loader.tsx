"use client";

import React from "react";
import { Globe, MapPin, Send } from "lucide-react";

type TravelBlogLoaderProps = {
  label?: string;
  fullScreen?: boolean; // page loader болгох
  className?: string;
};

export function TravelBlogLoader({
                                   label = "Аяллын тэмдэглэл ачаалж байна…",
                                   fullScreen = true,
                                   className = "",
                                 }: TravelBlogLoaderProps) {
  const Wrapper = fullScreen ? "div" : React.Fragment;

  const wrapperProps = fullScreen
    ? {
      className:
        "min-h-[60vh] w-full flex items-center justify-center bg-gradient-to-b from-sky-50 via-white to-indigo-50",
    }
    : {};

  return (
    <Wrapper {...wrapperProps}>
      <div
        className={[
          "relative w-full max-w-sm",
          "rounded-2xl border border-gray-200 bg-white/70 backdrop-blur",
          "shadow-lg",
          "px-6 py-6",
          className,
        ].join(" ")}
      >
        {/* Animated scene */}
        <div className="relative mx-auto h-44 w-44">
          {/* Soft glow */}
          <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-sky-200/40 via-indigo-200/30 to-purple-200/40 blur-xl" />

          {/* Orbit wrapper */}
          <div className="absolute inset-0 travel-orbit">
            <div className="travel-orbit-inner">
              <Send className="size-5 text-blue-600 drop-shadow" />
            </div>
          </div>

          {/* Globe */}
          <div className="absolute inset-0 grid place-items-center">
            <div className="relative grid place-items-center">
              <div className="travel-pulse absolute inset-0 rounded-full bg-blue-100/60" />
              <div className="grid place-items-center size-24 rounded-full bg-white shadow-md border border-gray-200">
                <Globe className="size-10 text-blue-600" />
              </div>
            </div>
          </div>

          {/* Pins */}
          <div className="absolute left-2 top-8 travel-pin-1">
            <MapPin className="size-6 text-rose-500 fill-rose-500 drop-shadow" />
          </div>
          <div className="absolute right-3 top-16 travel-pin-2">
            <MapPin className="size-6 text-emerald-600 fill-emerald-600 drop-shadow" />
          </div>
          <div className="absolute left-10 bottom-6 travel-pin-3">
            <MapPin className="size-6 text-indigo-600 fill-indigo-600 drop-shadow" />
          </div>

          {/* Dotted route */}
          <svg
            className="absolute inset-0"
            viewBox="0 0 200 200"
            aria-hidden="true"
          >
            <circle
              cx="100"
              cy="100"
              r="78"
              fill="none"
              stroke="rgba(59,130,246,0.35)"
              strokeWidth="2.5"
              strokeDasharray="4 8"
              className="travel-dash"
            />
          </svg>
        </div>

        {/* Text */}
        <div className="mt-4 text-center">
          <div className="text-base font-semibold text-gray-900">{label}</div>
          <div className="mt-2 flex items-center justify-center gap-1 text-gray-500">
            <span className="travel-dot travel-dot-1">•</span>
            <span className="travel-dot travel-dot-2">•</span>
            <span className="travel-dot travel-dot-3">•</span>
          </div>
          <div className="mt-3 text-xs text-gray-500">
            Түр хүлээгээрэй — таны аяллын түүхийг бэлтгэж байна ✈️
          </div>
        </div>

        {/* Animations */}
        <style jsx>{`
          .travel-orbit {
            animation: orbit 1.6s linear infinite;
            transform-origin: 50% 50%;
          }
          .travel-orbit-inner {
            position: absolute;
            left: 50%;
            top: 50%;
            transform: translate(-50%, -50%) translateY(-82px) rotate(-15deg);
            animation: bob 1.2s ease-in-out infinite;
          }

          .travel-dash {
            animation: dash 1.2s linear infinite;
          }

          .travel-pulse {
            animation: pulse 1.6s ease-in-out infinite;
          }

          .travel-pin-1 {
            animation: pin 1.2s ease-in-out infinite;
          }
          .travel-pin-2 {
            animation: pin 1.2s ease-in-out infinite;
            animation-delay: 0.15s;
          }
          .travel-pin-3 {
            animation: pin 1.2s ease-in-out infinite;
            animation-delay: 0.3s;
          }

          .travel-dot {
            font-size: 20px;
            line-height: 20px;
            animation: dots 1s infinite;
          }
          .travel-dot-2 {
            animation-delay: 0.15s;
          }
          .travel-dot-3 {
            animation-delay: 0.3s;
          }

          @keyframes orbit {
            from {
              transform: rotate(0deg);
            }
            to {
              transform: rotate(360deg);
            }
          }

          @keyframes bob {
            0%,
            100% {
              transform: translate(-50%, -50%) translateY(-82px) rotate(-15deg)
                translateY(0px);
            }
            50% {
              transform: translate(-50%, -50%) translateY(-82px) rotate(-15deg)
                translateY(-4px);
            }
          }

          @keyframes dash {
            to {
              stroke-dashoffset: -24;
            }
          }

          @keyframes pulse {
            0%,
            100% {
              transform: scale(1);
              opacity: 0.55;
            }
            50% {
              transform: scale(1.08);
              opacity: 0.25;
            }
          }

          @keyframes pin {
            0%,
            100% {
              transform: translateY(0);
              opacity: 0.9;
            }
            50% {
              transform: translateY(-6px);
              opacity: 1;
            }
          }

          @keyframes dots {
            0%,
            100% {
              opacity: 0.25;
              transform: translateY(0);
            }
            50% {
              opacity: 1;
              transform: translateY(-2px);
            }
          }
        `}</style>
      </div>
    </Wrapper>
  );
}
