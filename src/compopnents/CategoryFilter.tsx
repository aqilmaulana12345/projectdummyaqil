import type { Category } from "../types/product";

type Props = {
  categories: Category[];
  onSelect: (category: string) => void;
};

export default function CategoryFilter({ categories, onSelect }: Props) {
  return (
    <select onChange={(e) => onSelect(e.target.value)}>
      <option value="">All Categories</option>

      {categories.map((c) => (
        <option key={c.slug} value={c.slug}>
          {c.name}
        </option>
      ))}
    </select>
  );
}
