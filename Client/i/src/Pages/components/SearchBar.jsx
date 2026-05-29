import "./SearchBar.css";
import { SearchIcon } from "./Icons";

export default function SearchBar({ searchQuery, onSearchChange }) {
  return (
    <div className="search-bar">
      <input
        type="text"
        className="search-input"
        placeholder="Search your notes..."
        value={searchQuery}
        onChange={(e) => onSearchChange(e.target.value)}
      />
      <span className="search-icon">
        <SearchIcon />
      </span>
    </div>
  );
}
