type FilterValue = 'all' | 'active' | 'completed'
type SortValue = 'recent' | 'priority-high' | 'priority-low' | 'alphabetical'

interface FilterBarProps {
  filter: FilterValue
  onFilterChange: (filter: FilterValue) => void
  sortOrder?: SortValue
  onSortChange?: (sort: SortValue) => void
}

export default function FilterBar({
  filter,
  onFilterChange,
  sortOrder,
  onSortChange,
}: FilterBarProps) {
  const filters: FilterValue[] = ['all', 'active', 'completed']

  return (
    <div id="filter-bar">
      {filters.map((f) => (
        <button
          key={f}
          type="button"
          data-active={filter === f}
          onClick={() => onFilterChange(f)}
        >
          {f.charAt(0).toUpperCase() + f.slice(1)}
        </button>
      ))}

      {onSortChange && (
        <select
          id="sort-order"
          value={sortOrder ?? 'recent'}
          onChange={(e) => onSortChange(e.target.value as SortValue)}
        >
          <option value="recent">Recently Added</option>
          <option value="priority-high">Priority: High to Low</option>
          <option value="priority-low">Priority: Low to High</option>
          <option value="alphabetical">Alphabetical</option>
        </select>
      )}
    </div>
  )
}