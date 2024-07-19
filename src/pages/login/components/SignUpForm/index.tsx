import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { z } from "zod";
import InputField from "@/components/inputField";
import CheckboxField from "@/components/checkBox";
import api from "@/pages/api/axios";
import { loginSchema } from "../SignInForm";
import { useToast } from "@/components/ui/use-toast";
import { ToastAction } from "@/components/ui/toast";

const registerSchema = loginSchema
  .extend({
    confirmarSenha: z.string().min(1, "Por favor, preencha todos os campos."),
  })
  .refine((data) => data.password === data.confirmarSenha, {
    message: "Senhas diferentes.",
    path: ["confirmarSenha"],
  });

type RegisterFormInputs = z.infer<typeof registerSchema>;

interface SignUpFormProps {
  setModo: (modo: boolean) => void;
}

export default function SignUpForm({ setModo }: SignUpFormProps) {
  const [showPassword, setShowPassword] = useState(false);

  const registerForm = useForm<RegisterFormInputs>({
    resolver: zodResolver(registerSchema),
  });

  const { toast } = useToast();

  const handleCheckboxChange = () => {
    setShowPassword(!showPassword);
  };

  const handleRegisterSubmit: SubmitHandler<RegisterFormInputs> = async (
    data
  ) => {
    try {
      await api.post("/login/signup", {
        login: data.username,
        senha: data.password,
      });
      toast({
        title: "Conta criada com sucesso!",
        action: <ToastAction altText="Goto schedule to undo">Undo</ToastAction>,
      });
      setModo(true);
    } catch (error) {
      registerForm.setError("username", {
        message: "Erro ao criar conta. Por favor, tente novamente.",
      });
    }
  };

  return (
    <Form {...registerForm}>
      <form onSubmit={registerForm.handleSubmit(handleRegisterSubmit)}>
        <InputField
          label="Username"
          name="username"
          register={registerForm.register}
          error={registerForm.formState.errors.username}
        />
        <InputField
          label="Password"
          name="password"
          type={showPassword ? "text" : "password"}
          register={registerForm.register}
          error={registerForm.formState.errors.password}
        />
        <InputField
          label="Confirmar Password"
          name="confirmarSenha"
          type={showPassword ? "text" : "password"}
          register={registerForm.register}
          error={registerForm.formState.errors.confirmarSenha}
        />
        <div className="flex flex-col gap-5 mt-5">
          <CheckboxField
            label="Mostrar senha"
            checked={showPassword}
            onChange={handleCheckboxChange}
          />
          <Button type="submit">Registrar</Button>
        </div>
      </form>
    </Form>
  );
}
