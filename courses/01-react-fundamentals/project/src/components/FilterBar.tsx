import Button from './Button'
import FormInput from './FormInput'

type FilterValue = 'all' | 'active' | 'completed'
type SortValue = 'recent' | 'priority-high' | 'priority-low' | 'alphabetical' | 'due-date'

interface FilterBarProps {
  filter: FilterValue
  onFilterChange: (filter: FilterValue) => void
  sortOrder?: SortValue
  onSortChange?: (sort: SortValue) => void
  searchText?: string
  onSearchChange?: (text: string) => void
  isSearching?: boolean
  categoryFilter?: string
  onCategoryFilterChange?: (category: string) => void
  categories?: string[]
}

export default function FilterBar({
  filter,
  onFilterChange,
  sortOrder,
  onSortChange,
  searchText,
  onSearchChange,
  isSearching,
  categoryFilter,
  onCategoryFilterChange,
  categories,
}: FilterBarProps) {
  const filters: FilterValue[] = ['all', 'active', 'completed']

  return (
    <div id="filter-bar">
      {filters.map((f) => (
        <Button
          key={f}
          variant="secondary"
          active={filter === f}
          onClick={() => onFilterChange(f)}
        >
          {f.charAt(0).toUpperCase() + f.slice(1)}
        </Button>
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
          <option value="due-date">Due Date (Soonest First)</option>
        </select>
      )}

      {onCategoryFilterChange && (
        <select
          id="category-filter"
          value={categoryFilter ?? 'all'}
          onChange={(e) => onCategoryFilterChange(e.target.value)}
        >
          <option value="all">All categories</option>
          {(categories ?? []).map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
      )}

      {onSearchChange && (
        <>
          <FormInput
            id="search-input"
            value={searchText ?? ''}
            onChange={(e) => onSearchChange(e.target.value)}
            type="text"
          />
          {searchText && searchText.length > 0 && (
            <Button id="clear-search" variant="secondary" onClick={() => onSearchChange('')}>
              Clear search
            </Button>
          )}
          {isSearching && <p id="searching-indicator">Searching...</p>}
        </>
      )}
    </div>
  )
}