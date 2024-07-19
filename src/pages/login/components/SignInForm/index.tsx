import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { jwtDecode } from "jwt-decode";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { z } from "zod";
import InputField from "@/components/inputField";
import CheckboxField from "@/components/checkBox";
import api from "@/pages/api/axios";
import { useToast } from "@/components/ui/use-toast";

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
    <Form {...loginForm}>
      <form onSubmit={loginForm.handleSubmit(handleLoginSubmit)}>
        <InputField
          placeholder="Login"
          label="Username"
          name="username"
          register={loginForm.register}
          error={loginForm.formState.errors.username}
        />
        <InputField
          placeholder="Senha"
          label="Password"
          name="password"
          type={showPassword ? "text" : "password"}
          register={loginForm.register}
          error={loginForm.formState.errors.password}
        />
        <div className="flex flex-col gap-5 mt-5">
          <CheckboxField
            label="Mostrar senha"
            checked={showPassword}
            onChange={handleCheckboxChange}
          />
          <CheckboxField
            label="Salvar senha"
            checked={savePassword}
            onChange={handleSavePasswordChange}
          />
          <Button type="submit">Entrar</Button>
        </div>
      </form>
    </Form>
  );
}
