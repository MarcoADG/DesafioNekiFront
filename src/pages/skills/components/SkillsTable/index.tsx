import React, { useState, useEffect } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useRouter } from "next/router";
import api from "@/pages/api/axios";
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

const skillSchema = z.object({
  id: z.number(),
  nome: z.string(),
  level: z.string(),
  descricao: z.string(),
  imagem: z.string().url(),
});

type Skill = z.infer<typeof skillSchema>;

export default function SkillsTable() {
  const [skills, setSkills] = useState<Skill[]>([]);
  const [currentPage, setCurrentPage] = useState<number | undefined>(0);
  const [totalPages, setTotalPages] = useState<number | undefined>();
  const [itemsPerPage] = useState(5);

  const router = useRouter();
  const { register, setValue } = useForm<Skill>({
    resolver: zodResolver(skillSchema),
  });

  const fetchData = async (page: number = 1) => {
    try {
      const token = localStorage.getItem("token");
      const userId = localStorage.getItem("id");
      const response = await api.get(`associacoes/usuario/${userId}/skills`, {
        params: {
          page: currentPage - 1,
          size: itemsPerPage,
        },
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setSkills(response.data.content);
      setTotalPages(response.data.totalPages);
      setCurrentPage(page);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, [currentPage]);

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

  const handleKeyPress = (
    id: number,
    event: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (event.key === "Enter") {
      const skillToUpdate = skills.find((skill) => skill.id === id);
      if (!skillToUpdate) {
        console.error("Skill not found.");
        return;
      }

      const { id: skillId, level } = skillToUpdate;
      const usuarioId = localStorage.getItem("id");
      const token = localStorage.getItem("token");
      const requestData = {
        usuarioId,
        skillId,
        level,
      };

      api
        .put(`associacoes/${id}`, requestData, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((response) => {
          console.log("Skill updated successfully:", response.data);
        })
        .catch((error) => {
          console.error("Error updating skill:", error);
        });
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

      const userId = localStorage.getItem("id");
      const response = await api.get(`associacoes/usuario/${userId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setSkills(response.data);
    } catch (error) {
      console.error("Error deleting skill:", error);
    }
  };

  const nextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const prevPage = () => {
    if (currentPage > 1) {
      fetchData(currentPage - 1);
    }
  };

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = skills.slice(indexOfFirstItem, indexOfLastItem);

  return (
    <Card className="container bg-accent flex flex-col align-middle p-14 rounded-xl">
      <CardContent>
        <Table className="bg-primary-foreground rounded-3xl ">
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
            {currentItems.map((skill) => (
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
                  <Input
                    type="text"
                    value={skill.level.toString()} // Ensure 'level' is converted to string if needed
                    onChange={(e) => handleLevelChange(skill.id, e)}
                    onKeyPress={(e) => handleKeyPress(skill.id, e)}
                    className="border p-1"
                  />
                </TableCell>
                <TableCell className="py-4">{skill.descricao}</TableCell>
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
        <Button onClick={prevPage} className="">
          Anterior
        </Button>
        <Button onClick={nextPage} className="">
          Próxima
        </Button>
      </div>
    </Card>
  );
}
