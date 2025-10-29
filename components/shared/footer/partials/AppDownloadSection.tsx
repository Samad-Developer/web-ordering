// components/footer/AppDownloadSection.tsx
import React from "react";
import Image from "next/image";
import Link from "next/link";
import { AppDownload } from "@/types/footer.types";

interface AppDownloadSectionProps {
  title: string;
  subtitle: string;
  apps: AppDownload[];
  image?: string;
}

export const AppDownloadSection: React.FC<AppDownloadSectionProps> = ({
  title,
  subtitle,
  apps,
  image,
}) => {
  return (
    <div className="flex flex-col lg:flex-row items-center justify-center lg:justify-start gap-8 ">
      {/* Left side: App preview image */}
      {image && (
        <div className="relative w-24 h-44 flex-shrink-0">
          <Image
            src={image}
            alt="Mobile app preview"
            fill
            className="object-contain"
            sizes="(max-width: 768px) 200px, (max-width: 1024px) 240px, 300px"
            priority
          />
        </div>
      )}

      {/* Right side: Text + Download buttons */}
      <div className="text-center lg:text-left">
        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
          {title}
        </h3>
        <p className="text-gray-600 dark:text-gray-300 mb-6 text-smleading-tight">
          {subtitle}
        </p>

        <div className="flex flex-row justify-center lg:justify-start gap-3 sm:gap-4">
          {apps.map((app, index) => (
            <Link
              key={index}
              href={app.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex"
            >
              <Image
                src={app.icon}
                alt={`Download on ${
                  app.platform === "ios" ? "App Store" : "Google Play"
                }`}
                width={150}
                height={45}
                className="h-11 w-auto hover:opacity-90 transition-opacity"
              />
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};
