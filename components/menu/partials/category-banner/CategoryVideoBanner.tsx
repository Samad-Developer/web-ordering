import React from "react";

interface CategoryVideoBannerProps {
  videoUrl: string;
  title?: string;
}

const CategoryVideoBanner: React.FC<CategoryVideoBannerProps> = ({ videoUrl, title }) => {
  return (
    <div className="text-center my-8">
      <video
        src={videoUrl}
        autoPlay
        muted
        loop
        playsInline
        className="mx-auto w-full max-w-4xl rounded-2xl shadow-lg"
      />
      {title && (
        <h2 className="text-3xl font-bold mt-4 text-gray-800">
          {title}
        </h2>
      )}
    </div>
  );
};

export default CategoryVideoBanner;
