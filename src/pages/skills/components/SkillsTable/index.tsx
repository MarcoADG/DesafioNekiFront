import React, { useState } from "react";
import { z } from "zod";
import { useRouter } from "next/navigation";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import SearchBar from "@/components/searchBar";
import SortBar from "@/components/sortBar";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Modal from "@/components/modal";
import { useSkills } from "@/hooks/useSkills";
import api from "@/pages/api/axios";

const skillSchema = z.object({
  id: z.number(),
  nome: z.string(),
  level: z.string(),
  descricao: z.string(),
  imagem: z.string().url(),
});

export type Skill = z.infer<typeof skillSchema>;

export default function SkillsTable() {
  const initialParams = { page: 0, search: "", sort: "", size: 5 };
  const {
    skills,
    totalPages,
    currentPage,
    itemsPerPage,
    searchValue,
    setItemsPerPage,
    setSearchValue,
    setSortValue,
    fetchData,
    nextPage,
    prevPage,
    setSkills,
    isFirstPage,
    isLastPage,
  } = useSkills(initialParams);

  const navigate = useRouter();

  const handleLevelChange = (
    id: number,
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const updatedSkills = skills.map((skill) => {
      if (skill.id === id) {
        return {
          ...skill,
          level: event.target.value,
        };
      }
      return skill;
    });
    setSkills(updatedSkills);
  };

  const handleLevelUpdate = async (id: number) => {
    const skillToUpdate = skills.find((skill) => skill.id === id);
    if (!skillToUpdate) {
      console.error("Skill not found.");
      return;
    }

    const { level } = skillToUpdate;
    const usuarioId = localStorage.getItem("id");
    const token = localStorage.getItem("token");
    const requestData = {
      usuarioId,
      skillId: id,
      level,
    };

    try {
      await api.put(`associacoes/${id}`, requestData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log("Skill updated successfully.");
    } catch (error) {
      console.error("Error updating skill:", error);
    }
  };

  const handleKeyPress = (
    id: number,
    event: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (event.key === "Enter") {
      handleLevelUpdate(id);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      const token = localStorage.getItem("token");
      await api.delete(`associacoes/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log("Skill deleted successfully with ID:", id);
      fetchData(currentPage);
    } catch (error) {
      console.error("Error deleting skill:", error);
    }
  };

  const handlePagesChange = (value: string) => {
    const numberValue = parseInt(value, 10);
    if (!isNaN(numberValue)) {
      setItemsPerPage(numberValue);
    }
  };

  const handleSearch = (value: string) => {
    setSearchValue(value);
    fetchData(0, value, "", itemsPerPage);
  };

  const handleSortChange = (value: string) => {
    setSortValue(value);
    fetchData(0, searchValue, value, itemsPerPage);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate.push("/");
  };

  return (
    <Card className="container bg-accent flex flex-col align-middle p-14 rounded-xl">
      <Button
        className="mx-6 w-fit rounded-r-full items-end"
        onClick={handleLogout}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="lucide lucide-log-out"
        >
          <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
          <polyline points="16 17 21 12 16 7" />
          <line x1="21" x2="9" y1="12" y2="12" />
        </svg>
      </Button>
      <CardContent>
        <div className="flex items-center mb-4">
          <Modal />
          <SearchBar onSearch={handleSearch} />
          <SortBar onSortChange={handleSortChange} />
        </div>
        <Table className="bg-primary-foreground rounded-3xl">
          <TableHeader>
            <TableRow>
              <TableHead>Image</TableHead>
              <TableHead>Nome</TableHead>
              <TableHead>Level</TableHead>
              <TableHead>Descrição</TableHead>
              <TableHead>Deletar</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {skills.map((skill) => (
              <TableRow key={skill.id}>
                <TableCell className="py-4">
                  <Image
                    height={100}
                    width={100}
                    src={skill.imagem}
                    alt={skill.nome}
                    className="w-20 h-auto"
                  />
                </TableCell>
                <TableCell className="py-4">{skill.nome}</TableCell>
                <TableCell className="py-4">
                  <div className="flex items-center">
                    <Input
                      type="text"
                      value={skill.level.toString()}
                      onChange={(e) => handleLevelChange(skill.id, e)}
                      onKeyPress={(e) => handleKeyPress(skill.id, e)}
                      className="border p-1 w-auto"
                    />
                    <Button
                      onClick={() => handleLevelUpdate(skill.id)}
                      className="ml-2"
                    >
                      Update
                    </Button>
                  </div>
                </TableCell>
                <TableCell className="py-4 w-auto">{skill.descricao}</TableCell>
                <TableCell className="py-4">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth="1.5"
                    stroke="currentColor"
                    className="w-6 h-6 cursor-pointer"
                    onClick={() => handleDelete(skill.id)}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"
                    />
                  </svg>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
      <div className="flex justify-between mt-4">
        <Button onClick={prevPage} disabled={isFirstPage} className="">
          Anterior
        </Button>
        <div className="w-fit">
          <Select onValueChange={handlePagesChange}>
            <SelectTrigger>
              <SelectValue placeholder="itens por pagina" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Paginas</SelectLabel>
                <SelectItem value="5">5</SelectItem>
                <SelectItem value="10">10</SelectItem>
                <SelectItem value="15">15</SelectItem>
                <SelectItem value="20">20</SelectItem>
                <SelectItem value="25">25</SelectItem>
                <SelectItem value="30">30</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
        <Button onClick={nextPage} disabled={isLastPage}>
          Próxima
        </Button>
      </div>
    </Card>
  );
}
