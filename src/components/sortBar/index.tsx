import { useState } from "react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "../ui/select";

interface SortBarProps {
  onSortChange: (query: string) => void;
}

export default function SortBar({ onSortChange }: SortBarProps) {
  const [sortValue, setSortValue] = useState("");

  const handleSortChange = (value: string) => {
    setSortValue(value);
    onSortChange(value);
  };

  return (
    <div className="w-fit">
      <Select onValueChange={handleSortChange}>
        <SelectTrigger>
          <SelectValue placeholder="Filtro" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectLabel>Skills</SelectLabel>

            <SelectItem value="skills.nome,asc">Nome Crescente</SelectItem>
            <SelectItem value="skills.nome,desc">Nome Decrescente</SelectItem>

            <SelectItem value="level,asc">Level Crescente</SelectItem>
            <SelectItem value="level,desc">Level Decrescente</SelectItem>
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>
  );
}
