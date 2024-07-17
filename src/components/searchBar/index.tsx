import { useState } from "react";
import { Input } from "../ui/input";
import { Button } from "../ui/button";

interface SearchBarProps {
  onSearch: (query: string) => void;
}

export default function SearchBar({ onSearch }: SearchBarProps) {
  const [searchValue, setSearchValue] = useState("");

  const handleSearch = () => {
    onSearch(searchValue);
  };

  return (
    <div className="flex flex-row border py-2 rounded w-svw pr-4 gap-2">
      <Input
        type="text"
        placeholder="Nome ou Level da skill"
        onChange={(e) => setSearchValue(e.target.value)}
      />
      <Button
        className="rounded"
        onClick={() => {
          handleSearch();
        }}
      >
        Pesquisar
      </Button>
    </div>
  );
}
