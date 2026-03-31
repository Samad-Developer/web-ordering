"use client";

import Image from "next/image";
import { useAppSelector } from "@/store/hooks";
import { selectAddressApiData } from "@/store/slices/addressSlice";
import { useFreshBranchStatus } from "@/hooks/useFreshBranchStatus";
import { Facebook, Instagram, Music2, MapPin, Phone, Smartphone  } from "lucide-react";

export default function Footer() {
    const currentBranch = useFreshBranchStatus();
    const addressAndThemeData = useAppSelector(selectAddressApiData);
    const settings = addressAndThemeData?.dataPayload?.Theme?.Settings;

    const restaurantName = settings?.RestaurantName;
    const externalLinks = settings?.WebsiteConfig?.ExternalLinks;

    const linksMap = externalLinks?.reduce<Record<string, string>>((acc, item) => {
        if (item.Value) {
            acc[item.Name] = item.Value;
        }
        return acc;
    }, {}) || {};

    return (
        <footer className="w-full bg-footer-bg text-footer-fg border-t border-white/10">

            {/* Main Footer */}
            <div className="max-w-6xl mx-auto px-2 sm:px-0 py-10 grid grid-cols-1 md:grid-cols-3 gap-4">

                {/* Card 1 */}
                <div className="p-5 rounded-2xl bg-white/5 backdrop-blur-md border border-white/10 hover:bg-white/10 transition">
                    <h3 className="text-lg font-semibold mb-4 tracking-wide">
                        {
                            restaurantName ? restaurantName : 'Your Restaurant'
                        }
                    </h3>

                    <div className="space-y-3 text-sm opacity-90">
                        <div className="flex items-start gap-3">
                            <MapPin size={20} className="mt-0.5 opacity-70 shrink-0" />
                            <span>{currentBranch?.branch?.BranchAddress}</span>
                        </div>

                        <div className="flex items-center gap-3">
                            <Phone size={18} className="opacity-70" />
                            <span>{currentBranch?.branch?.BranchPhoneNumber}</span>
                        </div>
                    </div>
                </div>

                {/* Card 2 */}
                <div className="p-5 rounded-2xl bg-white/5 backdrop-blur-md border border-white/10 hover:bg-white/10 transition">
                    <h3 className="text-lg font-semibold mb-4 tracking-wide">
                        Social Links
                    </h3>

                    {/* Social Links (ADD HERE) */}
                    {(linksMap.FACEBOOK || linksMap.INSTAGRAM || linksMap.TIKTOK) ? (
                        <div className="flex flex-col items-start gap-4 pt-2 border-white/10">
                            {linksMap.FACEBOOK && (
                                <a
                                    href={linksMap.FACEBOOK}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-sm opacity-80 hover:opacity-100 hover:underline transition flex gap-2"
                                >
                                     <Facebook size={18} /> Facebook
                                </a>
                            )}

                            {linksMap.INSTAGRAM && (
                                <a
                                    href={linksMap.INSTAGRAM}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-sm opacity-80 hover:opacity-100 hover:underline transition flex gap-2"
                                >
                                    <Instagram size={18} /> Instagram
                                </a>
                            )}

                            {linksMap.TIKTOK && (
                                <a
                                    href={linksMap.TIKTOK}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-sm opacity-80 hover:opacity-100 hover:underline transition flex gap-2"
                                >
                                    <Music2 size={18} /> Tiktok
                                </a>
                            )}

                        </div>
                    ) : (
                        <p className="text-sm opacity-60">Social links not available</p>
                    )}
                </div>

                {/* Card 3 */}
                <div className="p-5 rounded-2xl bg-white/5 backdrop-blur-md border border-white/10 hover:bg-white/10 transition">
                    <h3 className="text-lg font-semibold mb-4 tracking-wide">
                        Get Our App
                    </h3>

                    <div className="space-y-3">

                        {linksMap.ANDROID_APP && (
                            <a
                                href={linksMap.ANDROID_APP}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center justify-between gap-3 px-4 py-3 rounded-xl bg-white/10 hover:bg-white/20 transition"
                            >
                                <div className="flex items-center gap-3">
                                    <Smartphone size={18} />
                                    <span className="text-sm">Android App</span>
                                </div>
                                <span className="text-xs opacity-70">Download</span>
                            </a>
                        )}

                        {linksMap.IOS_APP && (
                            <a
                                href={linksMap.IOS_APP}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center justify-between gap-3 px-4 py-3 rounded-xl bg-white/10 hover:bg-white/20 transition"
                            >
                                <div className="flex items-center gap-3">
                                    <Smartphone size={18} />
                                    <span className="text-sm">iOS App</span>
                                </div>
                                <span className="text-xs opacity-70">Download</span>
                            </a>
                        )}

                        {/* Optional: fallback */}
                        {!linksMap.ANDROID_APP && !linksMap.IOS_APP && (
                            <p className="text-sm opacity-60">App links not available</p>
                        )}

                    </div>
                </div>
            </div>

            {/* Bottom Strip */}
            <div className="border-t border-white/10 px-4 pb-24 pt-6 sm:py-4 flex items-center justify-between flex-col sm:flex-row gap-3">

                <p className="text-xs opacity-70">
                    © {new Date().getFullYear()} {"Restaurant"} — All rights reserved
                </p>

                <a
                    href="https://eatx.vercel.app/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 hover:opacity-80 transition"
                >
                    <span className="text-xs opacity-70">Powered by</span>
                    <Image
                        src="/assets/images/logo/eatx.webp"
                        alt="EatX"
                        width={60}
                        height={20}
                    />
                </a>
            </div>
        </footer>
    );
}