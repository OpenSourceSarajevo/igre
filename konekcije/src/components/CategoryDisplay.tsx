import type { Category } from '../types/game';
import './CategoryDisplay.css';

interface CategoryDisplayProps {
  categories: Category[];
}

export function CategoryDisplay({ categories }: CategoryDisplayProps) {
  if (categories.length === 0) return null;

  return (
    <div className="category-display">
      {categories.map((category, index) => (
        <div
          key={index}
          className="category-card"
          style={{ backgroundColor: category.color }}
        >
          <h3 className="category-name">{category.name}</h3>
          <p className="category-words">{category.words.join(', ')}</p>
        </div>
      ))}
    </div>
  );
}
