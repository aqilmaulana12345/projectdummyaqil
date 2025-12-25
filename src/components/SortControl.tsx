type Props = {
    onSort: (order: "asc" | "desc") => void;
  };
  
  export default function SortControl({ onSort }: Props) {
    return (
      <select onChange={(e) => onSort(e.target.value as "asc" | "desc")}>
        <option value="asc">Title A - Z</option>
        <option value="desc">Title Z - A</option>
      </select>
    );
  }
  