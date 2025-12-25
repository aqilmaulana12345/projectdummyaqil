type Props = {
    onSearch: (query: string) => void;
  };
  
  export default function SearchBar({ onSearch }: Props) {
    return (
      <input
        placeholder="Search product..."
        onChange={(e) => onSearch(e.target.value)}
        style={{ padding: 8, width: "100%" }}
      />
    );
  }
  