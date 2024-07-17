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
import { jwtDecode } from "jwt-decode";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { z } from "zod";

export const loginSchema = z.object({
  username: z.string().min(1, "Por favor, preencha todos os campos."),
  password: z.string().min(1, "Por favor, preencha todos os campos."),
});

type LoginFormInputs = z.infer<typeof loginSchema>;

export default function SignInForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [savePassword, setSavePassword] = useState(false);

  const { toast } = useToast();
  const navigate = useRouter();

  const loginForm = useForm<LoginFormInputs>({
    resolver: zodResolver(loginSchema),
  });

  const handleCheckboxChange = () => {
    setShowPassword(!showPassword);
  };

  const handleSavePasswordChange = () => {
    if (!savePassword) {
      localStorage.setItem("savedPassword", loginForm.getValues("password"));
    } else {
      localStorage.removeItem("savedPassword");
    }
    setSavePassword(!savePassword);
  };

  const handleLoginSubmit: SubmitHandler<LoginFormInputs> = async (data) => {
    try {
      const response = await api.post("login/signin", {
        username: data.username,
        password: data.password,
      });
      const token = response.data.accessToken;
      localStorage.setItem("token", token);
      const decoded: any = jwtDecode(token);
      const userId = response.data.id;
      localStorage.setItem("id", userId);
      navigate.push("/skills");
      toast({
        title: "Login successful",
        description: `Welcome ${data.username}`,
      });
    } catch (error) {
      loginForm.setError("username", {
        message: "Credenciais inválidas. Por favor, tente novamente.",
      });
    }
  };

  useEffect(() => {
    const savedPassword = localStorage.getItem("savedPassword");
    if (savedPassword) {
      loginForm.setValue("password", savedPassword);
      setSavePassword(true);
    }
  }, []);

  return (
    <>
      <Form {...loginForm}>
        <form onSubmit={loginForm.handleSubmit(handleLoginSubmit)}>
          <FormField
            control={loginForm.control}
            name="username"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Username</FormLabel>
                <FormControl>
                  <Input
                    {...loginForm.register("username")}
                    type="text"
                    placeholder="Login"
                  />
                </FormControl>
                <FormMessage>
                  {loginForm.formState.errors.username?.message}
                </FormMessage>
              </FormItem>
            )}
          />
          <FormField
            control={loginForm.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input
                    {...loginForm.register("password")}
                    type={showPassword ? "text" : "password"}
                    placeholder="password"
                  />
                </FormControl>

                <FormMessage>
                  {loginForm.formState.errors.password?.message}
                </FormMessage>
              </FormItem>
            )}
          />
          <div className="flex flex-col gap-5 mt-5">
            <div className="flex flex-row gap-3 justify-star">
              <Checkbox onClick={handleCheckboxChange} checked={showPassword} />
              <p>Mostrar senha</p>
            </div>
            <div className="flex flex-row gap-3 justify-star">
              <Checkbox
                onClick={handleSavePasswordChange}
                checked={savePassword}
              />
              <p>Salvar senha</p>
            </div>
            <Button type="submit">Entrar</Button>
          </div>
        </form>
      </Form>
    </>
  );
}
