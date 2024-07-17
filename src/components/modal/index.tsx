import { useEffect, useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "../ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import api from "@/pages/api/axios";
import { Input } from "../ui/input";

interface Skill {
  id: number;
  nome: string;
}

const schema = z.object({
  skill: z.string().min(1, "Por favor escolha uma skill"),
  level: z
    .number()
    .min(0, "O nível deve ser no mínimo 0")
    .max(100, "O nível deve ser no máximo 100"),
});

type FormData = z.infer<typeof schema>;

export default function Modal() {
  const [skills, setSkills] = useState<Skill[]>([]);
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const fetchData = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        console.error("No token found");
        return;
      }

      const response = await api.get("skills", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setSkills(response.data);
    } catch (error) {
      console.error("Error fetching skills:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSaveSkill: SubmitHandler<FormData> = async (data) => {
    try {
      const token = localStorage.getItem("token");
      const userId = localStorage.getItem("id");
      if (!token) {
        console.error("Token not found");
        return;
      }

      const selectedSkillObj = skills.find(
        (skill) => skill.nome === data.skill
      );
      if (!selectedSkillObj) {
        console.error("Selected skill not found");
        return;
      }

      const requestData = {
        usuarioId: userId,
        skillId: selectedSkillObj.id,
        level: data.level,
      };

      await api.post("associacoes/associar", requestData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log("Skill saved:", data.skill);
      // Se tudo estiver ok, o dialog pode fechar
      handleClose();
    } catch (error) {
      console.error("Error saving skill:", error);
    }
  };

  const handleClose = () => {
    setValue("skill", "");
    setValue("level", 0);
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>Adicionar Skill</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Escolha uma nova skill</DialogTitle>
          <DialogDescription>
            Tenha certeza de escolher a skill correta que deseja adicionar.
            Aperte em salvar quando terminar.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(handleSaveSkill)}>
          <Select onValueChange={(value) => setValue("skill", value)}>
            <SelectTrigger>
              <SelectValue placeholder="Skills" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Skills</SelectLabel>
                {skills.map((skill) => (
                  <SelectItem key={skill.id} value={skill.nome}>
                    {skill.nome}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
          {errors.skill && <span>{errors.skill.message}</span>}
          <Input
            className="mb-6 mt-2"
            type="number"
            placeholder="Level da skill, de 0 a 100"
            min={0}
            max={100}
            {...register("level", { valueAsNumber: true })}
          />
          {errors.level && <span>{errors.level.message}</span>}

          <DialogFooter className="sm:justify-between">
            <DialogClose asChild>
              <Button type="button">Cancelar</Button>
            </DialogClose>
            <Button type="submit">Salvar</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
