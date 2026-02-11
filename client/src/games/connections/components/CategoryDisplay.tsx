import { cn } from "@/utils/classNameUtils";
import type { Category } from "../types/game";
import { difficultyColors } from "../utils/colors";
interface CategoryDisplayProps {
  categories: Category[];
}

export function CategoryDisplay({ categories }: CategoryDisplayProps) {
  if (categories.length === 0) return null;

  return (
    <div
      className={cn(
        "flex flex-col gap-2 sm:gap-3",
        "mx-auto mb-4 sm:mb-6",
        "w-[95vw] sm:w-[630px]",
      )}
    >
      {categories.map((category, index) => (
        <div
          key={index}
          className={cn(
            "rounded-lg text-center animate-reveal",
            "p-4 sm:p-5",
            difficultyColors[category.difficulty],
          )}
        >
          <h3 className="font-extrabold uppercase text-solved-text mb-1 text-sm sm:text-base">
            {category.name}
          </h3>

          <p className="text-solved-text tracking-wide text-xs sm:text-sm md:text-base">
            {category.words.join(", ").toUpperCase()}
          </p>
        </div>
      ))}
    </div>
  );
}
