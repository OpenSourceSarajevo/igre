import type { Category } from '../types/game';
import { difficultyColors } from '../utils/colors';
interface CategoryDisplayProps {
  categories: Category[];
}

export function CategoryDisplay({ categories }: CategoryDisplayProps) {
  if (categories.length === 0) return null;

  return (
    <div className="flex flex-col gap-3 w-full max-w-[600px] mx-auto mb-6">
      {categories.map((category, index) => (
        <div
          key={index}
          className="p-5 rounded-lg text-center animate-reveal sm:p-4"
          style={{
            backgroundColor: difficultyColors[category.difficulty],
          }}
        >
          <h3 className="font-extrabold text-[1.1rem] mb-1 uppercase sm:text-xs">{category.name}</h3>
          <p className="text-[0.95rem] tracking-[0.5px] sm:text-base">{category.words.join(', ')}</p>
        </div>
      ))}
    </div>
  );
}
