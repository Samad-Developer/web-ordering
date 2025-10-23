import React from "react";

interface CategoryTextBannerProps {
  categorName: string;
}

const CategoryTextBanner: React.FC<CategoryTextBannerProps> = ({ categorName }) => {
  return (
    <div className="text-center my-2 sm:my-4 py-4 sm:py-8 border rounded-2xl">
      <h2 className="text-4xl sm:text-5xl font-extrabold text-gray-800">
        {categorName}
      </h2>
      <p className="text-gray-500 mt-3 text-lg">
        Discover our delicious {categorName.toLowerCase()} selection
      </p>
      <div className="mt-4 mx-auto h-[3px] w-24 bg-red-500 rounded-full"></div>
    </div>
  );
};

export default CategoryTextBanner;
