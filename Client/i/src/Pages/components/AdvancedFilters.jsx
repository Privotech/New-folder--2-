import { useState } from "react";
import { CalendarIcon, TagIcon, FilterIcon } from "./Icons";
import "./AdvancedFilters.css";

export default function AdvancedFilters({
  onFilterChange,
  categories,
  priorities,
}) {
  const [showFilters, setShowFilters] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedPriority, setSelectedPriority] = useState("all");
  const [dateRange, setDateRange] = useState("all");
  const [onlyFavorited, setOnlyFavorited] = useState(false);
  const [hasImages, setHasImages] = useState(false);
  const [onlyShared, setOnlyShared] = useState(false);

  const handleFilterChange = () => {
    onFilterChange({
      category: selectedCategory,
      priority: selectedPriority,
      dateRange,
      onlyFavorited,
      hasImages,
      onlyShared,
    });
  };

  const handleChange = (setter, value) => {
    setter(value);
    setTimeout(handleFilterChange, 0);
  };

  const resetFilters = () => {
    setSelectedCategory("all");
    setSelectedPriority("all");
    setDateRange("all");
    setOnlyFavorited(false);
    setHasImages(false);
    setOnlyShared(false);
    onFilterChange({
      category: "all",
      priority: "all",
      dateRange: "all",
      onlyFavorited: false,
      hasImages: false,
      onlyShared: false,
    });
  };

  return (
    <div className="advanced-filters">
      <button
        className="filters-toggle"
        onClick={() => setShowFilters(!showFilters)}
        title="Advanced filters"
      >
        <FilterIcon />
        Filters
      </button>

      {showFilters && (
        <div className="filters-panel">
          <div className="filters-header">
            <h3>Advanced Filters</h3>
            <button className="reset-filters-btn" onClick={resetFilters}>
              Reset All
            </button>
          </div>

          <div className="filter-group">
            <label>Category</label>
            <select
              value={selectedCategory}
              onChange={(e) =>
                handleChange(setSelectedCategory, e.target.value)
              }
            >
              <option value="all">All Categories</option>
              <option value="personal">Personal</option>
              <option value="work">Work</option>
              <option value="ideas">Ideas</option>
              <option value="research">Research</option>
              <option value="archived">Archived</option>
            </select>
          </div>

          <div className="filter-group">
            <label>Priority</label>
            <select
              value={selectedPriority}
              onChange={(e) =>
                handleChange(setSelectedPriority, e.target.value)
              }
            >
              <option value="all">All Priorities</option>
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
              <option value="urgent">Urgent</option>
            </select>
          </div>

          <div className="filter-group">
            <label>Date Range</label>
            <select
              value={dateRange}
              onChange={(e) => handleChange(setDateRange, e.target.value)}
            >
              <option value="all">Any Time</option>
              <option value="today">Today</option>
              <option value="week">This Week</option>
              <option value="month">This Month</option>
              <option value="year">This Year</option>
            </select>
          </div>

          <div className="filter-checkboxes">
            <label>
              <input
                type="checkbox"
                checked={onlyFavorited}
                onChange={(e) =>
                  handleChange(setOnlyFavorited, e.target.checked)
                }
              />
              Favorites Only
            </label>

            <label>
              <input
                type="checkbox"
                checked={hasImages}
                onChange={(e) => handleChange(setHasImages, e.target.checked)}
              />
              Has Images
            </label>

            <label>
              <input
                type="checkbox"
                checked={onlyShared}
                onChange={(e) => handleChange(setOnlyShared, e.target.checked)}
              />
              Shared Notes
            </label>
          </div>
        </div>
      )}
    </div>
  );
}
