"use client";

import Image from "next/image";
import { useAppSelector } from "@/store/hooks";
import { selectAddressApiData } from "@/store/slices/addressSlice";
import { useFreshBranchStatus } from "@/hooks/useFreshBranchStatus";
import { Facebook, Instagram, Music2, MapPin, Phone, Smartphone, Clock, CheckCircle2, XCircle } from "lucide-react";

const DAY_ORDER = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

function formatTime(time: string) {
  const [h, m] = time.split(":").map(Number);
  const ampm = h >= 12 ? "PM" : "AM";
  const hour = h % 12 || 12;
  return `${hour}:${String(m).padStart(2, "0")} ${ampm}`;
}

export default function Footer() {
  const currentBranch = useFreshBranchStatus();
  const addressAndThemeData = useAppSelector(selectAddressApiData);
  const settings = addressAndThemeData?.dataPayload?.Theme?.Settings;

  const restaurantName = settings?.RestaurantName;
  const externalLinks = settings?.WebsiteConfig?.ExternalLinks;

  const linksMap = externalLinks?.reduce<Record<string, string>>((acc, item) => {
    if (item.Value) acc[item.Name] = item.Value;
    return acc;
  }, {}) || {};

  const branch = currentBranch?.branch;
  const businessDays = branch?.BusinessDays ?? [];
  const sortedDays = [...businessDays].sort(
    (a, b) => DAY_ORDER.indexOf(a.Day) - DAY_ORDER.indexOf(b.Day)
  );
  const todayName = new Date().toLocaleDateString("en-US", { weekday: "long" });
  const isOpen = branch?.IsBranchOpen ?? false;

  return (
    <footer className="w-full bg-footer-bg text-footer-fg border-t border-white/10">

      {/* Main Footer */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">

        {/* Card 1 — Restaurant Info */}
        <div className="p-5 rounded-2xl bg-white/5 backdrop-blur-md border border-white/10 hover:bg-white/10 transition">
          <h3 className="text-lg font-semibold mb-4 tracking-wide">
            {restaurantName || "Your Restaurant"}

            {/* Open/Closed badge */}
              <div className="flex items-center gap-2 pt-1">
                {isOpen ? (
                  <>
                    <CheckCircle2 size={15} className="text-green-400 shrink-0" />
                    <span className="text-xs font-medium text-green-400">Open now</span>
                  </>
                ) : (
                  <>
                    <XCircle size={15} className="text-red-400 shrink-0" />
                    <span className="text-xs font-medium text-red-400">Closed now</span>
                  </>
                )}
              </div>
          </h3>

          {branch ? (
            <div className="space-y-3 text-sm opacity-90">
              <div className="flex items-start gap-3">
                <MapPin size={18} className="mt-0.5 opacity-70 shrink-0" />
                <span className="leading-relaxed">{branch.BranchAddress}</span>
              </div>
              <div className="flex items-center gap-3">
                <Phone size={16} className="opacity-70 shrink-0" />
                <span>{branch.BranchPhoneNumber}</span>
              </div>
              
            </div>
          ) : (
            <div className="space-y-3">
              {/* Skeleton fallback */}
              <div className="h-3 w-3/4 rounded bg-white/10 animate-pulse" />
              <div className="h-3 w-1/2 rounded bg-white/10 animate-pulse" />
              <div className="h-3 w-2/3 rounded bg-white/10 animate-pulse" />
            </div>
          )}
        </div>

        {/* Card 2 — Business Hours */}
        <div className="p-5 rounded-2xl bg-white/5 backdrop-blur-md border border-white/10 hover:bg-white/10 transition">
          <div className="flex items-center gap-2 mb-4">
            <Clock size={16} className="opacity-70" />
            <h3 className="text-lg font-semibold tracking-wide">Hours</h3>
          </div>

          {sortedDays.length > 0 ? (
            <ul className="space-y-1.5 text-sm">
              {sortedDays.map((d) => {
                const isToday = d.Day === todayName;
                return (
                  <li
                    key={d.Day}
                    className={`flex justify-between gap-2 ${isToday ? "opacity-100" : "opacity-60"}`}
                  >
                    <span className={`${isToday ? "font-semibold" : ""} min-w-[80px]`}>
                      {d.Day.slice(0, 3)}
                      {isToday && (
                        <span className="ml-1.5 text-[10px] px-1.5 py-0.5 rounded-full bg-white/15 font-normal">
                          today
                        </span>
                      )}
                    </span>
                    <span className="text-right tabular-nums">
                      {formatTime(d.StartTime)} – {formatTime(d.EndTime)}
                    </span>
                  </li>
                );
              })}
            </ul>
          ) : (
            <div className="space-y-2">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="flex justify-between gap-4">
                  <div className="h-3 w-12 rounded bg-white/10 animate-pulse" />
                  <div className="h-3 w-24 rounded bg-white/10 animate-pulse" />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Card 3 — Social Links */}
        <div className="p-5 rounded-2xl bg-white/5 backdrop-blur-md border border-white/10 hover:bg-white/10 transition">
          <h3 className="text-lg font-semibold mb-4 tracking-wide">Follow Us</h3>

          {(linksMap.FACEBOOK || linksMap.INSTAGRAM || linksMap.TIKTOK) ? (
            <div className="flex flex-col gap-3">
              {linksMap.FACEBOOK && (
                <a href={linksMap.FACEBOOK} target="_blank" rel="noopener noreferrer"
                  className="flex items-center gap-3 px-3 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 transition text-sm">
                  <Facebook size={16} />
                  <span>Facebook</span>
                </a>
              )}
              {linksMap.INSTAGRAM && (
                <a href={linksMap.INSTAGRAM} target="_blank" rel="noopener noreferrer"
                  className="flex items-center gap-3 px-3 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 transition text-sm">
                  <Instagram size={16} />
                  <span>Instagram</span>
                </a>
              )}
              {linksMap.TIKTOK && (
                <a href={linksMap.TIKTOK} target="_blank" rel="noopener noreferrer"
                  className="flex items-center gap-3 px-3 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 transition text-sm">
                  <Music2 size={16} />
                  <span>TikTok</span>
                </a>
              )}
            </div>
          ) : (
            <div className="space-y-3">
              <p className="text-xs opacity-40 pt-1">No social links added yet</p>
            </div>
          )}
        </div>

        {/* Card 4 — Get the App */}
        <div className="p-5 rounded-2xl bg-white/5 backdrop-blur-md border border-white/10 hover:bg-white/10 transition">
          <h3 className="text-lg font-semibold mb-4 tracking-wide">Get Our App</h3>

          {(linksMap.ANDROID_APP || linksMap.IOS_APP) ? (
            <div className="space-y-3">
              {linksMap.ANDROID_APP && (
                <a href={linksMap.ANDROID_APP} target="_blank" rel="noopener noreferrer"
                  className="flex items-center justify-between gap-3 px-4 py-3 rounded-xl bg-white/10 hover:bg-white/20 transition">
                  <div className="flex items-center gap-3">
                    <Smartphone size={16} />
                    <span className="text-sm">Android</span>
                  </div>
                  <span className="text-xs opacity-60">Download ↗</span>
                </a>
              )}
              {linksMap.IOS_APP && (
                <a href={linksMap.IOS_APP} target="_blank" rel="noopener noreferrer"
                  className="flex items-center justify-between gap-3 px-4 py-3 rounded-xl bg-white/10 hover:bg-white/20 transition">
                  <div className="flex items-center gap-3">
                    <Smartphone size={16} />
                    <span className="text-sm">iOS</span>
                  </div>
                  <span className="text-xs opacity-60">Download ↗</span>
                </a>
              )}
            </div>
          ) : (
            <div className="space-y-3">
              <p className="text-xs opacity-40 pt-1">App not available yet</p>
            </div>
          )}
        </div>

      </div>

      {/* Bottom Strip */}
      <div className="border-t border-white/10 px-4 pb-24 pt-6 sm:py-4 flex items-center justify-between flex-col sm:flex-row gap-3">
        <p className="text-xs opacity-70">
          © {new Date().getFullYear()} {restaurantName || "Restaurant"} — All rights reserved
        </p>
        <a href="https://eatx.vercel.app/" target="_blank" rel="noopener noreferrer"
          className="flex items-center gap-2 hover:opacity-80 transition">
          <span className="text-xs opacity-70">Powered by</span>
          <Image src="/assets/images/logo/eatx.webp" alt="EatX" width={60} height={20} />
        </a>
      </div>
    </footer>
  );
}