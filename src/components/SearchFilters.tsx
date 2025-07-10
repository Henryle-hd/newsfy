  import { Input } from "@/components/ui/input"
  import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
  } from "@/components/ui/select"

  interface SearchFiltersProps {
    searchTerm: string
    setSearchTerm: (term: string) => void
    typeFilter: string
    setTypeFilter: (filter: string) => void
    placeholder?: string
    filterOptions: Array<{
      value: string
      label: string
    }>
  }

  export function SearchFilters({ 
    searchTerm, 
    setSearchTerm, 
    typeFilter, 
    setTypeFilter,
    placeholder = "Search...",
    filterOptions
  }: SearchFiltersProps) {
    return (
      <div className="flex gap-4 mb-6">
        <Input
          placeholder={placeholder}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full px-3 py-3 text-sm rounded-sm border border-gray-300 focus:outline-none focus:ring-2 focus:ring-red-400"
        />
        <Select value={typeFilter} onValueChange={setTypeFilter}>
          <SelectTrigger className="px-3 py-3 text-sm rounded-sm border border-gray-300">
            <SelectValue placeholder="Filter by type" />
          </SelectTrigger>
          <SelectContent>
            {filterOptions.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    )
  }