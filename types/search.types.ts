
export interface AnimatedSearchProps {
  onSearch: (query: string) => void;
  categoryNames?: string[];
  placeholder?: string;
  className?: string;
  debounceMs?: number;
}


