import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import api from "@/pages/api/axios";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { z } from "zod";
import { loginSchema } from "../SignInForm";

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
      });
      setModo(true);
    } catch (error) {
      registerForm.setError("username", {
        message: "Erro ao criar conta. Por favor, tente novamente.",
      });
    }
  };

  return (
    <>
      <Form {...registerForm}>
        <form onSubmit={registerForm.handleSubmit(handleRegisterSubmit)}>
          <FormField
            control={registerForm.control}
            name="username"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Username</FormLabel>
                <FormControl>
                  <Input
                    {...registerForm.register("username")}
                    type="text"
                    placeholder="Login"
                  />
                </FormControl>
                <FormMessage>
                  {registerForm.formState.errors.username?.message}
                </FormMessage>
              </FormItem>
            )}
          />
          <FormField
            control={registerForm.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input
                    {...registerForm.register("password")}
                    type={showPassword ? "text" : "password"}
                    placeholder="Senha"
                  />
                </FormControl>

                <FormMessage>
                  {registerForm.formState.errors.password?.message}
                </FormMessage>
              </FormItem>
            )}
          />
          <FormField
            control={registerForm.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Confirmar Password</FormLabel>
                <FormControl>
                  <Input
                    {...registerForm.register("confirmarSenha")}
                    type={showPassword ? "text" : "password"}
                    placeholder="Senha"
                  />
                </FormControl>

                <FormMessage>
                  {registerForm.formState.errors.password?.message}
                </FormMessage>
              </FormItem>
            )}
          />
          <div className="flex flex-col gap-5 mt-5">
            <div className="flex flex-row gap-3 justify-star">
              <Checkbox onClick={handleCheckboxChange} checked={showPassword} />
              <p>Mostrar senha</p>
            </div>
            <Button type="submit">Registrar</Button>
          </div>
        </form>
      </Form>
    </>
  );
}
