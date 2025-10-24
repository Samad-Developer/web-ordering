import React, { useRef, useEffect } from "react";

interface CategoryVideoBannerProps {
  videoUrl?: string;
  title?: string;
  posterUrl?: string;
}

const CategoryVideoBanner: React.FC<CategoryVideoBannerProps> = ({
  videoUrl = "/assets/images/banner/category-banner/category-banner-video.webm",
  title = "Category Banner Video",
  posterUrl,
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    // Ensure video plays on mount (some browsers may block autoplay)
    if (videoRef.current) {
      videoRef.current.play().catch((error) => {
        console.log("Video autoplay was prevented:", error);
      });
    }
  }, []);

  return (
    <div className="my-4 sm:my-6 md:my-8 w-full">
      <video
        ref={videoRef}
        src={videoUrl}
        poster={posterUrl}
        autoPlay
        muted
        loop
        playsInline
        preload="metadata"
        aria-label={title}
        className="w-full h-auto rounded-2xl object-cover"
        style={{
          maxHeight: "80vh",
        }}
      >
        <source src={videoUrl} type="video/webm" />
        Your browser does not support the video tag.
      </video>
    </div>
  );
};

export default CategoryVideoBanner;

// Later on if their is multiple categories using video so for performance we have to use this component

// "use client";

// import React, { useRef, useEffect, useState } from "react";

// interface CategoryVideoBannerProps {
//   videoUrl?: string;
//   title?: string;
//   posterUrl?: string;
// }

// const CategoryVideoBanner: React.FC<CategoryVideoBannerProps> = ({
//   videoUrl = "/assets/images/banner/category-banner/category-banner-video.webm",
//   title = "Category Banner Video",
//   posterUrl
// }) => {
//   const videoRef = useRef<HTMLVideoElement>(null);
//   const containerRef = useRef<HTMLDivElement>(null);
//   const [isInView, setIsInView] = useState(false);
//   const [shouldLoad, setShouldLoad] = useState(false);

//   useEffect(() => {
//     const container = containerRef.current;
//     if (!container) return;

//     // Intersection Observer for lazy loading
//     const observer = new IntersectionObserver(
//       (entries) => {
//         entries.forEach((entry) => {
//           if (entry.isIntersecting) {
//             setIsInView(true);
//             setShouldLoad(true);
//           } else {
//             setIsInView(false);
//           }
//         });
//       },
//       {
//         rootMargin: "200px", // Start loading 200px before entering viewport
//         threshold: 0.1
//       }
//     );

//     observer.observe(container);

//     return () => {
//       observer.disconnect();
//     };
//   }, []);

//   useEffect(() => {
//     const video = videoRef.current;
//     if (!video || !shouldLoad) return;

//     // Play video when in view
//     if (isInView) {
//       video.play().catch((error) => {
//         console.log("Video autoplay prevented:", error);
//       });
//     } else {
//       // Pause when out of view to save resources
//       video.pause();
//     }
//   }, [isInView, shouldLoad]);

//   return (
//     <div ref={containerRef} className="my-4 sm:my-6 md:my-8 w-full">
//       {shouldLoad ? (
//         <video
//           ref={videoRef}
//           poster={posterUrl}
//           muted
//           loop
//           playsInline
//           preload="none"
//           aria-label={title}
//           className="w-full h-auto rounded-2xl shadow-lg object-cover"
//           style={{
//             maxHeight: '80vh'
//           }}
//         >
//           <source src={videoUrl} type="video/webm" />
//           <source src={videoUrl.replace('.webm', '.mp4')} type="video/mp4" />
//           Your browser does not support the video tag.
//         </video>
//       ) : (
//         <div
//           className="w-full h-64 sm:h-80 md:h-96 rounded-2xl shadow-lg bg-gray-200 animate-pulse"
//           style={{
//             backgroundImage: posterUrl ? `url(${posterUrl})` : 'none',
//             backgroundSize: 'cover',
//             backgroundPosition: 'center'
//           }}
//         />
//       )}
//     </div>
//   );
// };

// export default CategoryVideoBanner;
