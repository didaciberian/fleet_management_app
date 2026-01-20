import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, X } from "lucide-react";

interface SearchBarProps {
  onSearch: (query: string) => void;
  onClear: () => void;
  placeholder?: string;
}

export function SearchBar({ onSearch, onClear, placeholder = "Buscar por matrícula o VIN..." }: SearchBarProps) {
  const [query, setQuery] = useState("");

  const handleSearch = () => {
    if (query.trim()) {
      onSearch(query);
    }
  };

  const handleClear = () => {
    setQuery("");
    onClear();
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  return (
    <div className="flex gap-2">
      <div className="flex-1 relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
        <Input
          placeholder={placeholder}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyPress={handleKeyPress}
          className="pl-10"
        />
      </div>
      <Button onClick={handleSearch} variant="default">
        Buscar
      </Button>
      {query && (
        <Button onClick={handleClear} variant="outline" size="icon">
          <X className="w-4 h-4" />
        </Button>
      )}
    </div>
  );
}
