import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { SubmitHandler, useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useRouter } from "next/router";
import { useToast } from "@/components/ui/use-toast";
import jwtDecode from "jwt-decode";
import api from "@/pages/api/axios";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const loginSchema = z.object({
  login: z.string().min(1, "Por favor, preencha todos os campos."),
  senha: z.string().min(1, "Por favor, preencha todos os campos."),
});

const registerSchema = loginSchema
  .extend({
    confirmarSenha: z.string().min(1, "Por favor, preencha todos os campos."),
  })
  .refine((data) => data.senha === data.confirmarSenha, {
    message: "Senhas diferentes.",
    path: ["confirmarSenha"],
  });

type LoginFormInputs = z.infer<typeof loginSchema>;
type RegisterFormInputs = z.infer<typeof registerSchema>;

export default function LoginBox() {
  const [modo, setModo] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [savePassword, setSavePassword] = useState(false);

  const { toast } = useToast();
  const navigate = useRouter();

  const loginForm = useForm<LoginFormInputs>({
    resolver: zodResolver(loginSchema),
  });

  const registerForm = useForm<RegisterFormInputs>({
    resolver: zodResolver(registerSchema),
  });

  const handleCheckboxChange = () => {
    setShowPassword(!showPassword);
  };

  const handleSavePasswordChange = () => {
    if (!savePassword) {
      localStorage.setItem("savedPassword", loginForm.getValues("senha"));
    } else {
      localStorage.removeItem("savedPassword");
    }
    setSavePassword(!savePassword);
  };

  const handleLoginSubmit: SubmitHandler<LoginFormInputs> = async (data) => {
    try {
      const response = await api.post("login", {
        username: data.login,
        password: data.senha,
      });
      const token = response.headers["authorization"];
      localStorage.setItem("token", token);
      const decoded: any = jwtDecode(token);
      const userId = decoded.userId;
      localStorage.setItem("id", userId);
      navigate.push("/skills");
      toast({
        title: "Login successful",
        description: `Welcome ${data.login}`,
      });
    } catch (error) {
      loginForm.setError("login", {
        message: "Credenciais inválidas. Por favor, tente novamente.",
      });
    }
  };

  return (
    <Card className="">
      <CardHeader>
        <h1>Bem vindo ao Website de skills</h1>
      </CardHeader>
      <CardContent>
        <Form {...loginForm}>
          <form onSubmit={loginForm.handleSubmit(handleLoginSubmit)}>
            <FormField
              control={loginForm.control}
              name="login"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Username</FormLabel>
                  <FormControl>
                    <Input placeholder="admin" {...field} />
                  </FormControl>

                  <FormMessage>
                    {registerForm.formState.errors.confirmarSenha?.message}
                  </FormMessage>
                </FormItem>
              )}
            />
            <FormField
              control={loginForm.control}
              name="senha"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Username</FormLabel>
                  <FormControl>
                    <Input placeholder="senha" {...field} />
                  </FormControl>

                  <FormMessage>
                    {registerForm.formState.errors.confirmarSenha?.message}
                  </FormMessage>
                </FormItem>
              )}
            />
            <Button type="submit">Submit</Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
