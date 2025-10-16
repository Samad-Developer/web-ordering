import Link from "next/link";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { CategoryItemProps } from "@/types/category.types";
import { categoryTabVariants } from "./category-tab.variants";

const CategoryTab: React.FC<CategoryItemProps> = ({
    category,
    isActive,
    onClick,
    layout = "default",
    ref,
}) => {
    const iconSrc = isActive
        ? category.categoryActiveIcon
        : category.categoryIcon;

    return (
        <Link
            href={`#${category.categoryId}`}
            onClick={onClick}
            ref={ref}
            className={cn(
                categoryTabVariants({
                    layout,
                    state: isActive ? "active" : "default",
                })
            )}
        >
            {layout === "iconic" ? (
                <>
                    <div className="relative w-[74px] h-[74px] sm:w-[100px] sm:h-[100px] rounded-full overflow-hidden flex items-center justify-center">
                        <Image
                            src={iconSrc}
                            alt={category.categoryName}
                            fill
                            sizes="(max-width: 640px) 74px, 100px"
                            className="object-cover"
                            onError={(e) => {
                                e.currentTarget.src = '/assets/images/category-icons/placeholder-category-icon.png';
                            }}
                        />
                    </div>

                    <span className="line-clamp-3 px-1 text-center text-wrap w-16 sm:w-24 text-[10px] sm:text-[14px] font-semibold">
                        {category.categoryName}
                    </span>
                </>
            ) : (
                <span>{category.categoryName}</span>
            )}
        </Link>
    );
};

export default CategoryTab;
